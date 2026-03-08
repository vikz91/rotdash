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

/** Single data point for the activity graph (tasks completed per day). */
export type ActivityDataPoint = { date: string; tasks: number };

/** Response shape for activity graph API. */
export type ActivityGraphResponse = {
  activity: ActivityDataPoint[];
};

/** Response shape for dashboard stats API (metrics + activity graph). */
export type DashboardStatsResponse = {
  metrics: StatsNavbarMetrics;
  activity: ActivityDataPoint[];
};
