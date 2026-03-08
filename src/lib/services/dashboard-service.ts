/**
 * Dashboard aggregations: metrics and activity graph.
 */

import { getProjectsRaw } from "@/lib/store/memory-store";
import { getTasksRaw } from "@/lib/store/memory-store";
import {
  calculateRotScore,
  getActivityStatus,
} from "@/lib/services/rot-service";
import { MOCK_ACTIVITY_GRAPH } from "@/lib/mock-data";
import type { StatsNavbarMetrics, ActivityDataPoint } from "@/lib/types";

/**
 * Build streak: consecutive days (starting today) with completed tasks.
 * Uses task.completedOn dates. Stops at first day without activity.
 */
function getBuildStreak(tasks: { completedOn: string | null }[]): number {
  const activityDates = new Set<string>();
  for (const t of tasks) {
    if (t.completedOn) activityDates.add(t.completedOn);
  }
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (!activityDates.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/**
 * Days since most recent project shipment (project.status = shipped, lastShippedAt set).
 */
function getDaysSinceLastShip(
  projects: { status: string; lastShippedAt?: string }[],
): number | null {
  const shipped = projects
    .filter((p) => p.status === "shipped" && p.lastShippedAt)
    .map((p) => p.lastShippedAt!);
  if (shipped.length === 0) return null;
  const latest = shipped.sort().reverse()[0];
  const ship = new Date(latest);
  const now = new Date();
  ship.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - ship.getTime()) / (24 * 60 * 60 * 1000));
}

/** Projects approaching glacier: 50 ≤ rotScore < 60. */
function getDecayAlertMessage(
  projects: { id: string; name: string; rotScore: number }[],
): string | null {
  const GLACIER_THRESHOLD = 60;
  const ALERT_THRESHOLD = 50;
  const approaching = projects.filter(
    (p) => p.rotScore >= ALERT_THRESHOLD && p.rotScore < GLACIER_THRESHOLD,
  );
  if (approaching.length === 0) return null;

  const thisWeek = approaching.filter((p) => p.rotScore >= 53);
  if (thisWeek.length > 0) {
    if (thisWeek.length === 1) {
      const daysLeft = GLACIER_THRESHOLD - thisWeek[0].rotScore;
      return `${thisWeek[0].name} will become glacier in ${daysLeft} days`;
    }
    return `${thisWeek.length} projects will become glacier this week`;
  }
  const closest = [...approaching].sort((a, b) => b.rotScore - a.rotScore)[0];
  const daysLeft = GLACIER_THRESHOLD - closest.rotScore;
  if (approaching.length === 1) {
    return `⚠ ${closest.name} will become glacier in ${daysLeft} days`;
  }
  return `⚠ ${approaching.length} projects will become glacier this week`;
}

/**
 * Insight message for GlobalInsightBanner. Priority: decay alerts > shipping > build streak.
 */
function getInsightMessage(
  projects: { id: string; name: string; rotScore: number }[],
  daysSinceLastShip: number | null,
  buildStreak: number,
  rotPercent: number,
): string | null {
  const decayAlert = getDecayAlertMessage(projects);
  if (decayAlert) return decayAlert;

  if (daysSinceLastShip !== null) {
    if (daysSinceLastShip >= 30)
      return `You haven't shipped anything in ${daysSinceLastShip} days`;
    if (daysSinceLastShip >= 7)
      return `Last project shipped ${daysSinceLastShip} days ago`;
    if (daysSinceLastShip <= 2) {
      const suffix =
        daysSinceLastShip === 0
          ? "today"
          : daysSinceLastShip === 1
            ? "yesterday"
            : `${daysSinceLastShip} days ago`;
      return `Last project shipped ${suffix}`;
    }
    return `Last project shipped ${daysSinceLastShip} days ago`;
  }
  if (buildStreak >= 2) return `You're on a ${buildStreak} day build streak`;
  if (rotPercent >= 50)
    return `${Math.round(rotPercent)}% of your projects are rotting`;
  return null;
}

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

export function getDashboardStats(): {
  metrics: StatsNavbarMetrics;
  activity: ActivityDataPoint[];
} {
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

  const buildStreak = getBuildStreak(tasks);
  const daysSinceLastShip = getDaysSinceLastShip(projects);
  const rotPercent =
    projects.length > 0
      ? (100 * (stale + cold + glacier)) / projects.length
      : 0;
  const insightMessage = getInsightMessage(
    projects.map((p) => ({ id: p.id, name: p.name, rotScore: p.rotScore })),
    daysSinceLastShip,
    buildStreak,
    rotPercent,
  );

  const metrics: StatsNavbarMetrics = {
    totalProjects: projects.length,
    hotProjects: hot,
    warmProjects: warm,
    staleProjects: stale,
    coldProjects: cold,
    glacierProjects: glacier,
    totalTasks: tasks.length,
    blockedTasks,
    lastActivity: lastActivityDate
      ? formatLastActivity(lastActivityDate)
      : "never",
    buildStreak,
    daysSinceLastShip,
    insightMessage,
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
