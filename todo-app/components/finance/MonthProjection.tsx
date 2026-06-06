"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { useTodo } from "@/context/TodoContext";
import {
  formatCLP,
  projectMonthEnd,
  shiftMonth,
  totalIncome,
  totalSpent,
} from "@/lib/finance-utils";
import { getTaskExpenses } from "@/lib/task-finance";
import { cn } from "@/lib/utils";
import { MonthBudget } from "@/types/finance";
import { ArrowDown, ArrowRight, ArrowUp, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface DeltaRowProps {
  label: string;
  current: number;
  previous: number;
  /** Si subir es "bueno" (ingresos, ahorro) → verde; si es "malo" (gasto) → rojo. */
  upIsGood: boolean;
  isPercent?: boolean;
}

function DeltaRow({ label, current, previous, upIsGood, isPercent }: DeltaRowProps) {
  const diff = current - previous;
  const fmt = (n: number) => (isPercent ? `${n}%` : formatCLP(n));
  const flat = diff === 0;
  const up = diff > 0;
  const good = flat ? null : up === upIsGood;

  const Icon = flat ? ArrowRight : up ? ArrowUp : ArrowDown;
  const color = flat
    ? "text-muted-foreground"
    : good
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium tabular-nums">{fmt(current)}</span>
        <span className={cn("flex items-center gap-0.5 text-xs tabular-nums", color)}>
          <Icon className="h-3 w-3" />
          {fmt(Math.abs(diff))}
        </span>
      </div>
    </div>
  );
}

export function MonthProjection({ budget }: { budget: MonthBudget }) {
  const { loadTrend, month } = useFinance();
  const { todos } = useTodo();
  const [prev, setPrev] = useState<MonthBudget | null>(null);

  // Cargar el mes anterior para la comparación.
  useEffect(() => {
    let cancelled = false;
    const prevKey = shiftMonth(month, -1);
    loadTrend(2).then((budgets) => {
      if (!cancelled) setPrev(budgets.find((b) => b.month === prevKey) ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [loadTrend, month]);

  const tasks = useMemo(() => getTaskExpenses(todos, month), [todos, month]);
  const projection = useMemo(
    () => projectMonthEnd(budget, tasks.spent, tasks.planned),
    [budget, tasks]
  );

  // Métricas del mes anterior (incluyendo sus tareas-gasto completadas).
  const prevMetrics = useMemo(() => {
    if (!prev) return null;
    const income = totalIncome(prev.incomes);
    const spent = totalSpent(prev.expenses) + getTaskExpenses(todos, prev.month).spent;
    const rate = income > 0 ? Math.round(((income - spent) / income) * 100) : 0;
    return { income, spent, rate };
  }, [prev, todos]);

  const curIncome = projection.income;
  const curSpent = projection.spent;
  const curRate = curIncome > 0 ? Math.round(((curIncome - curSpent) / curIncome) * 100) : 0;

  const negative = projection.projectedBalance < 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Proyección de fin de mes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proyección */}
        <div
          className={cn(
            "rounded-lg border p-4",
            negative
              ? "border-rose-300 bg-rose-50/50 dark:border-rose-500/30 dark:bg-rose-500/10"
              : "border-primary/30 bg-primary/5"
          )}
        >
          <p className="text-xs text-muted-foreground">
            Si cumples tus compromisos pendientes, terminarás el mes con:
          </p>
          <p
            className={cn(
              "text-2xl font-bold tabular-nums mt-1",
              negative ? "text-rose-600 dark:text-rose-400" : "text-foreground"
            )}
          >
            {formatCLP(projection.projectedBalance)}
          </p>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Gastado hasta ahora</span>
              <span className="tabular-nums">{formatCLP(projection.spent)}</span>
            </div>
            <div className="flex justify-between">
              <span>Compromisos pendientes</span>
              <span className="tabular-nums">{formatCLP(projection.committed)}</span>
            </div>
          </div>
        </div>

        {/* Comparación con el mes anterior */}
        {prevMetrics ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">vs. mes anterior</p>
            <DeltaRow label="Ingresos" current={curIncome} previous={prevMetrics.income} upIsGood />
            <DeltaRow
              label="Gastos"
              current={curSpent}
              previous={prevMetrics.spent}
              upIsGood={false}
            />
            <DeltaRow
              label="Tasa de ahorro"
              current={curRate}
              previous={prevMetrics.rate}
              upIsGood
              isPercent
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Sin datos del mes anterior para comparar todavía.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
