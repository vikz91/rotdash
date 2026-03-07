import MetricCards from "@/components/dashboard/MetricCards";
import ActivityChart from "@/components/dashboard/ActivityChart";
import ProjectGrid from "@/components/dashboard/ProjectGrid";
import {
  MOCK_METRICS,
  MOCK_ACTIVITY,
  MOCK_PROJECTS,
} from "@/lib/mock-data";

export default function Home() {
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
        <ProjectGrid projects={MOCK_PROJECTS} />
      </section>
    </div>
  );
}
