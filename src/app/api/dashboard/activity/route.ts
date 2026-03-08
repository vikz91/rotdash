import { NextResponse } from "next/server";
import { getActivityGraph } from "@/lib/services/dashboard-service";
import { MOCK_ACTIVITY_GRAPH } from "@/lib/mock-data";

export async function GET() {
  try {
    const { activity } = getActivityGraph();
    return NextResponse.json({ activity });
  } catch (err) {
    console.error("GET /api/dashboard/activity error:", err);
    return NextResponse.json(
      { activity: MOCK_ACTIVITY_GRAPH },
      { status: 200 }
    );
  }
}
