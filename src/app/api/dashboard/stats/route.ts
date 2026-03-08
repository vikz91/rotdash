import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/dashboard-service";
import { MOCK_ACTIVITY_GRAPH, MOCK_METRICS } from "@/lib/mock-data";

export async function GET() {
  try {
    const stats = getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("GET /api/dashboard/stats error:", err);
    return NextResponse.json(
      {
        metrics: MOCK_METRICS,
        activity: MOCK_ACTIVITY_GRAPH,
      },
      { status: 200 }
    );
  }
}
