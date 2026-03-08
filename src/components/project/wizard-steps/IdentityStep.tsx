"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import type { ProjectCreatePayload } from "@/lib/project-schema";
import { PROJECT_STATUS_OPTIONS } from "@/lib/project-schema";

type Props = {
  payload: ProjectCreatePayload;
  onChange: (updates: Partial<ProjectCreatePayload>) => void;
  nameError?: string;
};

export default function IdentityStep({ payload, onChange, nameError }: Props) {
  return (
    <Card className="border-slate-700/40 bg-slate-900/40">
      <CardHeader>
        <CardTitle>Identity</CardTitle>
        <CardDescription>
          What&apos;s this project? Give it a name so you can track it before it rots.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="project-name"
            type="text"
            placeholder="e.g. Indie SaaS Launcher"
            value={payload.name}
            onChange={(e) => onChange({ name: e.target.value })}
            aria-invalid={nameError ? "true" : undefined}
            aria-describedby={nameError ? "name-error" : undefined}
            className={nameError ? "border-destructive" : ""}
          />
          {nameError ? (
            <p id="name-error" className="text-xs text-destructive">
              {nameError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-description">Description</Label>
          <Textarea
            id="project-description"
            placeholder="What's this project about? Helps you remember later."
            value={payload.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="project-status">Status</Label>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-flex cursor-help" tabIndex={0}>
                  <HelpCircle className="size-3.5 text-muted-foreground" aria-hidden />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Where is this project in its lifecycle?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={payload.status}
            onValueChange={(v) =>
              onChange({ status: v as ProjectCreatePayload["status"] })
            }
          >
            <SelectTrigger
              id="project-status"
              className="w-full min-w-0 rounded-lg border-slate-700/60 bg-slate-900/40"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} title={opt.tooltip}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
