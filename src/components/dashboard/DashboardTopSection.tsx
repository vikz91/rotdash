"use client";

import MostRottingProjects from "@/components/dashboard/MostRottingProjects";
import NextActions from "@/components/dashboard/NextActions";
import NotesAndIdeasPanel from "@/components/dashboard/NotesAndIdeasPanel";
import ReviveProjectCard from "@/components/dashboard/ReviveProjectCard";
import type { Project } from "@/lib/project-schema";

type DashboardTopSectionProps = {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
};

export default function DashboardTopSection({
  projects,
  onProjectClick,
}: DashboardTopSectionProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <MostRottingProjects projects={projects} />
      <NextActions
        projects={projects}
        onProjectClick={onProjectClick}
      />
      <ReviveProjectCard
        projects={projects}
        onReviveProject={onProjectClick ?? (() => {})}
      />
      <NotesAndIdeasPanel />
    </div>
  );
}
