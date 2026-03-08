"use client";

import { getActivityConfig } from "@/lib/activity-config";
import type { Project } from "@/lib/project-schema";

const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

type MostRottingProjectsProps = {
  projects: Project[];
};

export default function MostRottingProjects({ projects }: MostRottingProjectsProps) {
  const top3 = [...projects]
    .sort((a, b) => b.rotScore - a.rotScore)
    .slice(0, 3);

  const unhealthyCount = projects.filter((p) =>
    ["stale", "cold", "glacier"].includes(p.activityStatus),
  ).length;
  const healthPercent = projects.length > 0
    ? Math.round((unhealthyCount / projects.length) * 100)
    : 0;

  return (
    <div className={CARD_CLASSES}>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Most Rotting Projects
      </h3>
      <ul className="space-y-4">
        {top3.map((project, i) => {
          const { colors, icon: Icon } = getActivityConfig(project.activityStatus);
          return (
            <li
              key={project.id}
              className="flex items-start gap-3"
            >
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                {i + 1}.
              </span>
              <Icon className={`mt-0.5 size-4 shrink-0 ${colors.text}`} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{project.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-700/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {project.rotScore} day
                  {project.rotScore === 1 ? "" : "s"} inactive
                </span>
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${colors.bar}`}
                  aria-hidden
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 pt-4 border-t border-slate-700/40">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Rot Index
        </p>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {healthPercent}%
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          of projects rotting
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/60">
          <div
            className="h-full rounded-full bg-amber-500/80 transition-all"
            style={{ width: `${healthPercent}%` }}
            role="progressbar"
            aria-valuenow={healthPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${healthPercent}% of projects are stale, cold, or glacier`}
          />
        </div>
      </div>
    </div>
  );
}
