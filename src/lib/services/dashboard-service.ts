/**
 * Dashboard aggregations: metrics and activity graph.
 */

import { getProjectsRaw } from "@/lib/store/memory-store";
import { getTasksRaw } from "@/lib/store/memory-store";
import { calculateRotScore, getActivityStatus } from "@/lib/services/rot-service";
import { MOCK_ACTIVITY_GRAPH } from "@/lib/mock-data";
import type { StatsNavbarMetrics, ActivityDataPoint } from "@/lib/types";

function formatLastActivity(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function getDashboardStats(): { metrics: StatsNavbarMetrics; activity: ActivityDataPoint[] } {
  const projects = getProjectsRaw().filter((p) => !p.deletedStatus);
  const tasks = getTasksRaw().filter((t) => !t.deletedStatus);

  const activityDates: { date: string; tasks: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const dateKey = d.toISOString().slice(0, 10);
    const dateLabel = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    activityDates.push({ date: dateLabel, tasks: 0 });
  }

  let lastActivityDate: string | null = null;

  for (const p of projects) {
    const projDate = p.updatedAt;
    if (projDate && (!lastActivityDate || projDate > lastActivityDate)) {
      lastActivityDate = projDate;
    }
  }

  const dateToIndex = new Map<string, number>();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 29);
  for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dateToIndex.set(d.toISOString().slice(0, 10), i);
  }

  for (const t of tasks) {
    if (t.completedOn) {
      const idx = dateToIndex.get(t.completedOn);
      if (idx !== undefined) {
        activityDates[idx].tasks++;
      }
      if (!lastActivityDate || t.completedOn > lastActivityDate) {
        lastActivityDate = t.completedOn;
      }
    }
  }

  let hot = 0,
    warm = 0,
    stale = 0,
    cold = 0,
    glacier = 0;
  for (const p of projects) {
    const rs = calculateRotScore(p.updatedAt);
    const status = getActivityStatus(rs);
    if (status === "hot") hot++;
    else if (status === "warm") warm++;
    else if (status === "stale") stale++;
    else if (status === "cold") cold++;
    else glacier++;
  }

  const blockedTasks = tasks.filter((t) => t.status === "blocked").length;

  const metrics: StatsNavbarMetrics = {
    totalProjects: projects.length,
    hotProjects: hot,
    warmProjects: warm,
    staleProjects: stale,
    coldProjects: cold,
    glacierProjects: glacier,
    totalTasks: tasks.length,
    blockedTasks,
    lastActivity: lastActivityDate ? formatLastActivity(lastActivityDate) : "never",
  };

  const activity: ActivityDataPoint[] = activityDates;
  const hasVariation = activity.some((p) => p.tasks > 0);

  return {
    metrics,
    activity: hasVariation ? activity : MOCK_ACTIVITY_GRAPH,
  };
}

/**
 * Returns activity graph data (tasks completed per day, last 30 days).
 * Falls back to mock data when computation fails or store is unavailable.
 */
export function getActivityGraph(): { activity: ActivityDataPoint[] } {
  try {
    const { activity } = getDashboardStats();
    return { activity };
  } catch {
    return { activity: MOCK_ACTIVITY_GRAPH };
  }
}
