"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import type { ProjectCreatePayload } from "@/lib/project-schema";
import { HEALTH_STATUS_OPTIONS } from "@/lib/project-schema";

type Props = {
  payload: ProjectCreatePayload;
  onChange: (updates: Partial<ProjectCreatePayload>) => void;
};

export default function HealthStep({ payload, onChange }: Props) {
  return (
    <Card className="border-slate-700/40 bg-slate-900/40">
      <CardHeader>
        <CardTitle>Health</CardTitle>
        <CardDescription>
          Is this project on track or rotting? Be honest — the dashboard will show it anyway.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label id="health-label">How&apos;s it going?</Label>
        <div className="flex flex-wrap gap-3" role="group" aria-labelledby="health-label">
          {HEALTH_STATUS_OPTIONS.map((opt) => {
            const isSelected = payload.healthStatus === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-4 px-6 rounded-xl min-w-[120px]",
                  isSelected
                    ? "border-primary bg-primary/20 text-primary ring-2 ring-primary"
                    : "border-slate-700/60 bg-slate-900/40 hover:bg-slate-800/60"
                )}
                onClick={() => onChange({ healthStatus: opt.value })}
              >
                {opt.value === "+" ? (
                  <ThumbsUp className="size-5" aria-hidden />
                ) : (
                  <ThumbsDown className="size-5" aria-hidden />
                )}
                <span className="font-medium">{opt.label}</span>
                <span className="text-xs opacity-80">{opt.description}</span>
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          You can change this later. It&apos;s just a quick sentiment check.
        </p>
      </CardContent>
    </Card>
  );
}
