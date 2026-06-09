"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { useTodo } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { TodoFilter as TodoFilterType } from "@/types";
import { AlertCircle, CheckCircle2, Clock, LayoutList } from "lucide-react";

const FILTERS: {
  value: TodoFilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey: keyof ReturnType<typeof useStats>;
  danger?: boolean;
}[] = [
  { value: "all", label: "Todas", icon: LayoutList, countKey: "total" },
  { value: "active", label: "Activas", icon: Clock, countKey: "pending" },
  { value: "completed", label: "Completadas", icon: CheckCircle2, countKey: "completed" },
  { value: "overdue", label: "Vencidas", icon: AlertCircle, countKey: "overdue", danger: true },
];

function useStats(todos: ReturnType<typeof useTodo>["todos"]) {
  return {
    total: todos.length,
    pending: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
    overdue: todos.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length,
  };
}

/** Toggle segmentado de filtros — activo en naranja, contadores por pestaña. */
export function TodoFilter() {
  const { filter, setFilter, todos } = useTodo();
  const { markFilterUsed } = useOnboarding();
  const stats = useStats(todos);

  const handleFilter = (value: TodoFilterType) => {
    setFilter(value);
    if (value !== "all") markFilterUsed();
  };

  return (
    <div
      className="flex gap-[5px] p-1 bg-surface-2 border rounded-xl"
      data-tour="filters"
      role="tablist"
      aria-label="Filtrar tareas"
    >
      {FILTERS.map(({ value, label, icon: Icon, countKey, danger }) => {
        const count = stats[countKey];
        // Ocultar "Vencidas" si no hay ninguna (y no está activo)
        if (value === "overdue" && count === 0 && filter !== "overdue") return null;

        const isActive = filter === value;

        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleFilter(value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 h-[34px] px-2 cursor-pointer",
              "rounded-[9px] font-semibold text-[13px] transition-all duration-150 whitespace-nowrap",
              isActive
                ? danger
                  ? "bg-destructive text-white shadow-[0_4px_12px_-4px_rgba(224,83,61,.5)]"
                  : "bg-brand text-primary-foreground shadow-[0_4px_12px_-4px_rgba(234,99,6,.4)]"
                : danger
                ? "text-neg hover:bg-surface-3"
                : "text-ink-2 hover:bg-surface-3"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            <span
              className={cn(
                "inline-grid place-items-center min-w-5 h-[19px] px-1.5 rounded-[7px] text-[11.5px] leading-none",
                isActive ? "bg-black/16 text-primary-foreground" : "bg-surface-3 text-ink-3"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
