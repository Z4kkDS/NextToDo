"use client";

import { Button } from "@/components/ui/button";
import { useTodo } from "@/context/TodoContext";
import { AlertCircle, CheckCircle2, Clock, Filter } from "lucide-react";

export function TodoFilter() {
  const { filter, setFilter, todos } = useTodo();

  const stats = {
    total: todos.length,
    pending: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
    overdue: todos.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">Filtrar:</span>
      <div className="flex gap-1 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          Todas ({stats.total})
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
          className="gap-1"
        >
          <Clock className="h-4 w-4" />
          Pendientes ({stats.pending})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}
          className="gap-1"
        >
          <CheckCircle2 className="h-4 w-4" />
          Completadas ({stats.completed})
        </Button>
        {stats.overdue > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter("overdue")}
            className="text-destructive border-destructive/20 hover:bg-destructive/5 gap-1"
          >
            <AlertCircle className="h-4 w-4" />
            Vencidas ({stats.overdue})
          </Button>
        )}
      </div>
    </div>
  );
}
