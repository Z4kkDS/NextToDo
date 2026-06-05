import { Todo } from "@/types";
import { ExpenseCategory } from "@/types/finance";
import { monthKey } from "./finance-utils";

/**
 * Mes al que se imputa el gasto de una tarea: el de su fecha de vencimiento si
 * la tiene; si no, el de su fecha de creación.
 */
export function taskMonth(todo: Todo): string {
  const date = todo.dueDate ? new Date(todo.dueDate) : new Date(todo.createdAt);
  return monthKey(date);
}

/** ¿La tarea cuenta como gasto? (tiene un monto positivo) */
export function isTaskExpense(todo: Todo): boolean {
  return typeof todo.amount === "number" && todo.amount > 0;
}

export function taskExpenseCategory(todo: Todo): ExpenseCategory {
  return todo.expenseCategory ?? "cuentas";
}

export interface TaskExpenseSummary {
  /** Tareas-gasto del mes (con monto > 0). */
  items: Todo[];
  /** Suma de montos de tareas pendientes (gasto programado). */
  planned: number;
  /** Suma de montos de tareas completadas (gasto ya registrado). */
  spent: number;
  /** planned + spent. */
  total: number;
}

/** Resume las tareas con monto imputadas a un mes concreto ("YYYY-MM"). */
export function getTaskExpenses(todos: Todo[], month: string): TaskExpenseSummary {
  const items = todos
    .filter((t) => isTaskExpense(t) && taskMonth(t) === month)
    .sort((a, b) => Number(a.completed) - Number(b.completed));

  let planned = 0;
  let spent = 0;
  for (const t of items) {
    const amount = t.amount ?? 0;
    if (t.completed) spent += amount;
    else planned += amount;
  }

  return { items, planned, spent, total: planned + spent };
}
