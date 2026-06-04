"use client";

import { Input } from "@/components/ui/input";
import { getTagColor } from "@/lib/todo-utils";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  id?: string;
}

const MAX_TAGS = 6;
const MAX_LEN = 20;

export function TagInput({ tags, onChange, id }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().slice(0, MAX_LEN);
    if (!tag) return;
    if (tags.includes(tag) || tags.length >= MAX_TAGS) {
      setInput("");
      return;
    }
    onChange([...tags, tag]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                getTagColor(tag)
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="cursor-pointer hover:opacity-70"
                aria-label={`Quitar etiqueta ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        id={id}
        placeholder={
          tags.length >= MAX_TAGS
            ? "Máximo de etiquetas alcanzado"
            : "Escribe y pulsa Enter (ej: trabajo, casa)"
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        disabled={tags.length >= MAX_TAGS}
        maxLength={MAX_LEN}
      />
    </div>
  );
}
