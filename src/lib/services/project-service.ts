/**
 * Project CRUD and business logic.
 */

import {
  getProjectsRaw,
  getProjectById,
  createProject as storeCreateProject,
  updateProject as storeUpdateProject,
  deleteProject as storeDeleteProject,
  type StoreProject,
} from "@/lib/store/memory-store";
import { getTasksRaw } from "@/lib/store/memory-store";
import { calculateRotScore, getActivityStatus } from "@/lib/services/rot-service";
import type { Project } from "@/lib/project-schema";
import type { ProjectCreatePayload } from "@/lib/project-schema";

const PROJECT_TYPE_TAGS: Record<string, string[]> = {
  tool: ["tool"],
  devops: ["devops"],
  webdev: ["website", "webdev", "react"],
  backend: ["backend", "api"],
  "side-project": ["side-project"],
};

export type ProjectListParams = {
  page?: number;
  limit?: number;
  status?: string;
  activityStatus?: string;
  tag?: string;
  projectType?: string;
  search?: string;
};

function toApiProject(store: StoreProject, nextTask?: string): Project {
  const rotScore = calculateRotScore(store.updatedAt);
  const activityStatus = getActivityStatus(rotScore);
  return {
    id: store.id,
    name: store.name,
    description: store.description,
    tags: store.tags,
    status: store.status,
    activityStatus,
    rotScore,
    healthStatus: store.healthStatus,
    image: store.image,
    nextTask,
    githubUrl: store.githubUrl,
    prodUrl: store.prodUrl,
    analyticsUrl: store.analyticsUrl,
  };
}

function computeNextTask(projectId: string): string | undefined {
  const tasks = getTasksRaw().filter(
    (t) => t.projectId === projectId && !t.deletedStatus && t.status !== "done" && t.status !== "cancelled"
  );
  const first = tasks.sort((a, b) => (a.dueDate || "zzz").localeCompare(b.dueDate || "zzz"))[0];
  return first?.title;
}

export function listProjects(params: ProjectListParams = {}): {
  projects: Project[];
  total: number;
} {
  const { page = 1, limit = 20, status, activityStatus, tag, projectType, search } = params;

  let list = getProjectsRaw().filter((p) => !p.deletedStatus);

  if (status) {
    list = list.filter((p) => p.status === status);
  }
  if (activityStatus) {
    const rotScore = (p: StoreProject) => calculateRotScore(p.updatedAt);
    const as = (p: StoreProject) => getActivityStatus(rotScore(p));
    list = list.filter((p) => as(p) === activityStatus);
  }
  if (tag) {
    const tagLower = tag.toLowerCase();
    list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === tagLower));
  }
  if (projectType) {
    const allowedTags = PROJECT_TYPE_TAGS[projectType] ?? [projectType];
    const tagSet = new Set(allowedTags.map((t) => t.toLowerCase()));
    list = list.filter((p) =>
      p.tags.some((t) => tagSet.has(t.toLowerCase()))
    );
  }
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(searchLower));
  }

  list.sort((a, b) => {
    const rsA = calculateRotScore(a.updatedAt);
    const rsB = calculateRotScore(b.updatedAt);
    return rsB - rsA;
  });

  const total = list.length;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + limit);

  const projects = paginated.map((p) => {
    const nextTask = computeNextTask(p.id);
    return toApiProject(p, nextTask);
  });

  return { projects, total };
}

export function getProject(id: string): Project | null {
  const store = getProjectById(id);
  if (!store) return null;
  const nextTask = computeNextTask(store.id);
  return toApiProject(store, nextTask);
}

export function createProject(payload: ProjectCreatePayload): Project {
  const store = storeCreateProject({
    id: `p-${Date.now()}`,
    name: payload.name,
    description: payload.description ?? "",
    tags: payload.tags ?? [],
    status: payload.status,
    activityStatus: "hot",
    rotScore: 0,
    healthStatus: payload.healthStatus ?? "",
    image: payload.image,
    githubUrl: payload.githubUrl ?? "",
    prodUrl: payload.prodUrl ?? "",
    analyticsUrl: payload.analyticsUrl ?? "",
  });
  return toApiProject(store);
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const existing = getProjectById(id);
  if (!existing) return null;

  const storeUpdates: Partial<StoreProject> = {};
  if (updates.name !== undefined) storeUpdates.name = updates.name;
  if (updates.description !== undefined) storeUpdates.description = updates.description;
  if (updates.tags !== undefined) storeUpdates.tags = updates.tags;
  if (updates.status !== undefined) storeUpdates.status = updates.status;
  if (updates.healthStatus !== undefined) storeUpdates.healthStatus = updates.healthStatus;
  if (updates.image !== undefined) storeUpdates.image = updates.image;
  if (updates.githubUrl !== undefined) storeUpdates.githubUrl = updates.githubUrl;
  if (updates.prodUrl !== undefined) storeUpdates.prodUrl = updates.prodUrl;
  if (updates.analyticsUrl !== undefined) storeUpdates.analyticsUrl = updates.analyticsUrl;

  const updated = storeUpdateProject(id, storeUpdates);
  if (!updated) return null;
  const nextTask = computeNextTask(updated.id);
  return toApiProject(updated, nextTask);
}

export function deleteProject(id: string): boolean {
  return storeDeleteProject(id);
}

export function recalculateProjects(): void {
  // Rot score and activityStatus are computed from updatedAt on every read.
  // This endpoint exists for future DB use (e.g. batch recalculation job).
}
