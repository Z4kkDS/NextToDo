"use client";

import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoStats } from "@/components/todo/TodoStats";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTodo } from "@/context/TodoContext";
import { CheckSquare, Inbox } from "lucide-react";

export default function Home() {
  const { todos } = useTodo();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TodoApp</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Organiza y gestiona tus tareas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-4">
              {todos.length === 0 ? (
                <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="space-y-2">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                      No tienes tareas aún
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Crear tu primera tarea para comenzar a organizar tu día y aumentar tu
                      productividad.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Inbox className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                    Tienes {todos.filter((t) => !t.completed).length}{" "}
                    {todos.filter((t) => !t.completed).length === 1
                      ? "tarea pendiente"
                      : "tareas pendientes"}
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Mantén el control de tus actividades diarias
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Filters and Todo List */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <TodoFilter />
                  <CreateTodoDialog />
                </div>
                <TodoList />
              </CardContent>
            </Card>
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
