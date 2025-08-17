"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTodo } from "@/context/TodoContext";
import { Todo, UpdateTodoInput } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditTodoDialogProps {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTodoDialog({ todo, open, onOpenChange }: EditTodoDialogProps) {
  const [title, setTitle] = useState(todo.text);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [priority, setPriority] = useState(todo.priority);
  const [completed, setCompleted] = useState(todo.completed);
  const { updateTodo } = useTodo();

  // Actualizar el estado cuando cambie el todo
  useEffect(() => {
    setTitle(todo.text);
    setDescription(todo.description || "");
    setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    setPriority(todo.priority);
    setCompleted(todo.completed);
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    const updateData: UpdateTodoInput = {
      text: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      priority: priority as "baja" | "media" | "alta",
      completed,
    };

    updateTodo(todo.id, updateData);

    onOpenChange(false);
    toast.success("Tarea actualizada correctamente");
  };

  const handleCancel = () => {
    // Restaurar valores originales
    setTitle(todo.text);
    setDescription(todo.description || "");
    setDueDate(todo.dueDate ? new Date(todo.dueDate) : undefined);
    setPriority(todo.priority);
    setCompleted(todo.completed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>Modifica los detalles de tu tarea aquí.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                placeholder="¿Qué necesitas hacer?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción (opcional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Añade más detalles sobre tu tarea..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Prioridad</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as "baja" | "media" | "alta")}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="edit-completed" checked={completed} onCheckedChange={setCompleted} />
                  <Label htmlFor="edit-completed" className="text-sm">
                    {completed ? "Completada" : "Pendiente"}
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Fecha de vencimiento (opcional)</Label>
              <DateTimePicker date={dueDate} setDate={setDueDate} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
