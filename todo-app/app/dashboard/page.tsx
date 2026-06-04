"use client";

import { UserHeader } from "@/components/auth/UserHeader";
import { WelcomeChecklist } from "@/components/onboarding/WelcomeChecklist";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoStats } from "@/components/todo/TodoStats";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useTodo } from "@/context/TodoContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { todos, loading: todosLoading } = useTodo();
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                ¡Hola, {user.displayName?.split(" ")[0] || "Usuario"}!
              </h2>
              <p className="text-muted-foreground text-lg">
                {todos.length === 0
                  ? "Empieza añadiendo tu primera tarea."
                  : `Tienes ${todos.filter((t) => !t.completed).length} ${
                      todos.filter((t) => !t.completed).length === 1
                        ? "tarea pendiente"
                        : "tareas pendientes"
                    }.`}
              </p>
            </div>

            <Separator />

            {/* Loading state */}
            {todosLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Cargando tus tareas...</span>
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <TodoFilter />
                    <CreateTodoDialog open={createOpen} onOpenChange={setCreateOpen} />
                  </div>
                  <TodoList onCreateClick={() => setCreateOpen(true)} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Statistics Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <WelcomeChecklist />
              <TodoStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
