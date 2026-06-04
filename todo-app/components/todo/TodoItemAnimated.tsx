"use client";

import { Todo } from "@/types";
import { animate } from "motion";
import { useEffect, useRef } from "react";
import { TodoItem } from "./TodoItem";

interface TodoItemAnimatedProps {
  todo: Todo;
}

export function TodoItemAnimated({ todo }: TodoItemAnimatedProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const prevCompleted = useRef(todo.completed);

  // Animación de entrada al montar
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    animate(el, { opacity: [0, 1], y: [12, 0] }, { duration: 0.2 });
  }, []);

  // Micro-animación al marcar completada / desmarcar
  useEffect(() => {
    const el = itemRef.current;
    if (!el || prevCompleted.current === todo.completed) return;
    prevCompleted.current = todo.completed;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    if (todo.completed) {
      animate(el, { scale: [1, 1.02, 0.98, 1] }, { duration: 0.3 });
    } else {
      animate(el, { opacity: [0.5, 1] }, { duration: 0.2 });
    }
  }, [todo.completed]);

  return (
    <div ref={itemRef} className="w-full">
      <TodoItem todo={todo} />
    </div>
  );
}
