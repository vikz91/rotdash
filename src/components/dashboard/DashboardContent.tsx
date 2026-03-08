"use client";

import { useState, useMemo } from "react";
import StatsNavbar from "@/components/dashboard/StatsNavbar";
import MetricCards from "@/components/dashboard/MetricCards";
import ProjectActivityPie from "@/components/dashboard/ProjectActivityPie";
import ActivityChart from "@/components/dashboard/ActivityChart";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import ProjectFilters, {
  DEFAULT_FILTERS,
  type ProjectFiltersState,
} from "@/components/dashboard/ProjectFilters";
import ProjectPagination from "@/components/dashboard/ProjectPagination";
import {
  MOCK_METRICS,
  MOCK_ACTIVITY,
  MOCK_ACTIVITY_DISTRIBUTION,
  MOCK_PROJECTS,
} from "@/lib/mock-data";
import type { Project } from "@/components/dashboard/ProjectGrid";

const ITEMS_PER_PAGE = 20;

function filterProjects(
  projects: Project[],
  filters: ProjectFiltersState,
): Project[] {
  return projects.filter((p) => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.activityStatus && p.activityStatus !== filters.activityStatus)
      return false;
    if (filters.tag) {
      const tagLower = filters.tag.toLowerCase();
      if (!p.tags.some((t) => t.toLowerCase().includes(tagLower))) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });
}

export default function DashboardContent() {
  const [filters, setFilters] = useState<ProjectFiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterProjects(MOCK_PROJECTS, filters);
    return [...filtered].sort((a, b) => b.rotScore - a.rotScore);
  }, [filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSorted, currentPage]);

  const handleFiltersChange = (newFilters: ProjectFiltersState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StatsNavbar
        metrics={MOCK_METRICS}
        activityData={MOCK_ACTIVITY}
        onCreateProject={() => {
          /* TODO: open create project modal */
        }}
      />
      <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 min-[2560px]:max-w-[2560px] min-[2560px]:px-20">
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Projects by rot score (worst first)
          </h2>
          <ProjectFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <ProjectGrid projects={paginatedProjects} />
          <ProjectPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setPage(Math.max(1, Math.min(p, totalPages)))}
          />
        </section>
      </div>
    </div>
  );
}
