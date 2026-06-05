"use client";

import { useTodo } from "@/context/TodoContext";
import { CATEGORY_HEX, CATEGORY_META, formatCLP } from "@/lib/finance-utils";
import { getTaskExpenses, taskExpenseCategory } from "@/lib/task-finance";
import { ExpenseCategory, MonthBudget } from "@/types/finance";
import { PieChartIcon } from "lucide-react";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Slice {
  category: ExpenseCategory;
  label: string;
  value: number;
  color: string;
}

export function SpendingByCategoryChart({ budget }: { budget: MonthBudget }) {
  const { todos } = useTodo();

  const data = useMemo<Slice[]>(() => {
    const totals = {} as Record<ExpenseCategory, number>;

    // Gasto del presupuesto por categoría.
    for (const e of budget.expenses) {
      if (e.spent > 0) totals[e.category] = (totals[e.category] ?? 0) + e.spent;
    }

    // Gasto derivado de tareas completadas, por su categoría.
    const { items } = getTaskExpenses(todos, budget.month);
    for (const t of items) {
      if (t.completed && t.amount) {
        const cat = taskExpenseCategory(t);
        totals[cat] = (totals[cat] ?? 0) + t.amount;
      }
    }

    return (Object.keys(totals) as ExpenseCategory[])
      .map((cat) => ({
        category: cat,
        label: CATEGORY_META[cat].label,
        value: totals[cat],
        color: CATEGORY_HEX[cat],
      }))
      .sort((a, b) => b.value - a.value);
  }, [budget, todos]);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <PieChartIcon className="h-9 w-9 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Aún no hay gastos registrados este mes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="h-44 w-44 shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.category} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCLP(Number(value))}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Total en el centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-muted-foreground">Total</span>
          <span className="text-sm font-bold tabular-nums">{formatCLP(total)}</span>
        </div>
      </div>

      {/* Leyenda */}
      <ul className="flex-1 space-y-1.5 w-full">
        {data.map((d) => {
          const pct = Math.round((d.value / total) * 100);
          return (
            <li key={d.category} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="flex-1 truncate">{d.label}</span>
              <span className="text-muted-foreground tabular-nums text-xs">{pct}%</span>
              <span className="font-medium tabular-nums w-24 text-right">{formatCLP(d.value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
