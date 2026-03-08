import { NextRequest, NextResponse } from "next/server";
import { listTasksByProject } from "@/lib/services/task-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tasks = listTasksByProject(id);
    return NextResponse.json(tasks);
  } catch (err) {
    console.error("GET /api/projects/[id]/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to list tasks" },
      { status: 500 }
    );
  }
}
