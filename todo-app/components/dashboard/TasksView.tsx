"use client";

import { WelcomeChecklist } from "@/components/onboarding/WelcomeChecklist";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { StatsSkeleton, TodoListSkeleton } from "@/components/todo/TodoSkeleton";
import { TodoStats } from "@/components/todo/TodoStats";
import { TodoToolbar } from "@/components/todo/TodoToolbar";
import { Card, CardContent } from "@/components/ui/card";
import { useTodo } from "@/context/TodoContext";
import { useMemo, useState } from "react";

export function TasksView() {
  const { todos, loading: todosLoading } = useTodo();
  const [createOpen, setCreateOpen] = useState(false);

  const pendingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Contenido principal */}
      <div className="lg:col-span-3 space-y-6">
        {!todosLoading && (
          <p className="text-muted-foreground text-base">
            {todos.length === 0
              ? "Empieza añadiendo tu primera tarea."
              : pendingCount === 0
              ? "¡Todo al día! No tienes tareas pendientes. 🎉"
              : `Tienes ${pendingCount} ${pendingCount === 1 ? "tarea pendiente" : "tareas pendientes"}.`}
          </p>
        )}

        {todosLoading ? (
          <TodoListSkeleton count={3} />
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <TodoFilter />
                <CreateTodoDialog open={createOpen} onOpenChange={setCreateOpen} />
              </div>
              <TodoToolbar />
              <TodoList onCreateClick={() => setCreateOpen(true)} />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Panel de estadísticas */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          <WelcomeChecklist />
          {todosLoading ? <StatsSkeleton /> : <TodoStats />}
        </div>
      </div>
    </div>
  );
}
