"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFinance } from "@/context/FinanceContext";
import { useTodo } from "@/context/TodoContext";
import { formatCLP, totalIncome, totalSpent } from "@/lib/finance-utils";
import { getTaskExpenses } from "@/lib/task-finance";
import { TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthBudget } from "@/types/finance";

const MONTHS_BACK = 6;

function shortMonth(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1)
    .toLocaleDateString("es-CL", { month: "short" })
    .replace(".", "");
}

export function SpendingTrendChart() {
  const { loadTrend, month } = useFinance();
  const { todos } = useTodo();
  const [budgets, setBudgets] = useState<MonthBudget[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setBudgets(null);
    loadTrend(MONTHS_BACK).then((b) => {
      if (!cancelled) setBudgets(b);
    });
    return () => {
      cancelled = true;
    };
  }, [loadTrend, month]);

  const data = useMemo(() => {
    if (!budgets) return [];
    return budgets.map((b) => {
      const taskSpent = getTaskExpenses(todos, b.month).spent;
      return {
        month: shortMonth(b.month),
        ingresos: totalIncome(b.incomes),
        gastos: totalSpent(b.expenses) + taskSpent,
      };
    });
  }, [budgets, todos]);

  if (budgets === null) {
    return <Skeleton className="h-56 w-full rounded-lg" />;
  }

  if (data.length === 0 || data.every((d) => d.ingresos === 0 && d.gastos === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <TrendingUp className="h-9 w-9 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Aún no hay historial suficiente para mostrar la tendencia.
        </p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
          />
          <Tooltip
            formatter={(value) => formatCLP(Number(value))}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="gastos" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
