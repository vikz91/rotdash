import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Metric = {
  label: string;
  value: number;
  accent?: string;
};

type MetricCardsProps = {
  metrics: Metric[];
  /** Stack in single column (e.g. when used in a narrow overview widget) */
  stacked?: boolean;
};

export default function MetricCards({ metrics, stacked }: MetricCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        stacked ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3",
      )}
    >
      {metrics.map((m) => (
        <Card key={m.label} size="sm" className="bg-card">
          <CardHeader className="pb-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {m.label}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <p className={cn("text-2xl font-bold", m.accent ?? "")}>
              {m.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
