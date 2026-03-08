"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatsNavbar from "@/components/dashboard/StatsNavbar";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import DashboardTopSection from "@/components/dashboard/DashboardTopSection";
import ProjectFilters, {
  DEFAULT_FILTERS,
  type ProjectFiltersState,
} from "@/components/dashboard/ProjectFilters";
import ProjectPagination from "@/components/dashboard/ProjectPagination";
import ProjectModal from "@/components/project/ProjectModal";
import {
  MOCK_METRICS,
  MOCK_ACTIVITY,
  MOCK_PROJECTS,
  MOCK_TASKS,
} from "@/lib/mock-data";
import type { Project } from "@/lib/project-schema";
import type { Task } from "@/lib/task-schema";

const ITEMS_PER_PAGE = 20;

const PROJECT_TYPE_TAGS: Record<string, string[]> = {
  tool: ["tool"],
  devops: ["devops"],
  webdev: ["website", "webdev", "react"],
  backend: ["backend", "api"],
  "side-project": ["side-project"],
};

function filterProjects(
  projects: Project[],
  filters: ProjectFiltersState,
): Project[] {
  return projects.filter((p) => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.activityStatus && p.activityStatus !== filters.activityStatus)
      return false;
    if (filters.projectType) {
      const allowedTags =
        PROJECT_TYPE_TAGS[filters.projectType] ?? [filters.projectType];
      const tagSet = new Set(p.tags.map((t) => t.toLowerCase()));
      if (!allowedTags.some((t) => tagSet.has(t.toLowerCase()))) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });
}

export default function DashboardContent() {
  const router = useRouter();
  const [filters, setFilters] = useState<ProjectFiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalTasks, setModalTasks] = useState<Task[]>([]);

  const handleProjectClick = useCallback((project: Project) => {
    const fullProject = MOCK_PROJECTS.find((p) => p.id === project.id) ?? project;
    setSelectedProject(fullProject as Project);
    setModalProject(fullProject as Project);
    setModalTasks(
      MOCK_TASKS.filter((t) => t.projectId === project.id).map((t) => ({ ...t })),
    );
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedProject(null);
      setModalProject(null);
      setModalTasks([]);
    }
  }, []);

  const handleProjectUpdate = useCallback((updates: Partial<Project>) => {
    setModalProject((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    setModalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    );
  }, []);

  const handleTaskAdd = useCallback(
    (task: Omit<Task, "id">) => {
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
      };
      setModalTasks((prev) => [...prev, newTask]);
    },
    [],
  );

  const handleTaskDelete = useCallback((taskId: string) => {
    setModalTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterProjects(MOCK_PROJECTS as Project[], filters);
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
        onCreateProject={() => router.push("/projects/new")}
      />
      <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 min-[2560px]:max-w-[2560px] min-[2560px]:px-20">
        <DashboardTopSection projects={MOCK_PROJECTS as Project[]} />
        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Projects by rot score (worst first)
          </h2>
          <ProjectFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <ProjectGrid
            projects={paginatedProjects}
            onProjectClick={handleProjectClick}
          />
          <ProjectPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setPage(Math.max(1, Math.min(p, totalPages)))}
          />
        </section>
      </div>

      {modalProject && (
        <ProjectModal
          project={modalProject}
          tasks={modalTasks}
          open={!!selectedProject}
          onOpenChange={handleModalOpenChange}
          onProjectUpdate={handleProjectUpdate}
          onTaskUpdate={handleTaskUpdate}
          onTaskAdd={handleTaskAdd}
          onTaskDelete={handleTaskDelete}
        />
      )}
    </div>
  );
}
