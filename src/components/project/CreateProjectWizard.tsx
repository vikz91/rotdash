"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createDefaultPayload,
  type ProjectCreatePayload,
} from "@/lib/project-schema";
import IdentityStep from "./wizard-steps/IdentityStep";
import ResourcesStep from "./wizard-steps/ResourcesStep";
import HealthStep from "./wizard-steps/HealthStep";
import ReviewStep from "./wizard-steps/ReviewStep";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Identity", key: "identity" },
  { id: 2, title: "Resources", key: "resources" },
  { id: 3, title: "Health", key: "health" },
  { id: 4, title: "Review", key: "review" },
] as const;

const TOTAL_STEPS = STEPS.length;

export default function CreateProjectWizard() {
  const [payload, setPayload] = useState<ProjectCreatePayload>(createDefaultPayload);
  const [step, setStep] = useState(1);
  const [nameError, setNameError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const updatePayload = (updates: Partial<ProjectCreatePayload>) => {
    setPayload((prev) => ({ ...prev, ...updates }));
    if (updates.name !== undefined && nameError) {
      setNameError(undefined);
    }
  };

  const canProceedFromStep1 = payload.name.trim().length > 0;
  const isFirstStep = step === 1;

  const handleNext = () => {
    if (step === 1 && !canProceedFromStep1) {
      setNameError("Name is required");
      return;
    }
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = () => {
    if (!payload.name.trim()) {
      setNameError("Name is required");
      setStep(1);
      return;
    }

    startTransition(() => {
      // Mock submit — replace with real API call later
      console.log("POST /api/projects", payload);

      setIsSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    });
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <Check className="mx-auto mb-4 size-12 text-emerald-500" aria-hidden />
        <h2 className="text-lg font-semibold text-foreground">Project created</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Redirecting to dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between" aria-label="Progress">
        {STEPS.map((s, i) => {
          const isComplete = s.id < step;
          const isCurrent = s.id === step;
          return (
            <div
              key={s.key}
              className="flex flex-1 items-center last:flex-initial"
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                  isComplete && "bg-emerald-500/20 text-emerald-500",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/50",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isComplete ? <Check className="size-4" aria-hidden /> : s.id}
              </div>
              <span
                className={cn(
                  "ml-2 hidden text-sm font-medium sm:inline",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.title}
              </span>
              {i < STEPS.length - 1 ? (
                <div className="mx-2 flex-1 border-t border-border sm:mx-4" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div>
        {step === 1 ? (
          <IdentityStep
            payload={payload}
            onChange={updatePayload}
            nameError={nameError}
          />
        ) : step === 2 ? (
          <ResourcesStep payload={payload} onChange={updatePayload} />
        ) : step === 3 ? (
          <HealthStep payload={payload} onChange={updatePayload} />
        ) : (
          <ReviewStep
            payload={payload}
            isSubmitting={isPending}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Navigation */}
      {step < TOTAL_STEPS ? (
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            type="button"
            onClick={handleBack}
            className={cn("gap-1.5", isFirstStep && "invisible")}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={step === 1 && !canProceedFromStep1}
            className="ml-auto gap-1.5"
          >
            Next
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      ) : null}

      {/* Back to dashboard link */}
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/" className="underline hover:text-foreground">
          ← Back to dashboard
        </Link>
      </p>
    </div>
  );
}
