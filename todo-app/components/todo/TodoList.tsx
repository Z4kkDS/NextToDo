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
import { Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { TodoItemAnimated } from "./TodoItemAnimated";

export function TodoList() {
  const { todos, filter } = useTodo();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // Calcular el total de páginas
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  // Calcular el índice de inicio y fin para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTodos = filteredTodos.slice(startIndex, endIndex);

  // Resetear a la primera página cuando cambie el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="opacity-50">
          <Moon className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">ZzZzZz....</h3>
        </div>
      </div>
    );
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
      {/* Lista de tareas */}
      <div className="space-y-2">
        {currentTodos.map((todo) => (
          <TodoItemAnimated key={todo.id} todo={todo} />
        ))}
      </div>

      {filteredTodos.length > 0 && (
        <div className="flex justify-center pt-6 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
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
                  className={
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
