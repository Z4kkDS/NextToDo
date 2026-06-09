"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { formatCLP, totalIncome, totalSpent } from "@/lib/finance-utils";
import { MonthBudget } from "@/types/finance";
import { ArrowDown, ArrowUp, ListChecks, Wallet } from "lucide-react";

interface BalanceSummaryProps {
  budget: MonthBudget;
  /** Gasto ya registrado proveniente de tareas completadas con monto. */
  taskSpent?: number;
  /** Gasto programado proveniente de tareas pendientes con monto. */
  taskPlanned?: number;
}

/** Tarjeta héroe del bento de finanzas: saldo disponible sobre gradiente naranja. */
export function BalanceSummary({ budget, taskSpent = 0, taskPlanned = 0 }: BalanceSummaryProps) {
  const income = totalIncome(budget.incomes);
  // El gasto total incluye lo del presupuesto + lo de tareas completadas.
  const spent = totalSpent(budget.expenses) + taskSpent;
  const available = income - spent;
  const spentPct = income > 0 ? Math.min(Math.round((spent / income) * 100), 100) : 0;

  return (
    <BentoCard
      className="rise h-full relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(150deg, #F97316, #EA6306)",
        borderColor: "#EA6306",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 88% -20%, rgba(255,255,255,.22), transparent 55%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="font-display text-sm opacity-90 tracking-[.5px]">
            SALDO DISPONIBLE
          </span>
        </div>
        <div className="font-display text-4xl lg:text-[44px] leading-[1.05] mt-1.5 tracking-[-0.025em] tabular-nums">
          {formatCLP(available)}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3.5">
          <div>
            <div className="flex items-center gap-[5px] text-xs opacity-90">
              <ArrowDown className="h-[13px] w-[13px]" /> Ingresos
            </div>
            <div className="font-num text-[17px]">{formatCLP(income)}</div>
          </div>
          <div>
            <div className="flex items-center gap-[5px] text-xs opacity-90">
              <ArrowUp className="h-[13px] w-[13px]" /> Gastos
            </div>
            <div className="font-num text-[17px]">{formatCLP(spent)}</div>
          </div>
          {taskPlanned > 0 && (
            <div>
              <div className="flex items-center gap-[5px] text-xs opacity-90">
                <ListChecks className="h-[13px] w-[13px]" /> En tareas
              </div>
              <div className="font-num text-[17px]">{formatCLP(taskPlanned)}</div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs opacity-90 mb-[5px]">
            <span>Presupuesto del mes</span>
            <span className="font-num">{spentPct}%</span>
          </div>
          <div
            className="h-2.5 rounded-full overflow-hidden border"
            style={{ background: "rgba(0,0,0,.22)", borderColor: "rgba(255,255,255,.25)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${spentPct}%`, background: "#FBBF24" }}
            />
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
