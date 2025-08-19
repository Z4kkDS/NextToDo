"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodo } from "@/context/TodoContext";
import { getPriorityLabel, getPriorityVariant, isDueSoon, isPastDue } from "@/lib/priority-utils";
import { Todo } from "@/types";
import { AlertCircle, Calendar, CheckCircle2, Clock, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditTodoDialog } from "./EditTodoDialog";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodo();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteTodo(todo.id);
    toast.success("Tarea eliminada", {
      id: `delete-${todo.id}`,
      duration: 2000,
    });
  };

  return (
    <>
      <Card
        className={`w-full mb-2 transition-all duration-200 hover:shadow-md 
        ${todo.completed ? "opacity-75" : ""} 
        ${
          isPastDue(todo.dueDate)
            ? "border-destructive/50 bg-destructive/5 dark:bg-destructive/10"
            : ""
        } 
        ${
          isDueSoon(todo.dueDate)
            ? "border-amber-300 bg-amber-50/50 dark:border-amber-600 dark:bg-amber-900/20"
            : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start gap-2 flex-wrap">
                  <span
                    className={`text-lg ${
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex gap-1">
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
                  </div>
                </div>

                {todo.description && (
                  <p className="text-sm text-muted-foreground">{todo.description}</p>
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

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <EditTodoDialog todo={todo} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
}
