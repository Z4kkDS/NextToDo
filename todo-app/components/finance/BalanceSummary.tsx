"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCLP, totalIncome, totalSpent } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";
import { MonthBudget } from "@/types/finance";
import { ArrowDownCircle, ArrowUpCircle, ListChecks, PiggyBank, Wallet } from "lucide-react";

interface BalanceSummaryProps {
  budget: MonthBudget;
  /** Gasto ya registrado proveniente de tareas completadas con monto. */
  taskSpent?: number;
  /** Gasto programado proveniente de tareas pendientes con monto. */
  taskPlanned?: number;
}

export function BalanceSummary({ budget, taskSpent = 0, taskPlanned = 0 }: BalanceSummaryProps) {
  const income = totalIncome(budget.incomes);
  // El gasto total incluye lo del presupuesto + lo de tareas completadas.
  const spent = totalSpent(budget.expenses) + taskSpent;
  const available = income - spent;
  const rate = income > 0 ? Math.round((available / income) * 100) : 0;
  const spentPct = income > 0 ? Math.min(Math.round((spent / income) * 100), 100) : 0;
  const negative = available < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Ingresos */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
            Ingresos del mes
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatCLP(income)}
          </p>
        </CardContent>
      </Card>

      {/* Gastado */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <ArrowDownCircle className="h-4 w-4 text-rose-500" />
            Gastado
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
            {formatCLP(spent)}
          </p>
          <Progress value={spentPct} className="h-1.5 mt-2" />
          <p className="text-xs text-muted-foreground mt-1">{spentPct}% de tus ingresos</p>
        </CardContent>
      </Card>

      {/* Saldo disponible */}
      <Card
        className={cn(
          negative
            ? "border-rose-300 bg-rose-50/50 dark:border-rose-500/30 dark:bg-rose-500/10"
            : "border-primary/30 bg-primary/5"
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Wallet className="h-4 w-4 text-primary" />
            Saldo disponible
          </div>
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              negative ? "text-rose-600 dark:text-rose-400" : "text-foreground"
            )}
          >
            {formatCLP(available)}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <PiggyBank className="h-3 w-3" />
            Tasa de ahorro: <span className="font-semibold">{rate}%</span>
          </div>
          {taskPlanned > 0 && (
            <div className="flex items-center gap-1 text-xs text-primary/80 mt-1">
              <ListChecks className="h-3 w-3" />
              {formatCLP(taskPlanned)} programado en tareas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
