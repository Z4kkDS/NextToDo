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
import { applyFilters, applySort } from "@/lib/todo-utils";
import { SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "./EmptyState";
import { TodoItemAnimated } from "./TodoItemAnimated";

interface TodoListProps {
  onCreateClick?: () => void;
}

export function TodoList({ onCreateClick }: TodoListProps) {
  const { todos, filter, sort, searchQuery, tagFilter } = useTodo();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTodos = useMemo(() => {
    const filtered = applyFilters(todos, filter, searchQuery, tagFilter);
    return applySort(filtered, sort);
  }, [todos, filter, sort, searchQuery, tagFilter]);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);

  // Volver a la primera página al cambiar cualquier criterio.
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sort, searchQuery, tagFilter]);

  // Corregir página si quedó fuera de rango tras filtrar.
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  if (todos.length === 0) {
    return <EmptyState onCreateClick={onCreateClick ?? (() => {})} />;
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
        <SearchX className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-muted-foreground">
          No hay tareas que coincidan con tu búsqueda o filtros.
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
