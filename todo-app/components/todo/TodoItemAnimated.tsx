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
    const currentRef = itemRef.current;
    if (currentRef) {
      // Entrada con animación
      animate(currentRef, { opacity: [0, 1], y: [20, 0] }, { duration: 0.2 });
    }
  }, []); // Solo ejecutar en el montaje inicial

  return (
    <div ref={itemRef} className="w-full">
      <TodoItem todo={todo} />
    </div>
  );
}
