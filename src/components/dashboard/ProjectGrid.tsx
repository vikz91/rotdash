"use client";

const ACTIVITY_COLORS: Record<string, string> = {
  hot: "#22c55e",
  warm: "#eab308",
  stale: "#f97316",
  cold: "#ef4444",
  glacier: "#64748b",
};

export type Project = {
  id: string;
  name: string;
  tags: string[];
  status: string;
  activityStatus: string;
  rotScore: number;
  healthStatus: string;
};

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const activityColor = ACTIVITY_COLORS[project.activityStatus] ?? "#64748b";

  return (
    <button
      type="button"
      className="bg-[#1f2933] border border-[#374151] rounded-lg p-4 text-left hover:border-[#4b5563] transition-colors"
      onClick={() => {}}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-[#e5e7eb] truncate">{project.name}</h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded shrink-0"
          style={{
            backgroundColor: `${activityColor}20`,
            color: activityColor,
          }}
        >
          {project.activityStatus}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-[#9ca3af] bg-[#111827] px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-xs text-[#9ca3af]">
        <span>{project.status}</span>
        <span>
          <span className="font-mono">{project.rotScore}d</span>
          <span className="ml-1">{project.healthStatus}</span>
        </span>
      </div>
    </button>
  );
}
