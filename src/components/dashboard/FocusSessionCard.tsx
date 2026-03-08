"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivityConfig } from "@/lib/activity-config";
import type { Project } from "@/lib/project-schema";

const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

type FocusSessionCardProps = {
  projects: Project[];
};

export default function FocusSessionCard({ projects }: FocusSessionCardProps) {
  const nextActions = projects
    .filter((p) => p.nextTask)
    .sort((a, b) => b.rotScore - a.rotScore)
    .slice(0, 3);

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
              <div className="flex items-center gap-3 rounded-md py-2.5 pr-2 transition-colors hover:bg-slate-800/40">
                <span
                  className={`h-4 w-1 shrink-0 rounded-sm ${colors.bar}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    → {project.nextTask}
                  </p>
                </div>
                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 pt-4 border-t border-slate-700/40">
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-500"
          size="sm"
        >
          Start 30 min session
        </Button>
      </div>
    </div>
  );
}
