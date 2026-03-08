"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import type { Project } from "@/lib/project-schema";

const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

type ReviveProjectCardProps = {
  projects: Project[];
  onReviveProject: (project: Project) => void;
};

export default function ReviveProjectCard({
  projects,
  onReviveProject,
}: ReviveProjectCardProps) {
  const projectToRevive = projects
    .filter((p) => p.nextTask)
    .sort((a, b) => b.rotScore - a.rotScore)[0];

  if (!projectToRevive) {
    return (
      <div className={CARD_CLASSES}>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Revive a Project
        </h3>
        <p className="text-sm text-muted-foreground">
          No dormant projects with tasks. Add tasks to projects to revive them.
        </p>
      </div>
    );
  }

  const daysLabel =
    projectToRevive.rotScore === 0
      ? "Updated today"
      : projectToRevive.rotScore === 1
        ? "Last updated: 1 day ago"
        : `Last updated: ${projectToRevive.rotScore} days ago`;

  return (
    <div className={CARD_CLASSES}>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Revive a Project
      </h3>
      <div className="space-y-3">
        <p className="font-semibold text-foreground">{projectToRevive.name}</p>
        <p className="text-sm text-muted-foreground">{daysLabel}</p>
        <div className="pt-1">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Next task
          </p>
          <p className="text-sm text-foreground">
            {projectToRevive.nextTask}
          </p>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-700/40">
        <Button
          className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500"
          size="sm"
          onClick={() => onReviveProject(projectToRevive)}
        >
          <Sparkles className="size-3.5" />
          Revive Project
        </Button>
      </div>
    </div>
  );
}
