"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Flame,
  Sun,
  Leaf,
  Snowflake,
  MountainSnow,
  ChevronRight,
  CheckSquare,
} from "lucide-react";

const ACTIVITY_CONFIG: Record<
  string,
  { color: string; bgClass: string; icon: React.ElementType }
> = {
  hot: {
    color: "#22c55e",
    bgClass: "bg-[#22c55e]/20 text-[#22c55e]",
    icon: Flame,
  },
  warm: {
    color: "#eab308",
    bgClass: "bg-[#eab308]/20 text-[#eab308]",
    icon: Sun,
  },
  stale: {
    color: "#f97316",
    bgClass: "bg-[#f97316]/20 text-[#f97316]",
    icon: Leaf,
  },
  cold: {
    color: "#ef4444",
    bgClass: "bg-[#ef4444]/20 text-[#ef4444]",
    icon: Snowflake,
  },
  glacier: {
    color: "#64748b",
    bgClass: "bg-[#64748b]/20 text-[#64748b]",
    icon: MountainSnow,
  },
};

const PLACEHOLDER_IMAGE = "/placeholder-project.svg";

export type Project = {
  id: string;
  name: string;
  tags: string[];
  status: string;
  activityStatus: string;
  rotScore: number;
  healthStatus: string;
  image?: string;
  nextTask?: string;
};

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2560px]:grid-cols-6 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !project.image || imageError;
  const activity = ACTIVITY_CONFIG[project.activityStatus] ?? ACTIVITY_CONFIG.glacier;
  const ActivityIcon = activity.icon;

  return (
    <button
      type="button"
      onClick={() => {}}
      className={cn(
        "group relative flex min-h-[200px] flex-col overflow-hidden rounded-xl",
        "ring-1 ring-border/80 transition-all duration-200",
        "hover:scale-[1.02] hover:ring-foreground/25 hover:shadow-xl hover:shadow-black/15",
        "cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {/* Background image layer - opacity handled */}
      <div className="absolute inset-0">
        {showPlaceholder ? (
          <img
            src={PLACEHOLDER_IMAGE}
            alt=""
            className="h-full w-full object-cover opacity-35"
            aria-hidden
          />
        ) : (
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover opacity-40 transition-opacity group-hover:opacity-50"
            aria-hidden
            onError={() => setImageError(true)}
          />
        )}
        {/* Dark gradient overlay for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"
          aria-hidden
        />
      </div>

      {/* Content overlay */}
      <div className="relative flex min-h-[200px] flex-1 flex-col p-4">
        {/* Top: name, status, activity */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex-1 truncate font-semibold text-foreground drop-shadow-sm">
            {project.name}
          </h3>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              activity.bgClass
            )}
          >
            <ActivityIcon className="h-3.5 w-3.5" aria-hidden />
            {project.activityStatus}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                "bg-foreground/10 text-muted-foreground backdrop-blur-sm"
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Middle spacer - pushes footer down */}
        <div className="flex-1" />

        {/* Footer: rot score, health, next task */}
        <div className="mt-auto flex flex-col gap-2 border-t border-foreground/10 pt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{project.status}</span>
            <span className="flex items-center gap-1.5">
              <span className="font-mono font-medium tabular-nums">
                {project.rotScore}d
              </span>
              <span
                className={cn(
                  "text-sm",
                  project.healthStatus === "+"
                    ? "text-emerald-500"
                    : "text-rose-500/90"
                )}
              >
                {project.healthStatus}
              </span>
            </span>
          </div>
          {project.nextTask ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckSquare
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
                aria-hidden
              />
              <span className="truncate">{project.nextTask}</span>
              <ChevronRight
                className="ml-auto h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
                aria-hidden
              />
            </div>
          ) : (
            <div className="text-xs italic text-muted-foreground/60">
              No upcoming tasks
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
