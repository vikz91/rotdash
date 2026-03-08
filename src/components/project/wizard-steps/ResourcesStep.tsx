"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, ExternalLink, BarChart3, ImageIcon } from "lucide-react";
import type { ProjectCreatePayload } from "@/lib/project-schema";
import { parseTags } from "@/lib/project-schema";

type Props = {
  payload: ProjectCreatePayload;
  onChange: (updates: Partial<ProjectCreatePayload>) => void;
};

export default function ResourcesStep({ payload, onChange }: Props) {
  const tagsDisplay = payload.tags.join(", ");
  const handleTagsChange = (value: string) => {
    onChange({ tags: parseTags(value) });
  };

  return (
    <Card className="border-slate-700/40 bg-slate-900/40">
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>
          Links and tags. Optional — but they help you find this project later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-image">Image URL</Label>
          <div className="relative">
            <ImageIcon
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="project-image"
              type="url"
              placeholder="e.g. https://picsum.photos/400/200"
              value={payload.image}
              onChange={(e) => onChange({ image: e.target.value })}
              className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-github">GitHub URL</Label>
          <div className="relative">
            <Github
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="project-github"
              type="url"
              placeholder="https://github.com/..."
              value={payload.githubUrl}
              onChange={(e) => onChange({ githubUrl: e.target.value })}
              className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-prod">Production URL</Label>
          <div className="relative">
            <ExternalLink
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="project-prod"
              type="url"
              placeholder="https://yourapp.com"
              value={payload.prodUrl}
              onChange={(e) => onChange({ prodUrl: e.target.value })}
              className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-analytics">Analytics URL</Label>
          <div className="relative">
            <BarChart3
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="project-analytics"
              type="url"
              placeholder="https://analytics.example.com"
              value={payload.analyticsUrl}
              onChange={(e) => onChange({ analyticsUrl: e.target.value })}
              className="pl-9 rounded-lg border-slate-700/60 bg-slate-900/40"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-tags">Tags</Label>
          <Input
            id="project-tags"
            type="text"
            placeholder="e.g. saas, side-project, react"
            value={tagsDisplay}
            onChange={(e) => handleTagsChange(e.target.value)}
            className="rounded-lg border-slate-700/60 bg-slate-900/40"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated. Helps with filtering.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
