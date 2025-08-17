"use client";

import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { TodoStats } from "@/components/todo/TodoStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTodo } from "@/context/TodoContext";
import { CheckSquare, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { todos } = useTodo();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
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

          <div className="flex items-center gap-3">
            <CreateTodoDialog />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Mobile */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
                <div className="p-6 pt-20">
                  <TodoStats />
                </div>
              </div>
            </div>
          )}

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <TodoStats />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Section */}
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                {todos.length === 0
                  ? "¡Bienvenido a tu lista de tareas!"
                  : `Tienes ${todos.filter((t) => !t.completed).length} ${
                      todos.filter((t) => !t.completed).length === 1
                        ? "tarea pendiente"
                        : "tareas pendientes"
                    }`}
              </h2>
              <p className="text-muted-foreground text-lg">
                {todos.length === 0
                  ? "Comienza creando tu primera tarea para organizar tu día"
                  : "Mantén el control de tus actividades diarias"}
              </p>
            </div>

            <Separator className="my-6" />

            {/* Filters and Todo List */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <TodoFilter />
                  <div className="sm:hidden w-full">
                    <CreateTodoDialog />
                  </div>
                </div>
                <TodoList />
              </CardContent>
            </Card>

            {/* Empty State */}
            {todos.length === 0 && (
              <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <CheckSquare className="h-8 w-8 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        No tienes tareas aún
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Crear tu primera tarea para comenzar a organizar tu día y aumentar tu
                        productividad.
                      </p>
                    </div>
                    <CreateTodoDialog />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
