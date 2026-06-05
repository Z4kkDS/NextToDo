"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTodo } from "@/context/TodoContext";
import { AdviceSeverity, analyzeFinances, HealthStatus } from "@/lib/finance-advice";
import { getTaskExpenses } from "@/lib/task-finance";
import { cn } from "@/lib/utils";
import { MonthBudget } from "@/types/finance";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

const SEVERITY_STYLE: Record<AdviceSeverity, { icon: LucideIcon; cls: string }> = {
  good: { icon: CheckCircle2, cls: "text-emerald-600 dark:text-emerald-400" },
  info: { icon: Info, cls: "text-sky-600 dark:text-sky-400" },
  warning: { icon: AlertTriangle, cls: "text-amber-600 dark:text-amber-400" },
  danger: { icon: AlertCircle, cls: "text-rose-600 dark:text-rose-400" },
};

const HEALTH_STYLE: Record<HealthStatus, { dot: string; text: string }> = {
  good: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  danger: { dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
  neutral: { dot: "bg-slate-400", text: "text-muted-foreground" },
};

export function FinanceAdvice({ budget }: { budget: MonthBudget }) {
  const { todos } = useTodo();

  const health = useMemo(() => {
    const { planned, spent } = getTaskExpenses(todos, budget.month);
    return analyzeFinances(budget, { taskPlanned: planned, taskSpent: spent });
  }, [budget, todos]);

  const hs = HEALTH_STYLE[health.status];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            Consejos inteligentes
          </CardTitle>
          {/* Semáforo de salud */}
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full animate-pulse", hs.dot)} />
            <span className={cn("text-sm font-semibold", hs.text)}>{health.label}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {health.advices.map((a) => {
          const { icon: Icon, cls } = SEVERITY_STYLE[a.severity];
          return (
            <div key={a.id} className="flex items-start gap-2.5">
              <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cls)} />
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{a.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.message}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
