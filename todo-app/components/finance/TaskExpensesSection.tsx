"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodo } from "@/context/TodoContext";
import { CATEGORY_META, formatCLP } from "@/lib/finance-utils";
import { getTaskExpenses, taskExpenseCategory } from "@/lib/task-finance";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ListChecks } from "lucide-react";
import { useMemo } from "react";

export function TaskExpensesSection({ month }: { month: string }) {
  const { todos, toggleTodo } = useTodo();

  const { items, planned, spent } = useMemo(
    () => getTaskExpenses(todos, month),
    [todos, month]
  );

  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="h-5 w-5 text-primary" />
          Gastos desde tareas
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Tareas con monto imputadas a este mes. Al completarlas, el gasto se registra.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((todo) => {
          const cat = CATEGORY_META[taskExpenseCategory(todo)];
          return (
            <div
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border p-2.5"
            >
              <button
                type="button"
                onClick={() => toggleTodo(todo.id)}
                className="shrink-0 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                aria-label={todo.completed ? "Marcar como pendiente" : "Marcar como pagada"}
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    todo.completed && "line-through text-muted-foreground"
                  )}
                >
                  {todo.text}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={cn("h-2 w-2 rounded-full", cat.color)} />
                  <span className="text-xs text-muted-foreground">{cat.label}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold tabular-nums">{formatCLP(todo.amount ?? 0)}</p>
                <p
                  className={cn(
                    "text-[11px]",
                    todo.completed ? "text-emerald-600 dark:text-emerald-400" : "text-primary/80"
                  )}
                >
                  {todo.completed ? "Pagado" : "Programado"}
                </p>
              </div>
            </div>
          );
        })}

        {/* Totales */}
        <div className="flex items-center justify-between pt-2 mt-1 border-t text-sm">
          <span className="text-muted-foreground">
            Programado <span className="font-semibold text-primary">{formatCLP(planned)}</span>
          </span>
          <span className="text-muted-foreground">
            Pagado{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCLP(spent)}
            </span>
          </span>
        </div>

        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" disabled>
          Crea tareas con monto desde la pestaña Tareas
        </Button>
      </CardContent>
    </Card>
  );
}
