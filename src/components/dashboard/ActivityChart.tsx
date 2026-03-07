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

type ActivityDataPoint = { date: string; tasks: number };

export default function ActivityChart({ data }: { data: ActivityDataPoint[] }) {
  return (
    <div className="bg-[#1f2933] rounded-lg border border-[#374151] p-4 min-h-64 h-64">
      <ResponsiveContainer width="100%" height={256}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2933",
              border: "1px solid #374151",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: "#22c55e", r: 3 }}
            name="Tasks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
