/**
 * Idea CRUD and business logic.
 */

import {
  getIdeasRaw,
  getIdeaById,
  createIdea as storeCreateIdea,
  updateIdea as storeUpdateIdea,
  deleteIdea as storeDeleteIdea,
  type StoreIdea,
} from "@/lib/store/memory-store";
import type { Idea } from "@/lib/idea-schema";
import type { IdeaCreatePayload } from "@/lib/idea-schema";

function toApiIdea(store: StoreIdea): Idea {
  return {
    id: store.id,
    text: store.text,
    createdAt: store.createdAt,
  };
}

export function listIdeas(): Idea[] {
  return getIdeasRaw()
    .filter((i) => !i.deletedStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(toApiIdea);
}

export function getIdea(id: string): Idea | null {
  const store = getIdeaById(id);
  return store ? toApiIdea(store) : null;
}

export function createIdea(payload: IdeaCreatePayload): Idea {
  const now = new Date().toISOString();
  const id = `idea-${Date.now()}`;
  const store = storeCreateIdea({ id, text: payload.text.trim(), createdAt: now });
  return toApiIdea(store);
}

export function updateIdea(id: string, updates: Partial<Pick<Idea, "text">>): Idea | null {
  const existing = getIdeaById(id);
  if (!existing) return null;
  const text = updates.text !== undefined ? updates.text.trim() : undefined;
  const updated = storeUpdateIdea(id, text !== undefined ? { text } : {});
  return updated ? toApiIdea(updated) : null;
}

export function deleteIdea(id: string): boolean {
  return storeDeleteIdea(id);
}
