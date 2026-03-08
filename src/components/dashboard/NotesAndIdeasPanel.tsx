"use client";

import IdeaInboxWidget from "@/components/dashboard/IdeaInboxWidget";
import LiveNotesWidget from "@/components/dashboard/LiveNotesWidget";

export default function NotesAndIdeasPanel() {
  return (
    <div className="flex flex-col gap-6">
      <LiveNotesWidget />
      <IdeaInboxWidget />
    </div>
  );
}
