type Metric = {
  label: string;
  value: number;
  accent?: string;
};

export default function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-[#1f2933] border border-[#374151] rounded-lg p-4"
        >
          <p className="text-xs text-[#9ca3af] uppercase tracking-wider">
            {m.label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${m.accent ?? ""}`}>
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}
