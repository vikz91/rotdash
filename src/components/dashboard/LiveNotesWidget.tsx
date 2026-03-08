"use client";

import { useCallback, useEffect, useState } from "react";
import { Scrollable } from "@/components/ui/scrollable";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "rotdash-live-notes";
const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

function loadNotes(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveNotes(text: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, text);
}

export default function LiveNotesWidget() {
  const [notes, setNotes] = useState("");

  const load = useCallback(() => setNotes(loadNotes()), []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (value: string) => {
    setNotes(value);
    saveNotes(value);
  };

  return (
    <div className={CARD_CLASSES}>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Live Notes
      </h3>
      <Scrollable className="max-h-[200px] min-h-[120px]">
        <Textarea
          value={notes}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={"remember to setup redis\nfix docker build\ntry rust rewrite"}
          className="min-h-[120px] resize-y text-sm"
        />
      </Scrollable>
    </div>
  );
}
