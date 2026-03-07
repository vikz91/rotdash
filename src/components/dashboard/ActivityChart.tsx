"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type ActivityDataPoint = { date: string; tasks: number };

export default function ActivityChart({ data }: { data: ActivityDataPoint[] }) {
  return (
    <Card className="bg-card min-h-64 h-full">
      <CardContent className="p-4 pt-4">
      <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height={256}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ fill: "var(--chart-1)", r: 3 }}
            name="Tasks"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
      </CardContent>
    </Card>
  );
}
