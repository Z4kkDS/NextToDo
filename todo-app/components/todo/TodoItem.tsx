"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useTodo } from "@/context/TodoContext";
import { formatCLP } from "@/lib/finance-utils";
import { getPriorityLabel, getPriorityVariant, isDueSoon, isPastDue } from "@/lib/priority-utils";
import { isRecurring, recurrenceLabel } from "@/lib/recurrence";
import { hasSubtasks, subtaskProgress } from "@/lib/subtasks";
import { getTagColor } from "@/lib/todo-utils";
import { cn } from "@/lib/utils";
import { Todo } from "@/types";
import { AlertCircle, Calendar, CheckCircle2, ChevronDown, Clock, Edit2, ListChecks, Repeat, RotateCcw, Tag, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditTodoDialog } from "./EditTodoDialog";

interface TodoItemProps {
  todo: Todo;
}

const PRIORITY_BAR: Record<string, string> = {
  alta: "bg-red-500",
  media: "bg-amber-400",
  baja: "bg-emerald-500",
};

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo, updateTodo, setTagFilter } = useTodo();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const progress = subtaskProgress(todo);

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
    toggleTodo(todo.id);
    const completing = !todo.completed;
    const message = completing
      ? isRecurring(todo)
        ? "¡Completada! Se creó la siguiente repetición 🔁"
        : "¡Tarea completada! 🎉"
      : "Tarea marcada como pendiente";
    toast.success(message, { id: `toggle-${todo.id}`, duration: 2000 });
  };

  const barColor = PRIORITY_BAR[todo.priority] ?? "bg-muted";

  return (
    <>
      <Card
        className={`w-full mb-2 overflow-hidden transition-all duration-200 hover:shadow-md
          ${todo.completed ? "opacity-60" : ""}
          ${isPastDue(todo.dueDate) && !todo.completed
            ? "border-destructive/50 bg-destructive/5 dark:bg-destructive/10"
            : ""}
          ${isDueSoon(todo.dueDate) && !todo.completed
            ? "border-amber-300 bg-amber-50/50 dark:border-amber-600 dark:bg-amber-900/20"
            : ""}
        `}
      >
        {/* Barra lateral de color por prioridad */}
        <div className="flex">
          <div
            className={`w-1 shrink-0 rounded-l-lg transition-colors duration-300 ${
              todo.completed ? "bg-muted" : barColor
            }`}
          />
          <div className="flex-1">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                    data-tour="todo-checkbox"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2 flex-wrap">
                      <span
                        className={`text-base font-medium transition-all duration-300 ${
                          todo.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        <Badge variant={getPriorityVariant(todo.priority)} className="text-xs">
                          {getPriorityLabel(todo.priority)}
                        </Badge>
                        {todo.completed && (
                          <Badge variant="secondary" className="text-xs text-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completada
                          </Badge>
                        )}
                        {isPastDue(todo.dueDate) && !todo.completed && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Vencida
                          </Badge>
                        )}
                        {isDueSoon(todo.dueDate) && !todo.completed && (
                          <Badge variant="secondary" className="text-xs text-amber-700">
                            <Clock className="h-3 w-3 mr-1" />
                            Vence pronto
                          </Badge>
                        )}
                        {typeof todo.amount === "number" && todo.amount > 0 && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs tabular-nums gap-1",
                              todo.completed
                                ? "border-emerald-300 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300"
                                : "border-primary/40 text-primary"
                            )}
                            title={todo.completed ? "Gasto registrado" : "Gasto programado"}
                          >
                            <Wallet className="h-3 w-3" />
                            {formatCLP(todo.amount)}
                          </Badge>
                        )}
                        {isRecurring(todo) && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Repeat className="h-3 w-3" />
                            {recurrenceLabel(todo.recurrence)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {todo.description && (
                      <p className="text-sm text-muted-foreground">{todo.description}</p>
                    )}

                    {todo.tags && todo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {todo.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setTagFilter(tag)}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity",
                              getTagColor(tag)
                            )}
                            aria-label={`Filtrar por etiqueta ${tag}`}
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Subtareas: progreso + checklist expandible */}
                    {hasSubtasks(todo) && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setShowSubtasks((v) => !v)}
                          className="flex items-center gap-2 w-full text-left cursor-pointer group"
                          aria-expanded={showSubtasks}
                        >
                          <ListChecks className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <Progress value={progress.pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                            {progress.done}/{progress.total}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform",
                              showSubtasks && "rotate-180"
                            )}
                          />
                        </button>

                        {showSubtasks && (
                          <ul className="space-y-1.5 pl-1">
                            {(todo.subtasks ?? []).map((s) => (
                              <li key={s.id} className="flex items-center gap-2">
                                <Checkbox
                                  checked={s.done}
                                  onCheckedChange={() => toggleSubtask(s.id)}
                                  className="shrink-0 h-3.5 w-3.5"
                                />
                                <span
                                  className={cn(
                                    "text-sm",
                                    s.done && "line-through text-muted-foreground"
                                  )}
                                >
                                  {s.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Creada:{" "}
                        {new Date(todo.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {todo.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Vence:{" "}
                          {new Date(todo.dueDate).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditDialogOpen(true)}
                    className="h-8 w-8 p-0 cursor-pointer"
                    aria-label="Editar tarea"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer"
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Botón explícito de completar / deshacer */}
              <div className="mt-3 pl-8">
                <Button
                  variant={todo.completed ? "outline" : "default"}
                  size="sm"
                  onClick={handleToggle}
                  className="gap-1.5 cursor-pointer"
                >
                  {todo.completed ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Marcar como pendiente
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
          </div>
        </div>
      </Card>

      <EditTodoDialog todo={todo} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
}
