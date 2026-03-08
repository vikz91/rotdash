"use client";

import { useState, useCallback, useEffect } from "react";
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
  getProjects,
  getDashboardStats,
  getProjectTasks,
  updateProject,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/api/client";
import type { Project } from "@/lib/project-schema";
import type { Task } from "@/lib/task-schema";
import type { StatsNavbarMetrics, ActivityDataPoint } from "@/lib/types";

const ITEMS_PER_PAGE = 20;

export default function DashboardContent() {
  const router = useRouter();
  const [filters, setFilters] = useState<ProjectFiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<{
    metrics: StatsNavbarMetrics;
    activity: ActivityDataPoint[];
  } | null>(null);
  const [projectsRes, setProjectsRes] = useState<{
    projects: Project[];
    total: number;
  } | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [modalTasks, setModalTasks] = useState<Task[]>([]);
  const [saving, setSaving] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const projectType = filters.projectType || undefined;
      const status = filters.status || undefined;
      const activityStatus = filters.activityStatus || undefined;
      const search = filters.search || undefined;

      const [projectsData, topSectionData] = await Promise.all([
        getProjects({
          page,
          limit: ITEMS_PER_PAGE,
          projectType,
          status,
          activityStatus,
          search,
        }),
        getProjects({ page: 1, limit: 1000 }),
      ]);

      setProjectsRes(projectsData);
      setAllProjects(topSectionData.projects);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    }
  }, [page, filters.projectType, filters.status, filters.activityStatus, filters.search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([loadStats(), loadProjects()]).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [loadStats, loadProjects]);

  const handleProjectClick = useCallback(async (project: Project) => {
    setSelectedProject(project);
    setModalProject(project);
    try {
      const tasks = await getProjectTasks(project.id);
      setModalTasks(tasks);
    } catch {
      setModalTasks([]);
    }
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setSelectedProject(null);
      setModalProject(null);
      setModalTasks([]);
    }
  }, []);

  const handleProjectUpdate = useCallback(
    async (updates: Partial<Project>) => {
      if (!modalProject || saving) return;
      setSaving(true);
      try {
        const updated = await updateProject(modalProject.id, updates);
        setModalProject(updated);
        await loadProjects();
        await loadStats();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update project");
      } finally {
        setSaving(false);
      }
    },
    [modalProject, saving, loadProjects, loadStats]
  );

  const handleTaskUpdate = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      if (saving) return;
      setSaving(true);
      try {
        const updated = await updateTask(taskId, updates);
        setModalTasks((prev) =>
          prev.map((t) => (t.id === taskId ? updated : t))
        );
        await loadStats();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to update task");
      } finally {
        setSaving(false);
      }
    },
    [saving, loadStats]
  );

  const handleTaskAdd = useCallback(
    async (task: Omit<Task, "id">) => {
      if (!modalProject || saving) return;
      setSaving(true);
      try {
        const newTask = await createTask(task);
        setModalTasks((prev) => [...prev, newTask]);
        await loadStats();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add task");
      } finally {
        setSaving(false);
      }
    },
    [modalProject, saving, loadStats]
  );

  const handleTaskDelete = useCallback(
    async (taskId: string) => {
      if (saving) return;
      setSaving(true);
      try {
        await deleteTask(taskId);
        setModalTasks((prev) => prev.filter((t) => t.id !== taskId));
        await loadStats();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to delete task");
      } finally {
        setSaving(false);
      }
    },
    [saving, loadStats]
  );

  const handleFiltersChange = (newFilters: ProjectFiltersState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const totalPages = projectsRes
    ? Math.max(1, Math.ceil(projectsRes.total / ITEMS_PER_PAGE))
    : 1;
  const currentPage = Math.min(page, totalPages);

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        {error}
      </div>
    );
  }

  const metrics = stats?.metrics ?? {
    totalProjects: 0,
    hotProjects: 0,
    warmProjects: 0,
    staleProjects: 0,
    coldProjects: 0,
    glacierProjects: 0,
    totalTasks: 0,
    blockedTasks: 0,
    lastActivity: "never",
  };
  const activityData = stats?.activity ?? [];
  const paginatedProjects = projectsRes?.projects ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StatsNavbar
        metrics={metrics}
        activityData={activityData}
        onCreateProject={() => router.push("/projects/new")}
      />
      <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 min-[2560px]:max-w-[2560px] min-[2560px]:px-20">
        <DashboardTopSection projects={allProjects} />
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
          isSaving={saving}
        />
      )}
    </div>
  );
}
