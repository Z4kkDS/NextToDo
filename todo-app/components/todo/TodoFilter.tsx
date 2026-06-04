"use client";

import { Button } from "@/components/ui/button";
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
  className?: string;
}[] = [
  { value: "all", label: "Todas", icon: LayoutList, countKey: "total" },
  { value: "active", label: "Pendientes", icon: Clock, countKey: "pending" },
  { value: "completed", label: "Completadas", icon: CheckCircle2, countKey: "completed" },
  {
    value: "overdue",
    label: "Vencidas",
    icon: AlertCircle,
    countKey: "overdue",
    className: "text-destructive border-destructive/30 hover:bg-destructive/5 data-[active=true]:bg-destructive data-[active=true]:text-destructive-foreground data-[active=true]:border-destructive",
  },
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

export function TodoFilter() {
  const { filter, setFilter, todos } = useTodo();
  const { markFilterUsed } = useOnboarding();
  const stats = useStats(todos);

  const handleFilter = (value: TodoFilterType) => {
    setFilter(value);
    if (value !== "all") markFilterUsed();
  };

  return (
    <div className="flex items-center gap-2 flex-wrap" data-tour="filters">
      <div className="flex gap-1 flex-wrap">
        {FILTERS.map(({ value, label, icon: Icon, countKey, className }) => {
          const count = stats[countKey];
          // Ocultar "Vencidas" si no hay ninguna (y no está activo)
          if (value === "overdue" && count === 0 && filter !== "overdue") return null;

          const isActive = filter === value;

          return (
            <Button
              key={value}
              size="sm"
              data-active={isActive}
              onClick={() => handleFilter(value)}
              className={cn(
                "gap-1.5 transition-all duration-150 cursor-pointer",
                isActive ? "" : "hover:scale-[1.02]",
                !isActive && !className ? "" : className
              )}
              variant={isActive ? "default" : "outline"}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0 text-[10px] font-semibold leading-4",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
