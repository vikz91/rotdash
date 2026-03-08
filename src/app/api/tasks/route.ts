import { NextRequest, NextResponse } from "next/server";
import { createTask } from "@/lib/services/task-service";
import type { Task } from "@/lib/task-schema";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<Task, "id">;
    const task = createTask(body);
    return NextResponse.json(task);
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
