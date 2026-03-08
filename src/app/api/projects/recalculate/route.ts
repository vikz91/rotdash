import { NextResponse } from "next/server";
import { recalculateProjects } from "@/lib/services/project-service";

export async function POST() {
  try {
    recalculateProjects();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/projects/recalculate error:", err);
    return NextResponse.json(
      { error: "Failed to recalculate projects" },
      { status: 500 }
    );
  }
}
