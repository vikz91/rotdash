"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Github,
  ExternalLink,
  BarChart3,
  Plus,
  Trash2,
  Pencil,
} from "lucide-react";
import type { Project } from "@/lib/project-schema";
import {
  PROJECT_STATUS_OPTIONS,
  HEALTH_STATUS_OPTIONS,
  parseTags,
} from "@/lib/project-schema";
import type { Task, TaskStatus } from "@/lib/task-schema";
import { TASK_STATUS_OPTIONS } from "@/lib/task-schema";

type ProjectModalProps = {
  project: Project;
  tasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdate: (updates: Partial<Project>) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskAdd: (task: Omit<Task, "id">) => void;
  onTaskDelete: (taskId: string) => void;
  isSaving?: boolean;
};

export default function ProjectModal({
  project,
  tasks,
  open,
  onOpenChange,
  onProjectUpdate,
  onTaskUpdate,
  onTaskAdd,
  onTaskDelete,
  isSaving = false,
}: ProjectModalProps) {
  const [editingTaskDescId, setEditingTaskDescId] = useState<string | null>(
    null,
  );
  const tagsDisplay = project.tags.join(", ");

  const handleTagsChange = (value: string) => {
    onProjectUpdate({ tags: parseTags(value) });
  };

  const handleAddTask = () => {
    onTaskAdd({
      projectId: project.id,
      title: "New task",
      description: "",
      status: "todo",
      dueDate: "",
      completedOn: null,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="min-w-[50vw] sm:max-w-none w-1/2 gap-0 flex flex-col p-0"
        showCloseButton
      >
        <SheetHeader className="pb-4 pt-6 px-6 border-b border-slate-700/60 shrink-0">
          <SheetTitle className="text-lg">Project details</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">

        <div className="space-y-6">
          {/* Project info */}
          <section className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Project info
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="modal-project-name">Name</Label>
                <Input
                  id="modal-project-name"
                  value={project.name}
                  onChange={(e) => onProjectUpdate({ name: e.target.value })}
                  className="rounded-lg border-slate-700/60 bg-slate-900/40"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="modal-project-desc">Description</Label>
                <Textarea
                  id="modal-project-desc"
                  value={project.description}
                  onChange={(e) =>
                    onProjectUpdate({ description: e.target.value })
                  }
                  rows={3}
                  className="rounded-lg border-slate-700/60 bg-slate-900/40 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-project-status">Status</Label>
                <Select
                  value={project.status}
                  onValueChange={(v) =>
                    onProjectUpdate({
                      status: v as Project["status"],
                    })
                  }
                >
                  <SelectTrigger
                    id="modal-project-status"
                    className="w-full rounded-lg border-slate-700/60 bg-slate-900/40"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Health</Label>
                <div className="flex gap-2">
                  {HEALTH_STATUS_OPTIONS.filter((o) => o.value).map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant={
                        project.healthStatus === opt.value ? "default" : "outline"
                      }
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        onProjectUpdate({ healthStatus: opt.value })
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="modal-project-tags">Tags</Label>
                <Input
                  id="modal-project-tags"
                  value={tagsDisplay}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="Comma-separated tags"
                  className="rounded-lg border-slate-700/60 bg-slate-900/40"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Links</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <Github
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type="url"
                      placeholder="GitHub URL"
                      value={project.githubUrl}
                      onChange={(e) =>
                        onProjectUpdate({ githubUrl: e.target.value })
                      }
                      className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
                    />
                  </div>
                  <div className="relative">
                    <ExternalLink
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type="url"
                      placeholder="Production URL"
                      value={project.prodUrl}
                      onChange={(e) =>
                        onProjectUpdate({ prodUrl: e.target.value })
                      }
                      className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
                    />
                  </div>
                  <div className="relative">
                    <BarChart3
                      className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type="url"
                      placeholder="Analytics URL"
                      value={project.analyticsUrl}
                      onChange={(e) =>
                        onProjectUpdate({ analyticsUrl: e.target.value })
                      }
                      className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tasks table */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Tasks
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTask}
                className="gap-1.5"
              >
                <Plus className="size-4" aria-hidden />
                Add task
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-700/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60 bg-slate-900/40">
                    <th className="px-3 py-2 text-left font-medium">Title</th>
                    <th className="px-3 py-2 text-left font-medium w-32">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-medium w-36">
                      Due date
                    </th>
                    <th className="px-3 py-2 w-16" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-muted-foreground"
                      >
                        No tasks yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-slate-700/40 last:border-b-0"
                      >
                        <td className="px-3 py-2 align-top">
                          <div className="space-y-1">
                            <Input
                              value={task.title}
                              onChange={(e) =>
                                onTaskUpdate(task.id, { title: e.target.value })
                              }
                              className="h-8 min-w-0 border-slate-700/60 bg-transparent text-sm"
                            />
                            {editingTaskDescId === task.id ? (
                              <Textarea
                                value={task.description}
                                onChange={(e) =>
                                  onTaskUpdate(task.id, {
                                    description: e.target.value,
                                  })
                                }
                                onBlur={() => setEditingTaskDescId(null)}
                                rows={2}
                                className="text-xs resize-none border-slate-700/60"
                                autoFocus
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTaskDescId(task.id)
                                }
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-3" aria-hidden />
                                {task.description
                                  ? "Edit description"
                                  : "Add description"}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={task.status}
                            onValueChange={(v) =>
                              onTaskUpdate(task.id, {
                                status: v as TaskStatus,
                              })
                            }
                          >
                            <SelectTrigger
                              className="h-8 min-w-0 border-slate-700/60 bg-transparent text-xs"
                              size="sm"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TASK_STATUS_OPTIONS.map((opt) => (
                                <SelectItem
                                  key={opt.value}
                                  value={opt.value}
                                  className="text-xs"
                                >
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="date"
                            value={task.dueDate || ""}
                            onChange={(e) =>
                              onTaskUpdate(task.id, {
                                dueDate: e.target.value,
                              })
                            }
                            className="h-8 min-w-0 border-slate-700/60 bg-transparent text-xs"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onTaskDelete(task.id)}
                            aria-label="Delete task"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
