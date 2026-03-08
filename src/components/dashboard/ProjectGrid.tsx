"use client";

import ProjectCard from "@/components/dashboard/ProjectCard";
import type { Project } from "@/lib/project-schema";

export type { Project } from "@/lib/project-schema";

type ProjectGridProps = {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
};

export default function ProjectGrid({
  projects,
  onProjectClick,
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick ? () => onProjectClick(project) : undefined}
        />
      ))}
    </div>
  );
}
