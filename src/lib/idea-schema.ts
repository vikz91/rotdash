/** Idea type for Idea Inbox. */

export type Idea = {
  id: string;
  text: string;
  createdAt: string; // ISO 8601
};

export type IdeaCreatePayload = {
  text: string;
};
