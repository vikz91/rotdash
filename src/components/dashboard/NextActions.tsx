"use client";

import { ChevronRight } from "lucide-react";
import { getActivityConfig } from "@/lib/activity-config";
import type { Project } from "@/lib/project-schema";

const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

type NextActionsProps = {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
};

export default function NextActions({
  projects,
  onProjectClick,
}: NextActionsProps) {
  const nextActions = projects
    .filter((p) => p.nextTask)
    .sort((a, b) => b.rotScore - a.rotScore)
    .slice(0, 4);

  return (
    <div className={CARD_CLASSES}>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Next Actions
      </h3>
      <ul className="space-y-0">
        {nextActions.map((project) => {
          const { colors } = getActivityConfig(project.activityStatus);
          return (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => onProjectClick?.(project)}
                className="flex w-full items-center gap-3 rounded-md py-2.5 pr-2 text-left transition-colors hover:bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className={`h-4 w-1 shrink-0 rounded-sm ${colors.bar}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {project.nextTask}
                  </p>
                  <p className="text-sm text-muted-foreground">{project.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {project.rotScore === 0
                      ? "Updated today"
                      : project.rotScore === 1
                        ? "1 day inactive"
                        : `${project.rotScore} days inactive`}
                  </p>
                </div>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
