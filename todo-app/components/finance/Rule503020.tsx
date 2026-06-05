"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calcRule503020, formatCLP } from "@/lib/finance-utils";
import { cn } from "@/lib/utils";
import { MonthBudget } from "@/types/finance";
import { Scale } from "lucide-react";

export function Rule503020({ budget }: { budget: MonthBudget }) {
  const rule = calcRule503020(budget);

  if (rule.income <= 0) return null;

  const rows = [
    { key: "needs", label: "Necesidades", targetPct: 50, color: "bg-sky-500", data: rule.needs },
    { key: "wants", label: "Deseos", targetPct: 30, color: "bg-violet-500", data: rule.wants },
    { key: "savings", label: "Ahorro", targetPct: 20, color: "bg-emerald-500", data: rule.savings },
  ] as const;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scale className="h-5 w-5 text-primary" />
          Regla 50/30/20
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Distribución recomendada de tus ingresos.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map(({ key, label, targetPct, color, data }) => {
          const fill = Math.min(data.pct, 100);
          const off = data.pct > targetPct + 5;
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
                  {label}
                  <span className="text-xs text-muted-foreground">
                    (recomendado {targetPct}%)
                  </span>
                </span>
                <span
                  className={cn(
                    "font-medium tabular-nums",
                    off ? "text-rose-600 dark:text-rose-400" : "text-foreground"
                  )}
                >
                  {data.pct}%
                </span>
              </div>
              {/* Barra con marca del objetivo */}
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-300", color)}
                  style={{ width: `${fill}%` }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-foreground/40"
                  style={{ left: `${targetPct}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatCLP(data.spent)} de {formatCLP(data.target)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
