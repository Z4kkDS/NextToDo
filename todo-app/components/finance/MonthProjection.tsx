"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { Progress } from "@/components/ui/progress";
import { SectionLabel } from "@/components/ui/section-label";
import { useFinance } from "@/context/FinanceContext";
import { useTodo } from "@/context/TodoContext";
import {
  formatCLP,
  monthKey,
  projectMonthEnd,
  shiftMonth,
  totalIncome,
  totalSpent,
} from "@/lib/finance-utils";
import { getTaskExpenses } from "@/lib/task-finance";
import { cn } from "@/lib/utils";
import { MonthBudget } from "@/types/finance";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Gauge,
} from "lucide-react";
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
  const color = flat ? "text-ink-3" : good ? "text-pos" : "text-neg";

  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-ink-2">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-num font-medium">{fmt(current)}</span>
        <span className={cn("flex items-center gap-0.5 text-xs font-num", color)}>
          <Icon className="h-3 w-3" />
          {fmt(Math.abs(diff))}
        </span>
      </div>
    </div>
  );
}

/** % del mes transcurrido para la clave dada (100% si es un mes pasado). */
function monthElapsedPct(key: string): number {
  const now = new Date();
  const current = monthKey(now);
  if (key < current) return 100;
  if (key > current) return 0;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.round((now.getDate() / daysInMonth) * 100);
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
  const elapsed = monthElapsedPct(month);

  return (
    <BentoCard tone="tint" className="rise h-full">
      <SectionLabel icon={Gauge} accent="var(--orange)">
        PROYECCIÓN FIN DE MES
      </SectionLabel>

      <div
        className={cn(
          "font-display text-3xl leading-none tabular-nums",
          negative ? "text-neg" : "text-ink"
        )}
      >
        {formatCLP(projection.projectedBalance)}
      </div>
      <p className="text-xs text-ink-2 mt-2 mb-3 leading-snug">
        Saldo estimado al cierre si cumples tus compromisos pendientes.
      </p>

      <div className="flex justify-between text-[11.5px] text-ink-3 mb-[5px]">
        <span>Mes transcurrido</span>
        <span className="font-num">{elapsed}%</span>
      </div>
      <Progress value={elapsed} className="h-2 bg-surface-3 [&>div]:bg-brand" />

      <div className="flex items-center gap-[7px] mt-3 py-[9px] px-[11px] bg-card border rounded-[10px]">
        {negative ? (
          <AlertCircle className="h-[15px] w-[15px] text-neg shrink-0" />
        ) : (
          <CheckCircle2 className="h-[15px] w-[15px] text-pos shrink-0" />
        )}
        <span className="text-xs text-ink-2">
          {negative ? (
            <>
              Proyección en rojo por{" "}
              <b className="text-neg font-num">
                {formatCLP(Math.abs(projection.projectedBalance))}
              </b>
            </>
          ) : (
            <>
              Dentro de presupuesto por{" "}
              <b className="text-pos font-num">{formatCLP(projection.projectedBalance)}</b>
            </>
          )}
        </span>
      </div>

      {/* Comparación con el mes anterior */}
      {prevMetrics && (
        <div className="mt-3.5 space-y-1.5">
          <p className="text-[11.5px] font-semibold text-ink-3 uppercase tracking-wide">
            vs. mes anterior
          </p>
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
      )}
    </BentoCard>
  );
}
