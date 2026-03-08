"use client";

type GlobalInsightBannerProps = {
  message: string | null;
};

function getEmoji(message: string): string {
  if (message.startsWith("You haven't shipped")) return "⚠";
  if (
    message.startsWith("Last project shipped today") ||
    message.startsWith("Last project shipped yesterday")
  )
    return "🚀";
  if (
    message.startsWith("Last project shipped") &&
    message.includes("days ago")
  ) {
    const match = message.match(/(\d+)\s+days ago/);
    const days = match ? parseInt(match[1], 10) : 999;
    if (days <= 2) return "🚀";
    if (days >= 7) return "⏳";
  }
  if (message.startsWith("You're on a")) return "🔥";
  if (message.includes("rotting") || message.includes("glacier")) return "⚠";
  return "ℹ";
}

export default function GlobalInsightBanner({
  message,
}: GlobalInsightBannerProps) {
  if (!message) return null;

  const emoji = getEmoji(message);

  return (
    <div
      className="flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-1 text-sm text-amber-400"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden>{emoji}</span>
      <span>{message}</span>
    </div>
  );
}
