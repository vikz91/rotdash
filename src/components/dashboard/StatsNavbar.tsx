"use client";

import Image from "next/image";
import {
  Plus,
  Flame,
  Sun,
  Leaf,
  Snowflake,
  MountainSnow,
  TrendingUp,
  Folder,
  CheckSquare,
  Ban,
  Clock,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

type TooltipContent = {
  /** Natural sentence with {value} placeholder. e.g. "{value} projects are hot — actively worked on." */
  body: string;
  next?: string;
};

const ACTIVITY_COLORS = {
  hot: "text-[#22c55e]",
  warm: "text-[#eab308]",
  stale: "text-[#f97316]",
  cold: "text-[#ef4444]",
  glacier: "text-[#A6D7F5]",
};

const MUTED_ICON = "text-muted-foreground";

type StatsNavbarProps = {
  metrics: StatsNavbarMetrics;
  activityData: ActivityDataPoint[];
  onCreateProject?: () => void;
};

export default function StatsNavbar({
  metrics,
  activityData,
  onCreateProject,
}: StatsNavbarProps) {
  const statItems = [
    {
      label: "Hot",
      value: metrics.hotProjects,
      accent: ACTIVITY_COLORS.hot,
      icon: Flame,
      tooltip: {
        body: "{value} projects are hot — actively worked on in the last 0–2 days.",
        next: "Keep the momentum going.",
      } satisfies TooltipContent,
    },
    {
      label: "Warm",
      value: metrics.warmProjects,
      accent: ACTIVITY_COLORS.warm,
      icon: Sun,
      tooltip: {
        body: "{value} projects are warm — slowing down, last updated 3–7 days ago.",
        next: "Consider touching base soon.",
      } satisfies TooltipContent,
    },
    {
      label: "Stale",
      value: metrics.staleProjects,
      accent: ACTIVITY_COLORS.stale,
      icon: Leaf,
      tooltip: {
        body: "{value} projects are stale — neglected for 8–21 days.",
        next: "Time to revisit.",
      } satisfies TooltipContent,
    },
    {
      label: "Cold",
      value: metrics.coldProjects,
      accent: ACTIVITY_COLORS.cold,
      icon: Snowflake,
      tooltip: {
        body: "{value} projects are cold — almost dormant, 22–60 days since last update.",
        next: "This project may need attention.",
      } satisfies TooltipContent,
    },
    {
      label: "Glacier",
      value: metrics.glacierProjects,
      accent: ACTIVITY_COLORS.glacier,
      icon: MountainSnow,
      tooltip: {
        body: "{value} projects are in glacier — forgotten, over 60 days since last update.",
        next: "Consider archiving or reviving.",
      } satisfies TooltipContent,
    },
    {
      label: "Projects",
      value: metrics.totalProjects,
      icon: Folder,
      accent: MUTED_ICON,
      tooltip: {
        body: "You're tracking {value} projects in total.",
        next: "Add a new project to stay on top of your work.",
      } satisfies TooltipContent,
    },

    {
      label: "Tasks",
      value: metrics.totalTasks,
      icon: CheckSquare,
      accent: MUTED_ICON,
      tooltip: {
        body: "{value} tasks across all your projects.",
        next: "Complete tasks to improve activity scores.",
      } satisfies TooltipContent,
      separatorBefore: true,
    },
    {
      label: "Blocked",
      value: metrics.blockedTasks,
      icon: Ban,
      accent: "text-[#f97316]",
      iconAccent: MUTED_ICON,
      tooltip: {
        body: "{value} tasks are blocked — waiting on dependencies or decisions.",
        next: "Unblock these to keep projects moving.",
      } satisfies TooltipContent,
    },
    {
      label: "Last activity",
      value: metrics.lastActivity,
      valueDisplay: metrics.lastActivity,
      icon: Clock,
      accent: MUTED_ICON,
      tooltip: {
        body: "Your last activity was {value} — when you last completed a task or updated a project.",
        next: "Stay active to keep projects from rotting.",
      } satisfies TooltipContent,
    },
  ];

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto w-full max-w-[1920px] px-1 py-3 sm:px-2 md:px-2 lg:px-2 xl:px-4 2xl:px-4 min-[2560px]:max-w-[2560px] min-[2560px]:px-20">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 shrink-0">
            <Image
              src="/rotdash-logo.png"
              alt="RotDash Logo"
              width={120}
              height={36}
              className="shrink-0"
            />
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-sm">
              {statItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    {item.separatorBefore && (
                      <span
                        className="w-px h-4 bg-border/70 shrink-0 ml-1 mr-1"
                        aria-hidden
                      />
                    )}
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="flex items-center gap-1.5 cursor-default inline-flex">
                          {Icon ? (
                            <Icon
                              className={`size-3.5 shrink-0 ${item.iconAccent ?? item.accent ?? "text-muted-foreground"}`}
                              aria-hidden
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {item.label}:
                            </span>
                          )}
                          <span
                            className={
                              item.accent
                                ? `font-semibold ${item.accent}`
                                : "font-semibold text-foreground"
                            }
                          >
                            {item.valueDisplay ?? item.value}
                          </span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="min-w-[200px] max-w-[260px] p-0 flex flex-col overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                          {Icon && (
                            <Icon
                              className={`size-4 shrink-0 ${item.iconAccent ?? item.accent ?? "text-muted-foreground"}`}
                              aria-hidden
                            />
                          )}
                          <span className="font-semibold text-sm text-background">
                            {item.label}
                          </span>
                        </div>
                        <p className="px-3 pb-3 text-xs text-background/90 leading-relaxed">
                          {item.tooltip.body
                            .split("{value}")
                            .map((part, i) =>
                              i === 0 ? (
                                part
                              ) : (
                                <span key={i}>
                                  <span className="font-semibold text-background">
                                    {item.valueDisplay ?? item.value}
                                  </span>
                                  {part}
                                </span>
                              )
                            )}
                        </p>
                        {item.tooltip.next && (
                          <footer className="border-t border-background/20 px-3 py-2">
                            <p className="text-[10px] text-background/70">
                              {item.tooltip.next}
                            </p>
                          </footer>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex flex-1 min-w-[120px]">
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="block w-full min-h-8 h-8 rounded-md overflow-hidden bg-muted/30 cursor-default" />
                }
              >
                <ResponsiveContainer width="100%" height={32}>
                  <LineChart
                    data={activityData}
                    margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                  >
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="var(--chart-1)"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="min-w-[220px] max-w-[260px] p-0 flex flex-col overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                <TrendingUp
                  className="size-4 shrink-0 text-[var(--chart-1)]"
                  aria-hidden
                />
                <span className="font-semibold text-sm text-background">
                  Activity trend
                </span>
              </div>
              <p className="px-3 pb-3 text-xs text-background/90 leading-relaxed">
                Tasks completed per day across your projects over the last 30
                days. Higher bars indicate more active periods.
              </p>
              <footer className="border-t border-background/20 px-3 py-2">
                <p className="text-[10px] text-background/70">
                  Scroll down for the full chart and project details.
                </p>
              </footer>
            </TooltipContent>
          </Tooltip>
          </div>
          <Button
            size="lg"
            onClick={onCreateProject}
            className="gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            New Project
          </Button>
        </div>
      </div>
    </nav>
  );
}
