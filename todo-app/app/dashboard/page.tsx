"use client";

import { UserHeader } from "@/components/auth/UserHeader";
import { WelcomeChecklist } from "@/components/onboarding/WelcomeChecklist";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoStats } from "@/components/todo/TodoStats";
import { TodoToolbar } from "@/components/todo/TodoToolbar";
import { StatsSkeleton, TodoListSkeleton } from "@/components/todo/TodoSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useTodo } from "@/context/TodoContext";
import type { User } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function getDynamicGreeting(name: string): { greeting: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { greeting: `Buenos días, ${name}`, emoji: "☀️" };
  if (hour >= 12 && hour < 19) return { greeting: `Buenas tardes, ${name}`, emoji: "🌤️" };
  return { greeting: `Buenas noches, ${name}`, emoji: "🌙" };
}

function formatDate(): string {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { todos, loading: todosLoading } = useTodo();
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) router.push("/login");
  }, [user, authLoading, router]);

  const firstName = useMemo(
    () => (user as User)?.displayName?.split(" ")[0] || "Usuario",
    [user]
  );
  const { greeting, emoji } = useMemo(() => getDynamicGreeting(firstName), [firstName]);
  const pendingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dashboard-bg">
      <UserHeader />

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Saludo dinámico */}
            <div className="space-y-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-2">
                {greeting}
                <span aria-hidden="true">{emoji}</span>
              </h2>
              <p className="text-sm text-muted-foreground capitalize">{formatDate()}</p>
              {!todosLoading && (
                <p className="text-muted-foreground text-base mt-1">
                  {todos.length === 0
                    ? "Empieza añadiendo tu primera tarea."
                    : pendingCount === 0
                    ? "¡Todo al día! No tienes tareas pendientes. 🎉"
                    : `Tienes ${pendingCount} ${pendingCount === 1 ? "tarea pendiente" : "tareas pendientes"}.`}
                </p>
              )}
            </div>

            <Separator />

            {/* Lista de tareas o skeleton */}
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

          {/* Statistics Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <WelcomeChecklist />
              {todosLoading ? <StatsSkeleton /> : <TodoStats />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
