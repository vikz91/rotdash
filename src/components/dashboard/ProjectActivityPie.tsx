"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export type ActivitySlice = {
  name: string;
  value: number;
  color: string;
};

type Props = {
  data: ActivitySlice[];
};

export default function ProjectActivityPie({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="bg-card h-full">
      <CardContent className="flex flex-col items-center p-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Projects by activity
        </h3>
        <div className="h-48 w-full min-w-0 sm:h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="85%"
                paddingAngle={1}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value, name) => {
                  const n = Number(value ?? 0);
                  const pct = total > 0 ? Math.round((n / total) * 100) : 0;
                  return [`${n} (${pct}%)`, String(name ?? "")];
                }}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                formatter={(value, entry) => (
                  <span
                    className="text-xs text-muted-foreground"
                    style={{ color: entry?.color }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
