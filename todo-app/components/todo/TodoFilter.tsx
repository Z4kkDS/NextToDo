"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { useTodo } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { TodoFilter as TodoFilterType } from "@/types";
import { CheckCircle2, ListChecks } from "lucide-react";

const FILTERS: {
  value: TodoFilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "active", label: "Activas", icon: ListChecks },
  { value: "completed", label: "Completadas", icon: CheckCircle2 },
];

/**
 * Toggle segmentado Activas / Completadas — al completar una tarea, esta
 * pasa automáticamente a la pestaña de Completadas.
 */
export function TodoFilter() {
  const { filter, setFilter, todos } = useTodo();
  const { markFilterUsed } = useOnboarding();

  const counts: Record<string, number> = {
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const handleFilter = (value: TodoFilterType) => {
    setFilter(value);
    markFilterUsed();
  };

  return (
    <div
      className="flex gap-[5px] p-1 bg-surface-2 border rounded-xl"
      data-tour="filters"
      role="tablist"
      aria-label="Filtrar tareas"
    >
      {FILTERS.map(({ value, label, icon: Icon }) => {
        const isActive = filter === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleFilter(value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-[7px] h-[34px] px-2.5 cursor-pointer",
              "rounded-[9px] font-semibold text-[13.5px] transition-all duration-150 whitespace-nowrap",
              isActive
                ? "bg-brand text-primary-foreground shadow-[0_4px_12px_-4px_rgba(234,99,6,.4)]"
                : "text-ink-2 hover:bg-surface-3"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
            <span
              className={cn(
                "max-[359px]:hidden inline-grid place-items-center min-w-5 h-[19px] px-1.5 rounded-[7px] text-[11.5px] leading-none",
                isActive ? "bg-black/16 text-primary-foreground" : "bg-surface-3 text-ink-3"
              )}
            >
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
