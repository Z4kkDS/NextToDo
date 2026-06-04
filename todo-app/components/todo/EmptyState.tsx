"use client";

import { Button } from "@/components/ui/button";
import { useTodo } from "@/context/TodoContext";
import { CheckSquare, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EXAMPLE_TASKS = [
  { label: "📋 Planificar la semana", text: "Planificar la semana", priority: "alta" as const },
  { label: "🛒 Hacer la compra", text: "Hacer la compra", priority: "media" as const },
  { label: "📞 Llamar al médico", text: "Llamar al médico", priority: "media" as const },
];

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  const { addTodo } = useTodo();
  const [creatingChip, setCreatingChip] = useState<string | null>(null);

  const handleChip = async (task: (typeof EXAMPLE_TASKS)[number]) => {
    setCreatingChip(task.text);
    await addTodo({ text: task.text, priority: task.priority });
    toast.success(`"${task.text}" añadida`, { duration: 2000 });
    setCreatingChip(null);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
      {/* Ilustración */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckSquare className="h-12 w-12 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Plus className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Texto */}
      <div className="space-y-2 max-w-xs">
        <h3 className="text-xl font-semibold">¡Tu lista está vacía!</h3>
        <p className="text-muted-foreground text-sm">
          Empieza añadiendo tu primera tarea. Solo toma unos segundos.
        </p>
      </div>

      {/* CTA principal */}
      <Button size="lg" className="gap-2 px-8" onClick={onCreateClick}>
        <Plus className="h-4 w-4" />
        Crear mi primera tarea
      </Button>

      {/* Chips de ejemplo */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">O añade un ejemplo rápido:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLE_TASKS.map((task) => (
            <button
              key={task.text}
              onClick={() => handleChip(task)}
              disabled={creatingChip !== null}
              className="text-sm px-3 py-1.5 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingChip === task.text ? "Añadiendo…" : task.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
