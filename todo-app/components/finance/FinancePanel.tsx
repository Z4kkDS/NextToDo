"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFinance } from "@/context/FinanceContext";
import { BalanceSummary } from "./BalanceSummary";
import { ExpenseSection } from "./ExpenseSection";
import { IncomeSection } from "./IncomeSection";
import { MonthSelector } from "./MonthSelector";
import { Rule503020 } from "./Rule503020";
import { SavingsGoals } from "./SavingsGoals";

export function FinancePanel() {
  const { budget, loading } = useFinance();

  return (
    <div className="space-y-6">
      {/* Encabezado: título + selector de mes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold">Panel de Finanzas</h2>
          <p className="text-sm text-muted-foreground">
            Controla tus ingresos y gastos mes a mes.
          </p>
        </div>
        <MonthSelector />
      </div>

      {loading || !budget ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <>
          <BalanceSummary budget={budget} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <IncomeSection />
              <ExpenseSection />
            </div>
            <div className="space-y-6">
              <Rule503020 budget={budget} />
              <SavingsGoals />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
