"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTodo } from "@/context/TodoContext";
import { useState } from "react";
import { toast } from "sonner";

export function TodoInput() {
  const [text, setText] = useState("");
  const { addTodo } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo({
        text: text.trim(),
        priority: "media", // valor por defecto
      });
      setText("");
      toast.success("Tarea añadida correctamente", {
        id: "add-todo",
        duration: 2000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Añadir nueva tarea..."
        className="flex-1"
      />
      <Button type="submit">Añadir</Button>
    </form>
  );
}
