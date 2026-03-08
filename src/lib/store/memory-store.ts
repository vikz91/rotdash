/**
 * In-memory store backed by mock data. Mutations update the store;
 * subsequent reads reflect changes. Used by API routes until DB is connected.
 */

import { MOCK_IDEAS, MOCK_PROJECTS, MOCK_TASKS } from "@/lib/mock-data";
import type { Task } from "@/lib/task-schema";

type ActivityStatus = "hot" | "warm" | "stale" | "cold" | "glacier";

export type StoreProject = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: "idea" | "mvp" | "shipped";
  activityStatus: ActivityStatus;
  rotScore: number;
  healthStatus: string;
  image?: string;
  githubUrl: string;
  prodUrl: string;
  analyticsUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedStatus: boolean;
};

export type StoreTask = Task & {
  createdAt: string;
  updatedAt: string;
  deletedStatus: boolean;
};

export type StoreIdea = {
  id: string;
  text: string;
  createdAt: string;
  deletedStatus: boolean;
};

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
}

function seedProjects(): StoreProject[] {
  const now = new Date();

  return MOCK_PROJECTS.map((p) => {
    const updatedAtDate = addDays(now, -(p.rotScore ?? 0));
    const updatedAt = toIsoDate(updatedAtDate);
    const createdAt = updatedAt;
    const status = p.status as "idea" | "mvp" | "shipped";
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      tags: p.tags ?? [],
      status,
      activityStatus: (p.activityStatus ?? "warm") as ActivityStatus,
      rotScore: p.rotScore ?? 0,
      healthStatus: p.healthStatus ?? "",
      image: p.image,
      githubUrl: p.githubUrl ?? "",
      prodUrl: p.prodUrl ?? "",
      analyticsUrl: p.analyticsUrl ?? "",
      createdAt,
      updatedAt,
      deletedStatus: false,
    } as StoreProject;
  });
}

function seedTasks(): StoreTask[] {
  const today = toIsoDate(new Date());

  return MOCK_TASKS.map((t) => ({
    ...t,
    description: t.description ?? "",
    dueDate: t.dueDate ?? "",
    completedOn: t.completedOn ?? null,
    createdAt: today,
    updatedAt: today,
    deletedStatus: false,
  }));
}

function seedIdeas(): StoreIdea[] {
  return MOCK_IDEAS.map((i) => ({
    id: i.id,
    text: i.text,
    createdAt: i.createdAt,
    deletedStatus: false,
  }));
}

const projects: StoreProject[] = seedProjects();
const tasks: StoreTask[] = seedTasks();
const ideas: StoreIdea[] = seedIdeas();

export function getProjectsRaw(): StoreProject[] {
  return projects;
}

export function getTasksRaw(): StoreTask[] {
  return tasks;
}

export function getProjectById(id: string): StoreProject | undefined {
  return projects.find((p) => p.id === id && !p.deletedStatus);
}

export function getTaskById(id: string): StoreTask | undefined {
  return tasks.find((t) => t.id === id && !t.deletedStatus);
}

export function createProject(data: Omit<StoreProject, "createdAt" | "updatedAt" | "deletedStatus">): StoreProject {
  const now = toIsoDate(new Date());
  const project: StoreProject = {
    ...data,
    createdAt: now,
    updatedAt: now,
    deletedStatus: false,
  };
  projects.push(project);
  return project;
}

export function updateProject(id: string, updates: Partial<StoreProject>): StoreProject | undefined {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;

  const updatedAt = toIsoDate(new Date());
  projects[idx] = {
    ...projects[idx],
    ...updates,
    id: projects[idx].id,
    updatedAt,
  };
  return projects[idx];
}

export function deleteProject(id: string): boolean {
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  projects[idx].deletedStatus = true;
  projects[idx].updatedAt = toIsoDate(new Date());
  return true;
}

export function createTask(data: Omit<StoreTask, "createdAt" | "updatedAt" | "deletedStatus">): StoreTask {
  const now = toIsoDate(new Date());
  const task: StoreTask = {
    ...data,
    createdAt: now,
    updatedAt: now,
    deletedStatus: false,
  };
  tasks.push(task);
  return task;
}

export function updateTask(id: string, updates: Partial<StoreTask>): StoreTask | undefined {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;

  const updatedAt = toIsoDate(new Date());
  tasks[idx] = {
    ...tasks[idx],
    ...updates,
    id: tasks[idx].id,
    projectId: tasks[idx].projectId,
    updatedAt,
  };
  return tasks[idx];
}

export function deleteTask(id: string): boolean {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  tasks[idx].deletedStatus = true;
  tasks[idx].updatedAt = toIsoDate(new Date());
  return true;
}

export function getIdeasRaw(): StoreIdea[] {
  return ideas;
}

export function getIdeaById(id: string): StoreIdea | undefined {
  return ideas.find((i) => i.id === id && !i.deletedStatus);
}

export function createIdea(data: Omit<StoreIdea, "deletedStatus">): StoreIdea {
  const idea: StoreIdea = {
    ...data,
    deletedStatus: false,
  };
  ideas.push(idea);
  return idea;
}

export function updateIdea(id: string, updates: Partial<Pick<StoreIdea, "text">>): StoreIdea | undefined {
  const idx = ideas.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  ideas[idx] = { ...ideas[idx], ...updates, id: ideas[idx].id };
  return ideas[idx];
}

export function deleteIdea(id: string): boolean {
  const idx = ideas.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  ideas[idx].deletedStatus = true;
  return true;
}
