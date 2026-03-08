import {
  Flame,
  Sun,
  Leaf,
  Snowflake,
  MountainSnow,
  type LucideIcon,
} from "lucide-react";

export type ActivityStatus = "hot" | "warm" | "stale" | "cold" | "glacier";

export const ACTIVITY_COLORS: Record<
  ActivityStatus,
  { bg: string; bar: string; text: string }
> = {
  hot: { bg: "bg-emerald-500/20", bar: "bg-emerald-500", text: "text-emerald-500" },
  warm: { bg: "bg-amber-500/20", bar: "bg-amber-500", text: "text-amber-500" },
  stale: { bg: "bg-orange-500/20", bar: "bg-orange-500", text: "text-orange-500" },
  cold: { bg: "bg-red-500/20", bar: "bg-red-500", text: "text-red-500" },
  glacier: { bg: "bg-slate-500/20", bar: "bg-slate-500", text: "text-slate-400" },
};

export const ACTIVITY_ICONS: Record<ActivityStatus, LucideIcon> = {
  hot: Flame,
  warm: Sun,
  stale: Leaf,
  cold: Snowflake,
  glacier: MountainSnow,
};

export function getActivityConfig(status: string) {
  const key = status as ActivityStatus;
  const colors =
    key in ACTIVITY_COLORS ? ACTIVITY_COLORS[key] : ACTIVITY_COLORS.glacier;
  const icon = key in ACTIVITY_ICONS ? ACTIVITY_ICONS[key] : ACTIVITY_ICONS.glacier;
  return { colors, icon };
}
