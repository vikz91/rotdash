/**
 * Task CRUD and business logic.
 */

import {
  getTasksRaw,
  getTaskById,
  createTask as storeCreateTask,
  updateTask as storeUpdateTask,
  deleteTask as storeDeleteTask,
  type StoreTask,
} from "@/lib/store/memory-store";
import { updateProject as storeUpdateProject } from "@/lib/store/memory-store";
import type { Task } from "@/lib/task-schema";

function toApiTask(store: StoreTask): Task {
  return {
    id: store.id,
    projectId: store.projectId,
    title: store.title,
    description: store.description,
    status: store.status,
    dueDate: store.dueDate,
    completedOn: store.completedOn,
  };
}

export function listTasksByProject(projectId: string): Task[] {
  return getTasksRaw()
    .filter((t) => t.projectId === projectId && !t.deletedStatus)
    .map(toApiTask);
}

export function getTask(id: string): Task | null {
  const store = getTaskById(id);
  return store ? toApiTask(store) : null;
}

export function createTask(data: Omit<Task, "id">): Task {
  const id = `t-${Date.now()}`;
  const store = storeCreateTask({
    id,
    projectId: data.projectId,
    title: data.title,
    description: data.description ?? "",
    status: data.status ?? "todo",
    dueDate: data.dueDate ?? "",
    completedOn: data.completedOn ?? null,
  });

  // Touch project updatedAt when task is added
  storeUpdateProject(data.projectId, {});

  return toApiTask(store);
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const existing = getTaskById(id);
  if (!existing) return null;

  const storeUpdates: Partial<StoreTask> = {};
  if (updates.title !== undefined) storeUpdates.title = updates.title;
  if (updates.description !== undefined) storeUpdates.description = updates.description;
  if (updates.status !== undefined) {
    storeUpdates.status = updates.status;
    if (updates.status === "done") {
      storeUpdates.completedOn = new Date().toISOString().slice(0, 10);
    }
  }
  if (updates.dueDate !== undefined) storeUpdates.dueDate = updates.dueDate;

  const updated = storeUpdateTask(id, storeUpdates);
  if (!updated) return null;

  // Touch project updatedAt when task changes
  storeUpdateProject(updated.projectId, {});

  return toApiTask(updated);
}

export function deleteTask(id: string): boolean {
  const task = getTaskById(id);
  if (!task) return false;
  const deleted = storeDeleteTask(id);
  if (deleted) {
    storeUpdateProject(task.projectId, {});
  }
  return deleted;
}
