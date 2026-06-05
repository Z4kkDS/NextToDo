import { NewTodoInput, Todo, TodoRecurrence } from "@/types";

export const RECURRENCE_OPTIONS: { value: TodoRecurrence; label: string }[] = [
  { value: "none", label: "No se repite" },
  { value: "daily", label: "Cada día" },
  { value: "weekly", label: "Cada semana" },
  { value: "monthly", label: "Cada mes" },
];

const RECURRENCE_LABEL: Record<TodoRecurrence, string> = {
  none: "",
  daily: "Diaria",
  weekly: "Semanal",
  monthly: "Mensual",
};

export function recurrenceLabel(r: TodoRecurrence | undefined): string {
  return r ? RECURRENCE_LABEL[r] : "";
}

export function isRecurring(todo: Todo): boolean {
  return !!todo.recurrence && todo.recurrence !== "none";
}

/** Calcula la siguiente fecha según la frecuencia. */
export function nextOccurrenceDate(from: Date, recurrence: TodoRecurrence): Date {
  const d = new Date(from);
  switch (recurrence) {
    case "daily":
      d.setDate(d.getDate() + 1);
      break;
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d;
}

/**
 * Construye la entrada para la siguiente ocurrencia de una tarea recurrente.
 * Base de la fecha: su fecha de vencimiento si la tiene; si no, hoy.
 */
export function buildNextOccurrence(todo: Todo): NewTodoInput {
  const recurrence = todo.recurrence ?? "none";
  const base = todo.dueDate ? new Date(todo.dueDate) : new Date();
  const nextDue = nextOccurrenceDate(base, recurrence);

  return {
    text: todo.text,
    priority: todo.priority,
    recurrence,
    dueDate: nextDue,
    ...(todo.description && { description: todo.description }),
    ...(todo.tags && todo.tags.length > 0 && { tags: todo.tags }),
    ...(typeof todo.amount === "number" && todo.amount > 0
      ? { amount: todo.amount, expenseCategory: todo.expenseCategory ?? "cuentas" }
      : {}),
  };
}
