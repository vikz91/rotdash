/**
 * Rot score and activity status computation.
 * Logic lives only in backend per docs/INSTRUCTIONS.md.
 */

export type ActivityStatus = "hot" | "warm" | "stale" | "cold" | "glacier";

export function calculateRotScore(updatedAt: string): number {
  const updated = new Date(updatedAt);
  const now = new Date();
  updated.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - updated.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return Math.max(0, diffDays);
}

export function getActivityStatus(rotScore: number): ActivityStatus {
  if (rotScore <= 2) return "hot";
  if (rotScore <= 7) return "warm";
  if (rotScore <= 21) return "stale";
  if (rotScore <= 60) return "cold";
  return "glacier";
}
