"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { Skeleton } from "@/components/ui/skeleton";
import { useFinance } from "@/context/FinanceContext";
import { useTodo } from "@/context/TodoContext";
import { getTaskExpenses } from "@/lib/task-finance";
import { AlertTriangle, ChartPie, RefreshCw, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { BalanceSummary } from "./BalanceSummary";
import { ExpenseSection } from "./ExpenseSection";
import { FinanceAdvice } from "./FinanceAdvice";
import { IncomeSection } from "./IncomeSection";
import { MonthProjection } from "./MonthProjection";
import { MonthSelector } from "./MonthSelector";
import { Rule503020 } from "./Rule503020";
import { SavingsGoals } from "./SavingsGoals";
import { SpendingByCategoryChart } from "./SpendingByCategoryChart";
import { SpendingTrendChart } from "./SpendingTrendChart";
import { TaskExpensesSection } from "./TaskExpensesSection";

/** Panel de Finanzas — bento grid: saldo héroe, dona, consejos, tendencia, proyección y metas. */
export function FinancePanel() {
  const { budget, loading, month, error, retry } = useFinance();
  const { todos } = useTodo();

  const taskExpenses = useMemo(() => getTaskExpenses(todos, month), [todos, month]);

  return (
    <div className="space-y-4">
      {/* Encabezado: título + selector de mes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-ink">Panel de Finanzas</h2>
          <p className="text-sm text-ink-2">Controla tus ingresos y gastos mes a mes.</p>
        </div>
        <MonthSelector />
      </div>

      {error ? (
        <BentoCard className="rise">
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <AlertTriangle className="h-9 w-9 text-destructive/70" />
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
            <Button variant="outline" size="sm" onClick={retry} className="cursor-pointer gap-2">
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </div>
        </BentoCard>
      ) : loading || !budget ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <Skeleton className="h-56 rounded-2xl lg:col-span-5" />
          <Skeleton className="h-56 rounded-2xl lg:col-span-4" />
          <Skeleton className="h-56 rounded-2xl lg:col-span-3" />
          <Skeleton className="h-64 rounded-2xl lg:col-span-12" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Saldo destacado */}
          <div className="lg:col-span-5">
            <BalanceSummary
              budget={budget}
              taskSpent={taskExpenses.spent}
              taskPlanned={taskExpenses.planned}
            />
          </div>

          {/* Dona de gastos */}
          <BentoCard className="rise lg:col-span-4">
            <SectionLabel icon={ChartPie} accent="var(--orange)">
              GASTOS POR CATEGORÍA
            </SectionLabel>
            <SpendingByCategoryChart budget={budget} />
          </BentoCard>

          {/* Consejos con semáforo */}
          <div className="lg:col-span-3">
            <FinanceAdvice budget={budget} />
          </div>

          {/* Tendencia mensual */}
          <BentoCard className="rise lg:col-span-5">
            <SectionLabel icon={TrendingUp} accent="var(--pri-baja)">
              TENDENCIA MENSUAL
            </SectionLabel>
            <SpendingTrendChart />
          </BentoCard>

          {/* Proyección fin de mes */}
          <div className="lg:col-span-3">
            <MonthProjection budget={budget} />
          </div>

          {/* Metas de ahorro */}
          <div className="lg:col-span-4">
            <SavingsGoals />
          </div>

          {/* Gestión: ingresos, gastos, tareas-gasto y regla 50/30/20 */}
          <div className="lg:col-span-6 space-y-4">
            <IncomeSection />
            <ExpenseSection />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <TaskExpensesSection month={month} />
            <Rule503020 budget={budget} />
          </div>
        </div>
      )}
    </div>
  );
}
