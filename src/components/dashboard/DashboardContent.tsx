"use client";

import { useState, useMemo, useEffect } from "react";
import MetricCards from "@/components/dashboard/MetricCards";
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
  MOCK_PROJECTS,
} from "@/lib/mock-data";
import type { Project } from "@/components/dashboard/ProjectGrid";

const ITEMS_PER_PAGE = 20;

function filterProjects(
  projects: Project[],
  filters: ProjectFiltersState
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
    Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE)
  );
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);
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
    { label: "Hot", value: MOCK_METRICS.hotProjects, accent: "text-[#22c55e]" },
    { label: "Cold", value: MOCK_METRICS.coldProjects, accent: "text-[#ef4444]" },
    {
      label: "Glacier",
      value: MOCK_METRICS.glacierProjects,
      accent: "text-[#64748b]",
    },
    { label: "Total Tasks", value: MOCK_METRICS.totalTasks },
    {
      label: "Blocked",
      value: MOCK_METRICS.blockedTasks,
      accent: "text-[#f97316]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#e5e7eb] p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">💀 RotDash</h1>
        <p className="text-[#9ca3af] mt-1 text-sm">
          See which of your projects are alive — and which are rotting.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider mb-4">
          Overview
        </h2>
        <MetricCards metrics={metrics} />
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider mb-4">
          Tasks completed per day (last 30 days)
        </h2>
        <ActivityChart data={MOCK_ACTIVITY} />
      </section>

      <section>
        <h2 className="text-sm font-medium text-[#9ca3af] uppercase tracking-wider mb-4">
          Projects by rot score (worst first)
        </h2>
        <ProjectFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <ProjectGrid projects={paginatedProjects} />
        <ProjectPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
