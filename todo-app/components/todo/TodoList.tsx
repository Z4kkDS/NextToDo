"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Inbox, SearchX, Trash2, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "./EmptyState";
import { TodoItemAnimated } from "./TodoItemAnimated";

interface TodoListProps {
  onCreateClick?: () => void;
}

/** Estado vacío por pestaña: trofeo en Activas, bandeja en Completadas. */
function TabEmptyState({ completed }: { completed: boolean }) {
  const Icon = completed ? Inbox : Trophy;
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-[38px] px-4 text-center">
      <div className="w-[52px] h-[52px] rounded-[14px] grid place-items-center bg-surface-2 border">
        <Icon
          className={completed ? "h-[26px] w-[26px] text-ink-3" : "h-[26px] w-[26px] text-xp"}
          strokeWidth={1.6}
        />
      </div>
      <span className="font-display text-[15px] text-ink">
        {completed ? "Aún no completas tareas" : "¡Todo listo por hoy!"}
      </span>
      <span className="text-[12.5px] text-ink-3 max-w-60">
        {completed
          ? "Marca una tarea como hecha y aparecerá aquí."
          : "No te quedan tareas activas. Buen trabajo."}
      </span>
    </div>
  );
}

/** Botón + diálogo para eliminar todas las completadas sin perder el XP. */
function ClearCompletedButton({ count }: { count: number }) {
  const { clearCompleted } = useTodo();
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);
    await clearCompleted();
    toast.success(
      `Se ${count === 1 ? "eliminó 1 tarea completada" : `eliminaron ${count} tareas completadas`}. Tu XP se conserva.`,
      { id: "clear-completed", duration: 3000 }
    );
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-7 px-2.5 text-xs text-ink-3 hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Limpiar completadas
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Limpiar tareas completadas?</DialogTitle>
            <DialogDescription>
              Se {count === 1 ? "eliminará 1 tarea completada" : `eliminarán ${count} tareas completadas`}.
              El XP que ganaste con ellas se conserva.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirm} className="cursor-pointer">
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
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
    // Sin resultados por búsqueda o etiqueta → mensaje genérico.
    if (searchQuery.trim() || tagFilter) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
          <SearchX className="h-10 w-10 text-ink-3/60" />
          <p className="text-ink-2">
            No hay tareas que coincidan con tu búsqueda o filtros.
          </p>
        </div>
      );
    }
    // Pestaña vacía (sin búsqueda activa).
    return <TabEmptyState completed={filter === "completed"} />;
  }

  return (
    <div className="space-y-4">
      {filter === "completed" && !searchQuery.trim() && !tagFilter && (
        <ClearCompletedButton count={todos.filter((t) => t.completed).length} />
      )}

      <div className="space-y-2.5">
        {currentTodos.map((todo) => (
          <TodoItemAnimated key={todo.id} todo={todo} />
        ))}
      </div>

      {/* Paginación: 5 tareas por página para evitar el scroll infinito */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 pt-3 border-t">
          <span className="font-num text-xs text-ink-3 whitespace-nowrap">
            {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredTodos.length)} de{" "}
            {filteredTodos.length}
          </span>
          <Pagination className="mx-0 w-auto justify-end">
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
                <PaginationItem key={page} className="hidden sm:block">
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer font-num"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
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
