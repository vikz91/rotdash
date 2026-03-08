/**
 * API client for frontend. Calls API routes; throws on non-2xx.
 */

import type { Project } from "@/lib/project-schema";
import type { ProjectCreatePayload } from "@/lib/project-schema";
import type { Task } from "@/lib/task-schema";
import type { StatsNavbarMetrics, ActivityDataPoint } from "@/lib/types";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export type GetProjectsParams = {
  page?: number;
  limit?: number;
  status?: string;
  activityStatus?: string;
  tag?: string;
  projectType?: string;
  search?: string;
};

export type GetProjectsResponse = {
  projects: Project[];
  total: number;
};

export async function getProjects(params: GetProjectsParams = {}): Promise<GetProjectsResponse> {
  const sp = new URLSearchParams();
  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.status) sp.set("status", params.status);
  if (params.activityStatus) sp.set("activityStatus", params.activityStatus);
  if (params.tag) sp.set("tag", params.tag);
  if (params.projectType) sp.set("projectType", params.projectType);
  if (params.search) sp.set("search", params.search);
  const qs = sp.toString();
  const url = `/api/projects${qs ? `?${qs}` : ""}`;
  return fetchJson<GetProjectsResponse>(url);
}

export async function createProject(payload: ProjectCreatePayload): Promise<Project> {
  return fetchJson<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id: string, payload: Partial<Project>): Promise<Project> {
  return fetchJson<Project>(`/api/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await fetchJson(`/api/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function recalculateProjects(): Promise<void> {
  await fetchJson("/api/projects/recalculate", { method: "POST" });
}

export async function getProjectTasks(projectId: string): Promise<Task[]> {
  return fetchJson<Task[]>(`/api/projects/${encodeURIComponent(projectId)}/tasks`);
}

export async function createTask(payload: Omit<Task, "id">): Promise<Task> {
  return fetchJson<Task>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: string, payload: Partial<Task>): Promise<Task> {
  return fetchJson<Task>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await fetchJson(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export type DashboardStatsResponse = {
  metrics: StatsNavbarMetrics;
  activity: ActivityDataPoint[];
};

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  return fetchJson<DashboardStatsResponse>("/api/dashboard/stats");
}
