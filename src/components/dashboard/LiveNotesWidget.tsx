"use client";

import { useState } from "react";
import { Scrollable } from "@/components/ui/scrollable";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "rotdash-live-notes";

const DEFAULT_NOTES = `remember to add redis for session store
fix docker build — base image size is huge
try incremental static regen for /projects
check why Vercel cold starts are slow
migrate auth to NextAuth v5 when stable
add e2e tests for project modal flow`;

const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

function loadNotes(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? DEFAULT_NOTES : stored;
  } catch {
    return "";
  }
}

function saveNotes(text: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, text);
}

function parseLines(text: string): string[] {
  if (!text.trim()) return [];
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function LiveNotesWidget() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (value: string) => {
    setNotes(value);
    saveNotes(value);
  };

  const lines = parseLines(notes);

  return (
    <div className={CARD_CLASSES}>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Live Notes
      </h3>
      <Scrollable className="max-h-[200px] min-h-[120px]">
        {isEditing ? (
          <Textarea
            value={notes}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            placeholder={"remember to setup redis\nfix docker build\ntry rust rewrite"}
            className="min-h-[120px] resize-y text-sm focus:outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full text-left text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-md py-2 -mx-1 px-1"
          >
            {lines.length > 0 ? (
              <ul className="space-y-1">
                {lines.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-muted-foreground shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground">
                Click to add quick capture notes…
              </span>
            )}
          </button>
        )}
      </Scrollable>
    </div>
  );
}
