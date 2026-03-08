"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/project-schema";
import {
  Flame,
  Sun,
  Leaf,
  Snowflake,
  MountainSnow,
} from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder-project.svg";

const ACTIVITY_CONFIG: Record<
  string,
  {
    borderColor: string;
    bgClass: string;
    icon: React.ElementType;
  }
> = {
  hot: {
    borderColor: "border-l-emerald-500",
    bgClass: "bg-emerald-500/20 text-emerald-500",
    icon: Flame,
  },
  warm: {
    borderColor: "border-l-amber-500",
    bgClass: "bg-amber-500/20 text-amber-500",
    icon: Sun,
  },
  stale: {
    borderColor: "border-l-orange-500",
    bgClass: "bg-orange-500/20 text-orange-500",
    icon: Leaf,
  },
  cold: {
    borderColor: "border-l-red-500",
    bgClass: "bg-red-500/20 text-red-500",
    icon: Snowflake,
  },
  glacier: {
    borderColor: "border-l-slate-500",
    bgClass: "bg-slate-500/20 text-slate-400",
    icon: MountainSnow,
  },
};

export type { Project };

type ProjectCardProps = {
  project: Project;
  onClick?: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !project.image || imageError;
  const imageSrc = showPlaceholder ? PLACEHOLDER_IMAGE : project.image!;

  const activity =
    ACTIVITY_CONFIG[project.activityStatus] ?? ACTIVITY_CONFIG.glacier;
  const ActivityIcon = activity.icon;

  const middleText = project.nextTask
    ? `${project.status.charAt(0).toUpperCase() + project.status.slice(1)} · ${project.nextTask}`
    : project.status
      ? `${project.status.charAt(0).toUpperCase() + project.status.slice(1)} · No upcoming tasks`
      : "No upcoming tasks";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex min-h-[180px] flex-col overflow-hidden rounded-xl text-left",
        "border border-slate-700/40 bg-slate-900/60 backdrop-blur",
        "border-l-4 transition-all duration-200",
        activity.borderColor,
        "hover:border-emerald-500/50 hover:shadow-lg hover:shadow-black/10",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "cursor-pointer",
      )}
    >
      {/* Background image layer */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover opacity-60 transition-opacity group-hover:opacity-70"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          onError={() => setImageError(true)}
          unoptimized={imageSrc.startsWith("http")}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20"
          aria-hidden
        />
      </div>

      <div className="relative flex flex-1 flex-col p-4">
        {/* Top: title, tags, activity badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">
              {project.name}
            </h3>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-slate-700/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium",
              activity.bgClass,
            )}
          >
            <ActivityIcon className="size-3" aria-hidden />
            {project.activityStatus}
          </span>
        </div>

        {/* Middle: description / next task */}
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
          {middleText}
        </p>

        {/* Bottom: rot score, activity label */}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">
            ~{project.rotScore}d
            {project.healthStatus === "-" ? "-" : ""}
          </span>
          <span className="text-muted-foreground/80">{project.activityStatus}</span>
        </div>
      </div>
    </button>
  );
}
