/** Shared types for API and UI. */

export type StatsNavbarMetrics = {
  totalProjects: number;
  hotProjects: number;
  warmProjects: number;
  staleProjects: number;
  coldProjects: number;
  glacierProjects: number;
  totalTasks: number;
  blockedTasks: number;
  lastActivity: string;
};

export type ActivityDataPoint = { date: string; tasks: number };
