"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTodo } from "@/context/TodoContext";
import { Todo } from "@/types";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Rocket,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

export function TodoStats() {
  const { todos } = useTodo();

  const stats = {
    total: todos.length,
    completed: todos.filter((todo: Todo) => todo.completed).length,
    pending: todos.filter((todo: Todo) => !todo.completed).length,
    highPriority: todos.filter((todo: Todo) => todo.priority === "alta" && !todo.completed).length,
    overdue: todos.filter((todo: Todo) => {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < new Date();
    }).length,
    dueToday: todos.filter((todo: Todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const today = new Date();
      const dueDate = new Date(todo.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length,
  };

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progreso General */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completado</span>
            <span className="font-semibold text-primary">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <div className="text-center text-sm text-muted-foreground">
            {stats.completed} de {stats.total} tareas
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Detalladas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500"></div>
              <span className="text-sm">Total</span>
            </div>
            <Badge variant="outline" className="font-semibold">
              {stats.total}
            </Badge>
          </div>

          <Separator />

          {/* Completadas */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Completadas</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100 font-semibold"
            >
              {stats.completed}
            </Badge>
          </div>

          {/* Pendientes */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Pendientes</span>
            </div>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-700 hover:bg-amber-100 font-semibold"
            >
              {stats.pending}
            </Badge>
          </div>

          {stats.highPriority > 0 && (
            <>
              <Separator />

              {/* Prioridad Alta */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Prioridad Alta</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-700 hover:bg-red-100 font-semibold"
                >
                  {stats.highPriority}
                </Badge>
              </div>
            </>
          )}

          {stats.overdue > 0 && (
            <>
              <Separator />

              {/* Vencidas */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Vencidas</span>
                </div>
                <Badge variant="destructive" className="font-semibold">
                  {stats.overdue}
                </Badge>
              </div>
            </>
          )}

          {stats.dueToday > 0 && (
            <>
              <Separator />

              {/* Vencen Hoy */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Vencen Hoy</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-semibold"
                >
                  {stats.dueToday}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sugerencias */}
      {stats.total > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {completionPercentage === 100 ? (
                  <Trophy className="h-8 w-8 text-yellow-600" />
                ) : completionPercentage >= 75 ? (
                  <Rocket className="h-8 w-8 text-blue-600" />
                ) : completionPercentage >= 50 ? (
                  <Zap className="h-8 w-8 text-purple-600" />
                ) : completionPercentage >= 25 ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <Star className="h-8 w-8 text-orange-600" />
                )}
              </div>
              <div className="text-sm font-medium text-foreground">
                {completionPercentage === 100
                  ? "¡Todas las tareas completadas!"
                  : completionPercentage >= 75
                  ? "¡Excelente progreso!"
                  : completionPercentage >= 50
                  ? "¡Vas por buen camino!"
                  : completionPercentage >= 25
                  ? "Sigue adelante"
                  : "¡Comienza tu día productivo!"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
