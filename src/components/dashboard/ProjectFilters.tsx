"use client";

export type ProjectFiltersState = {
  status: string;
  activityStatus: string;
  tag: string;
  search: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "shipped", label: "Shipped" },
];

const ACTIVITY_OPTIONS = [
  { value: "", label: "All activity" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "stale", label: "Stale" },
  { value: "cold", label: "Cold" },
  { value: "glacier", label: "Glacier" },
];

export const DEFAULT_FILTERS: ProjectFiltersState = {
  status: "",
  activityStatus: "",
  tag: "",
  search: "",
};

type Props = {
  filters: ProjectFiltersState;
  onFiltersChange: (filters: ProjectFiltersState) => void;
};

export default function ProjectFilters({ filters, onFiltersChange }: Props) {
  const handleChange = (key: keyof ProjectFiltersState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4">
      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="bg-[#1f2933] border border-[#374151] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#4b5563]"
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={filters.activityStatus}
        onChange={(e) => handleChange("activityStatus", e.target.value)}
        className="bg-[#1f2933] border border-[#374151] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] focus:outline-none focus:border-[#4b5563]"
        aria-label="Filter by activity status"
      >
        {ACTIVITY_OPTIONS.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search by name..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        className="bg-[#1f2933] border border-[#374151] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#4b5563] min-w-[160px]"
        aria-label="Search projects by name"
      />
      <input
        type="text"
        placeholder="Filter by tag..."
        value={filters.tag}
        onChange={(e) => handleChange("tag", e.target.value)}
        className="bg-[#1f2933] border border-[#374151] rounded-lg px-3 py-2 text-sm text-[#e5e7eb] placeholder-[#6b7280] focus:outline-none focus:border-[#4b5563] min-w-[140px]"
        aria-label="Filter projects by tag"
      />
    </div>
  );
}
