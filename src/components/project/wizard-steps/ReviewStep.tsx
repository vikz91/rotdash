"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { ProjectCreatePayload } from "@/lib/project-schema";
import { PROJECT_STATUS_OPTIONS, HEALTH_STATUS_OPTIONS } from "@/lib/project-schema";

type Props = {
  payload: ProjectCreatePayload;
  isSubmitting: boolean;
  onSubmit: () => void;
  error?: string | null;
};

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string;
}) {
  const display =
    Array.isArray(value) ? (value.length ? value.join(", ") : "—") : value || "—";
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm break-all">{display}</span>
    </div>
  );
}

export default function ReviewStep({ payload, isSubmitting, onSubmit, error }: Props) {
  const statusLabel =
    PROJECT_STATUS_OPTIONS.find((o) => o.value === payload.status)?.label ?? payload.status;
  const healthLabel =
    payload.healthStatus
      ? HEALTH_STATUS_OPTIONS.find((o) => o.value === payload.healthStatus)?.label ?? payload.healthStatus
      : "—";

  return (
    <Card className="border-slate-700/40 bg-slate-900/40">
      <CardHeader>
        <CardTitle>Review & Create</CardTitle>
        <CardDescription>
          Double-check. Once created, RotDash will start tracking how long until it rots.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" value={payload.name} />
          <Field label="Status" value={statusLabel} />
          <Field label="Description" value={payload.description} className="sm:col-span-2" />
          <Field label="Health" value={healthLabel} />
          <Field label="Tags" value={payload.tags} />
          {payload.image ? (
            <Field label="Image URL" value={payload.image} className="sm:col-span-2" />
          ) : null}
          {payload.githubUrl ? (
            <Field label="GitHub" value={payload.githubUrl} className="sm:col-span-2" />
          ) : null}
          {payload.prodUrl ? (
            <Field label="Production" value={payload.prodUrl} className="sm:col-span-2" />
          ) : null}
          {payload.analyticsUrl ? (
            <Field label="Analytics" value={payload.analyticsUrl} className="sm:col-span-2" />
          ) : null}
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}
        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Creating…
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" aria-hidden />
              Create project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
