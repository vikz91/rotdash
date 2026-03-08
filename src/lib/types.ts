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
  /** Consecutive days with task completion or project update */
  buildStreak: number;
  /** Days since most recent project shipped */
  daysSinceLastShip: number | null;
  /** Insight message for GlobalInsightBanner */
  insightMessage: string | null;
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
