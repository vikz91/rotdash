import { NextRequest, NextResponse } from "next/server";
import { listProjects, createProject } from "@/lib/services/project-service";
import type { ProjectCreatePayload } from "@/lib/project-schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const status = searchParams.get("status") || undefined;
    const activityStatus = searchParams.get("activityStatus") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const projectType = searchParams.get("projectType") || undefined;
    const search = searchParams.get("search") || undefined;

    const result = listProjects({
      page,
      limit,
      status,
      activityStatus,
      tag,
      projectType,
      search,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json(
      { error: "Failed to list projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProjectCreatePayload;
    const project = createProject(body);
    return NextResponse.json(project);
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
