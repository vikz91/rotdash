"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scrollable } from "@/components/ui/scrollable";
import { cn, formatTimeAgo } from "@/lib/utils";
import { Plus } from "lucide-react";
import { createIdea, deleteIdea, getIdeas, updateIdea } from "@/lib/api/client";
import type { Idea } from "@/lib/idea-schema";

const CARD_CLASSES =
  "rounded-xl bg-slate-900/60 border border-slate-700/40 backdrop-blur shadow-sm p-4 md:p-5";

export default function IdeaInboxWidget() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newIdea, setNewIdea] = useState("");

  const fetchIdeas = useCallback(async () => {
    const list = await getIdeas();
    setIdeas(list);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getIdeas().then((list) => {
      if (!cancelled) setIdeas(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdd = async () => {
    const trimmed = newIdea.trim();
    if (!trimmed) return;
    await createIdea({ text: trimmed });
    setNewIdea("");
    fetchIdeas();
  };

  const handleUpdate = async (id: string, value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      await updateIdea(id, { text: trimmed });
    } else {
      await deleteIdea(id);
    }
    setEditingId(null);
    fetchIdeas();
  };

  const handleRemove = async (id: string) => {
    await deleteIdea(id);
    setEditingId(null);
    fetchIdeas();
  };

  const startEdit = (idea: Idea) => {
    setEditingId(idea.id);
    setEditValue(idea.text);
  };

  return (
    <div className={CARD_CLASSES}>
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Idea Inbox
      </h3>
      <Scrollable className="h-[100px] shrink-0 pr-1">
        <ul className="space-y-2">
          {ideas.map((idea) => (
            <li key={idea.id} className="flex items-start gap-2 group/idea">
              <span className="shrink-0 pt-1 text-muted-foreground">•</span>
              <div className="min-w-0 flex-1">
                {editingId === idea.id ? (
                  <Input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleUpdate(idea.id, editValue)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur();
                      }
                      if (e.key === "Escape") {
                        setEditingId(null);
                      }
                    }}
                    className="h-8 text-sm"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(idea)}
                    className={cn(
                      "text-left text-sm text-foreground w-full",
                      "rounded px-1.5 py-0.5 -mx-1.5 -my-0.5",
                      "hover:bg-slate-700/40 focus:outline-none focus:ring-1 focus:ring-slate-500",
                    )}
                  >
                    <span className="text-muted-foreground">
                      {formatTimeAgo(idea.createdAt)} •
                    </span>{" "}
                    {idea.text}
                  </button>
                )}
              </div>
              {editingId !== idea.id && (
                <button
                  type="button"
                  onClick={() => handleRemove(idea.id)}
                  aria-label="Remove idea"
                  className={cn(
                    "shrink-0 p-0.5 rounded text-muted-foreground opacity-0 group-hover/idea:opacity-100 mt-1",
                    "hover:text-foreground hover:bg-slate-700/40 focus:opacity-100",
                  )}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      </Scrollable>
      <div className="mt-3 pt-3 border-t border-slate-700/40 flex gap-2">
        <Input
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Add idea..."
          className="h-8 flex-1 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="shrink-0"
        >
          <Plus className="size-3.5" />
          Capture Idea
        </Button>
      </div>
    </div>
  );
}
