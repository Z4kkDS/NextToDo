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

  useEffect(() => {
    if (itemRef.current) {
      // Entrada con animación
      animate(itemRef.current, { opacity: [0, 1], y: [20, 0] }, { duration: 0.2 });

      // Limpiar animación al eliminar
      return () => {
        if (itemRef.current) {
          animate(itemRef.current, { opacity: [1, 0], x: [0, -100] }, { duration: 0.2 });
        }
      };
    }
  }, []);

  return (
    <div ref={itemRef}>
      <TodoItem todo={todo} />
    </div>
  );
}
