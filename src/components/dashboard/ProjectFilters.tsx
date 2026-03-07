"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProjectFiltersState = {
  status: string;
  activityStatus: string;
  tag: string;
  search: string;
};

const ALL_STATUS = "all";
const ALL_ACTIVITY = "all";

const STATUS_OPTIONS = [
  { value: ALL_STATUS, label: "All statuses" },
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "shipped", label: "Shipped" },
];

const ACTIVITY_OPTIONS = [
  { value: ALL_ACTIVITY, label: "All activity" },
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
    <div className="mb-4 flex flex-col flex-wrap gap-3 sm:flex-row">
      <Select
        value={filters.status || ALL_STATUS}
        onValueChange={(v) => handleChange("status", v === ALL_STATUS || !v ? "" : v)}
      >
        <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]" aria-label="Filter by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.activityStatus || ALL_ACTIVITY}
        onValueChange={(v) => handleChange("activityStatus", v === ALL_ACTIVITY || !v ? "" : v)}
      >
        <SelectTrigger className="w-full min-w-[140px] sm:w-[160px]" aria-label="Filter by activity status">
          <SelectValue placeholder="All activity" />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Search by name..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        className="min-w-[160px] sm:w-[180px]"
        aria-label="Search projects by name"
      />
      <Input
        type="text"
        placeholder="Filter by tag..."
        value={filters.tag}
        onChange={(e) => handleChange("tag", e.target.value)}
        className="min-w-[140px] sm:w-[160px]"
        aria-label="Filter projects by tag"
      />
    </div>
  );
}
