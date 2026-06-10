"use client";

import { Progress } from "@/components/ui/progress";
import { useGamification } from "@/context/GamificationContext";
import { useTodo } from "@/context/TodoContext";
import { formatCLP } from "@/lib/finance-utils";
import { getPriorityLabel, isDueSoon, isPastDue } from "@/lib/priority-utils";
import { isRecurring, recurrenceLabel } from "@/lib/recurrence";
import { hasSubtasks, subtaskProgress } from "@/lib/subtasks";
import { cn } from "@/lib/utils";
import { Todo } from "@/types";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit2,
  Repeat,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditTodoDialog } from "./EditTodoDialog";

interface TodoItemProps {
  todo: Todo;
}

const PRIORITY_COLOR: Record<string, string> = {
  alta: "var(--pri-alta)",
  media: "var(--pri-media)",
  baja: "var(--pri-baja)",
};

function dueChip(todo: Todo): { label: string; tone: "today" | "overdue" | "normal" } | null {
  if (!todo.dueDate) return null;
  const due = new Date(todo.dueDate);
  if (!todo.completed && isPastDue(todo.dueDate)) {
    return {
      label: `Vencida · ${due.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`,
      tone: "overdue",
    };
  }
  if (due.toDateString() === new Date().toDateString()) {
    return { label: "Hoy", tone: "today" };
  }
  return {
    label: due.toLocaleDateString("es-ES", { day: "numeric", month: "short" }),
    tone: isDueSoon(todo.dueDate) && !todo.completed ? "today" : "normal",
  };
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, updateTodo, setTagFilter } = useTodo();
  const { celebrate } = useGamification();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const progress = subtaskProgress(todo);
  const priColor = PRIORITY_COLOR[todo.priority] ?? "var(--border)";
  const due = dueChip(todo);

  const toggleSubtask = (subId: string) => {
    const next = (todo.subtasks ?? []).map((s) =>
      s.id === subId ? { ...s, done: !s.done } : s
    );
    updateTodo(todo.id, { subtasks: next });
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
    toast.success("Tarea eliminada", { id: `delete-${todo.id}`, duration: 2000 });
  };

  const handleToggle = () => {
    const completing = !todo.completed;
    toggleTodo(todo.id);
    if (completing) {
      // La celebración (+XP, destello, toast) la muestra XPToast.
      celebrate(todo);
      if (isRecurring(todo)) {
        toast.success("Se creó la siguiente repetición", {
          id: `toggle-${todo.id}`,
          duration: 2000,
        });
      }
    } else {
      toast.success("Tarea marcada como pendiente", {
        id: `toggle-${todo.id}`,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col rounded-[13px] border overflow-hidden transition-all duration-200",
          todo.completed ? "task-done bg-surface-2 opacity-[.78]" : "bg-card hover:elev-1"
        )}
        style={{
          borderLeft: `6px solid ${todo.completed ? "var(--input)" : priColor}`,
        }}
      >
        <div className="flex items-start gap-[11px] py-3 px-[13px]">
          {/* Checkbox grande — único toggle de completado */}
          <button
            type="button"
            onClick={handleToggle}
            title={todo.completed ? "Marcar como pendiente" : "Completar"}
            aria-label={todo.completed ? "Marcar como pendiente" : "Completar tarea"}
            data-tour="todo-checkbox"
            className={cn(
              "w-[26px] h-[26px] shrink-0 mt-px cursor-pointer rounded-lg border grid place-items-center transition-all duration-150",
              todo.completed
                ? "bg-pos border-pos"
                : "bg-card border-input hover:border-brand"
            )}
          >
            {todo.completed && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
          </button>

          <div className="flex-1 min-w-0">
            {/* Título + monto */}
            <div className="flex items-baseline gap-2.5 justify-between">
              <span className="task-title font-semibold text-[15.5px] text-ink leading-[1.3] tracking-[-0.01em]">
                {todo.text}
              </span>
              {typeof todo.amount === "number" && todo.amount > 0 && (
                <span
                  className={cn(
                    "font-num text-sm whitespace-nowrap",
                    todo.completed ? "text-ink-3" : "text-ink"
                  )}
                  title={todo.completed ? "Gasto registrado" : "Gasto programado"}
                >
                  {formatCLP(todo.amount)}
                </span>
              )}
            </div>

            {todo.description && (
              <p className="text-[13px] text-ink-2 mt-1 leading-snug">{todo.description}</p>
            )}

            {/* Chips: etiquetas, vencimiento, prioridad, recurrencia + acciones */}
            <div className="flex items-center gap-[7px] mt-2 flex-wrap">
              {(todo.tags ?? []).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag)}
                  className="chip py-0.5 px-2 text-[11.5px] cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label={`Filtrar por etiqueta ${tag}`}
                >
                  <Tag className="h-3 w-3 text-ink-3" />
                  {tag}
                </button>
              ))}

              {due && (
                <span
                  className={cn(
                    "chip py-0.5 px-2 text-[11.5px]",
                    due.tone === "today" && "text-brand-deep dark:text-brand bg-brand-soft border-xp-soft",
                    due.tone === "overdue" && "text-neg bg-destructive/10 border-destructive/30"
                  )}
                >
                  <Clock
                    className={cn(
                      "h-3 w-3",
                      due.tone === "today"
                        ? "text-brand"
                        : due.tone === "overdue"
                        ? "text-neg"
                        : "text-ink-3"
                    )}
                  />
                  {due.label}
                </span>
              )}

              <span
                className="inline-flex items-center gap-[5px] text-[11.5px] font-semibold"
                style={{ color: priColor }}
              >
                <span
                  className="w-2 h-2 rounded-[3px]"
                  style={{ background: priColor }}
                />
                {getPriorityLabel(todo.priority)}
              </span>

              {isRecurring(todo) && (
                <span className="chip py-0.5 px-2 text-[11.5px]">
                  <Repeat className="h-3 w-3 text-ink-3" />
                  {recurrenceLabel(todo.recurrence)}
                </span>
              )}

              {/* Acciones */}
              <span className="ml-auto inline-flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(true)}
                  aria-label="Editar tarea"
                  className="grid place-items-center h-7 w-7 rounded-lg text-ink-3 hover:bg-surface-3 hover:text-ink-2 transition-colors cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  aria-label="Eliminar tarea"
                  className="grid place-items-center h-7 w-7 rounded-lg text-ink-3 hover:bg-destructive/10 hover:text-neg transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            </div>

            {/* Subtareas: barra de progreso + checklist expandible */}
            {hasSubtasks(todo) && (
              <div className="mt-[9px]">
                <button
                  type="button"
                  onClick={() => setShowSubtasks((v) => !v)}
                  className="flex items-center gap-2 w-full text-left cursor-pointer"
                  aria-expanded={showSubtasks}
                >
                  {showSubtasks ? (
                    <ChevronDown className="h-3.5 w-3.5 text-ink-3 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-ink-3 shrink-0" />
                  )}
                  <Progress
                    value={progress.pct}
                    className="h-1.5 flex-1 bg-surface-3 [&>div]:bg-brand"
                  />
                  <span className="font-num text-[11.5px] text-ink-2 shrink-0">
                    {progress.done}/{progress.total}
                  </span>
                </button>

                {showSubtasks && (
                  <ul className="mt-[11px] grid gap-[7px] pl-0.5">
                    {(todo.subtasks ?? []).map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => toggleSubtask(s.id)}
                          className="flex items-center gap-[9px] cursor-pointer text-left w-full py-0.5"
                        >
                          <span
                            className={cn(
                              "w-[18px] h-[18px] rounded-md shrink-0 border grid place-items-center transition-colors",
                              s.done ? "bg-pos border-pos" : "border-input bg-transparent"
                            )}
                          >
                            {s.done && (
                              <Check className="h-3 w-3 text-white" strokeWidth={3} />
                            )}
                          </span>
                          <span
                            className={cn(
                              "text-[13px]",
                              s.done ? "text-ink-3 line-through" : "text-ink-2"
                            )}
                          >
                            {s.text}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <EditTodoDialog todo={todo} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
}
