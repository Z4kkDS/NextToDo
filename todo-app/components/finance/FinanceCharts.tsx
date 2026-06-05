"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthBudget } from "@/types/finance";
import { ChartPie, TrendingUp } from "lucide-react";
import { SpendingByCategoryChart } from "./SpendingByCategoryChart";
import { SpendingTrendChart } from "./SpendingTrendChart";

export function FinanceCharts({ budget }: { budget: MonthBudget }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ChartPie className="h-5 w-5 text-primary" />
            Gastos por categoría
          </CardTitle>
          <p className="text-xs text-muted-foreground">Distribución del gasto de este mes.</p>
        </CardHeader>
        <CardContent>
          <SpendingByCategoryChart budget={budget} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tendencia mensual
          </CardTitle>
          <p className="text-xs text-muted-foreground">Ingresos vs gastos de los últimos 6 meses.</p>
        </CardHeader>
        <CardContent>
          <SpendingTrendChart />
        </CardContent>
      </Card>
    </div>
  );
}
