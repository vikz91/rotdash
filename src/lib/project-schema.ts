/** Project type for dashboard and modal (includes computed fields). */

export type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  status: "idea" | "mvp" | "shipped";
  activityStatus: string;
  rotScore: number;
  healthStatus?: string;
  image?: string;
  nextTask?: string;
  githubUrl: string;
  prodUrl: string;
  analyticsUrl: string;
};

/** Project create payload — user-provided fields only. Backend computes activityStatus, rotScore, etc. */

export type ProjectCreatePayload = {
  name: string;
  description: string;
  image: string;
  githubUrl: string;
  prodUrl: string;
  analyticsUrl: string;
  tags: string[];
  status: "idea" | "mvp" | "shipped";
  healthStatus: "+" | "-" | "";
};

export const PROJECT_STATUS_OPTIONS = [
  { value: "idea", label: "Idea", tooltip: "Just an idea. Not started." },
  { value: "mvp", label: "MVP", tooltip: "In progress. Building it." },
  { value: "shipped", label: "Shipped", tooltip: "Live. Maintaining it." },
] as const;

export const HEALTH_STATUS_OPTIONS = [
  { value: "+", label: "On track", description: "Making progress" },
  { value: "-", label: "Struggling", description: "Needs attention" },
] as const;

export function createDefaultPayload(): ProjectCreatePayload {
  return {
    name: "",
    description: "",
    image: "",
    githubUrl: "",
    prodUrl: "",
    analyticsUrl: "",
    tags: [],
    status: "idea",
    healthStatus: "",
  };
}

/** Parse comma-separated tags into trimmed, non-empty array */
export function parseTags(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
