"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { makeSubtask } from "@/lib/subtasks";
import { cn } from "@/lib/utils";
import { Subtask } from "@/types";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SubtaskEditorProps {
  subtasks: Subtask[];
  onChange: (subtasks: Subtask[]) => void;
}

export function SubtaskEditor({ subtasks, onChange }: SubtaskEditorProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const text = input.trim();
    if (!text) return;
    onChange([...subtasks, makeSubtask(text)]);
    setInput("");
  };

  const toggle = (id: string) =>
    onChange(subtasks.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));

  const remove = (id: string) => onChange(subtasks.filter((s) => s.id !== id));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  const doneCount = subtasks.filter((s) => s.done).length;

  return (
    <div className="space-y-2">
      {subtasks.length > 0 && (
        <ul className="space-y-1.5">
          {subtasks.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              <Checkbox
                checked={s.done}
                onCheckedChange={() => toggle(s.id)}
                className="shrink-0"
              />
              <span
                className={cn(
                  "flex-1 text-sm truncate",
                  s.done && "line-through text-muted-foreground"
                )}
              >
                {s.text}
              </span>
              <button
                type="button"
                onClick={() => remove(s.id)}
                className="text-muted-foreground hover:text-destructive cursor-pointer shrink-0"
                aria-label={`Quitar subtarea ${s.text}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Añadir subtarea y pulsar Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" variant="outline" size="icon" onClick={add} className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {subtasks.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {doneCount} de {subtasks.length} completadas
        </p>
      )}
    </div>
  );
}
