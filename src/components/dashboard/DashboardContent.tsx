"use client";

import { useState, useMemo } from "react";
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
import Image from "next/image";

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

  const metrics = [
    { label: "Total Projects", value: MOCK_METRICS.totalProjects },
    { label: "Total Tasks", value: MOCK_METRICS.totalTasks },
    {
      label: "Blocked",
      value: MOCK_METRICS.blockedTasks,
      accent: "text-[#f97316]",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 min-[2560px]:max-w-[2560px] min-[2560px]:px-20">
        <header className="mb-8">
          <Image
            src={"/rotdash-logo.png"}
            alt="RotDash Logo"
            width={120}
            height={120}
          />
          <p className="mt-1 text-sm text-muted-foreground">
            See which of your projects are alive — and which are rotting.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Overview
          </h2>
          <div className="flex flex-wrap gap-3 items-stretch">
            <div className="min-w-0 flex-[1_1_12rem] max-w-xs">
              <MetricCards metrics={metrics} stacked />
            </div>
            <div className="min-w-0 flex-[1_1_14rem] max-w-sm">
              <ProjectActivityPie data={MOCK_ACTIVITY_DISTRIBUTION} />
            </div>
            <div className="min-w-0 flex-[2_1_20rem] min-[800px]:flex-[3_1_28rem]">
              <div className="h-full">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tasks completed per day (last 30 days)
                </p>
                <ActivityChart data={MOCK_ACTIVITY} />
              </div>
            </div>
          </div>
        </section>

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
