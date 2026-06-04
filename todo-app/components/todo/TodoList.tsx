"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTodo } from "@/context/TodoContext";
import { useEffect, useState } from "react";
import { EmptyState } from "./EmptyState";
import { TodoItemAnimated } from "./TodoItemAnimated";

interface TodoListProps {
  onCreateClick?: () => void;
}

export function TodoList({ onCreateClick }: TodoListProps) {
  const { todos, filter } = useTodo();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    if (filter === "overdue") {
      return !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();
    }
    return true;
  });

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (todos.length === 0) {
    return <EmptyState onCreateClick={onCreateClick ?? (() => {})} />;
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No hay tareas que coincidan con el filtro seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {currentTodos.map((todo) => (
          <TodoItemAnimated key={todo.id} todo={todo} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-6 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
