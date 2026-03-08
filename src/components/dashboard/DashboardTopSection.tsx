"use client";

import MostRottingProjects from "@/components/dashboard/MostRottingProjects";
import NextActions from "@/components/dashboard/NextActions";
import FocusSessionCard from "@/components/dashboard/FocusSessionCard";
import type { Project } from "@/lib/project-schema";

type DashboardTopSectionProps = {
  projects: Project[];
};

export default function DashboardTopSection({ projects }: DashboardTopSectionProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <MostRottingProjects projects={projects} />
      <NextActions projects={projects} />
      <FocusSessionCard projects={projects} />
    </div>
  );
}
