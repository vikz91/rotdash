import { NextRequest, NextResponse } from "next/server";
import { listIdeas, createIdea } from "@/lib/services/idea-service";
import type { IdeaCreatePayload } from "@/lib/idea-schema";

export async function GET() {
  try {
    const ideas = listIdeas();
    return NextResponse.json(ideas);
  } catch (err) {
    console.error("GET /api/ideas error:", err);
    return NextResponse.json(
      { error: "Failed to list ideas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as IdeaCreatePayload;
    const idea = createIdea(body);
    return NextResponse.json(idea);
  } catch (err) {
    console.error("POST /api/ideas error:", err);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
