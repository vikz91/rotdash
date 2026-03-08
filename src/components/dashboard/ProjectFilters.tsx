"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ProjectFiltersState = {
  projectType: string;
  status: string;
  activityStatus: string;
  search: string;
  /** @deprecated Kept for backward compat */
  tag?: string;
};

const ALL = "all";

const PROJECT_TYPE_OPTIONS = [
  { value: ALL, label: "All types" },
  { value: "tool", label: "Tool" },
  { value: "devops", label: "DevOps" },
  { value: "webdev", label: "Web dev" },
  { value: "backend", label: "Backend" },
  { value: "side-project", label: "Side project" },
];

const STATUS_OPTIONS = [
  { value: ALL, label: "All status" },
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP" },
  { value: "shipped", label: "Shipped" },
];

const ACTIVITY_STATUS_OPTIONS = [
  { value: ALL, label: "All rot" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "stale", label: "Stale" },
  { value: "cold", label: "Cold" },
  { value: "glacier", label: "Glacier" },
];

export const DEFAULT_FILTERS: ProjectFiltersState = {
  projectType: "",
  status: "",
  activityStatus: "",
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

  const normalizedType = filters.projectType || ALL;
  const normalizedStatus = filters.status || ALL;
  const normalizedActivity = filters.activityStatus || ALL;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <Select
        value={normalizedType}
        onValueChange={(v) =>
          handleChange("projectType", v === ALL || !v ? "" : v)
        }
        items={Object.fromEntries(
          PROJECT_TYPE_OPTIONS.map((o) => [o.value, o.label])
        )}
      >
        <SelectTrigger
          className="h-9 min-w-[120px] rounded-lg border-slate-700/60 bg-slate-900/40"
          aria-label="Filter by project type"
        >
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          {PROJECT_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={normalizedStatus}
        onValueChange={(v) =>
          handleChange("status", v === ALL || !v ? "" : v)
        }
        items={Object.fromEntries(STATUS_OPTIONS.map((o) => [o.value, o.label]))}
      >
        <SelectTrigger
          className="h-9 min-w-[120px] rounded-lg border-slate-700/60 bg-slate-900/40"
          aria-label="Filter by status"
        >
          <SelectValue placeholder="All status" />
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
        value={normalizedActivity}
        onValueChange={(v) =>
          handleChange("activityStatus", v === ALL || !v ? "" : v)
        }
        items={Object.fromEntries(
          ACTIVITY_STATUS_OPTIONS.map((o) => [o.value, o.label])
        )}
      >
        <SelectTrigger
          className="h-9 min-w-[120px] rounded-lg border-slate-700/60 bg-slate-900/40"
          aria-label="Filter by rot status"
        >
          <SelectValue placeholder="All rot" />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITY_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-1 min-w-[200px] items-center gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="h-9 rounded-lg border-slate-700/60 bg-slate-900/40 pl-9 pr-3"
            aria-label="Search projects"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-lg border-slate-700/60 bg-slate-900/40"
          aria-label="More filters"
        >
          <SlidersHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
