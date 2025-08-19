"use client";

import { UserHeader } from "@/components/auth/UserHeader";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoStats } from "@/components/todo/TodoStats";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useTodo } from "@/context/TodoContext";
import { Inbox, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { todos, loading: todosLoading } = useTodo();
  const router = useRouter();

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Si no hay usuario, mostrar loading mientras redirige
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header con información del usuario */}
      <UserHeader />

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-4">
              {todos.length === 0 && !todosLoading ? (
                <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                      ¡Hola, {user.displayName?.split(" ")[0] || "Usuario"}!
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      No tienes tareas aún. Crear tu primera tarea para comenzar a organizar tu día.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Inbox className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                    ¡Hola, {user.displayName?.split(" ")[0] || "Usuario"}!
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Tienes {todos.filter((t) => !t.completed).length}{" "}
                    {todos.filter((t) => !t.completed).length === 1
                      ? "tarea pendiente"
                      : "tareas pendientes"}
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Loading state */}
            {todosLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando tus tareas...</span>
              </div>
            ) : (
              /* Filters and Todo List */
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <TodoFilter />
                    <CreateTodoDialog />
                  </div>
                  <TodoList />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Statistics Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <TodoStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
