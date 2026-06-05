"use client";

import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { monthKey, monthLabel, shiftMonth } from "@/lib/finance-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function MonthSelector() {
  const { month, setMonth } = useFinance();
  const current = monthKey(new Date());
  const isCurrent = month === current;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 cursor-pointer"
        onClick={() => setMonth(shiftMonth(month, -1))}
        aria-label="Mes anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="min-w-[150px] text-center">
        <p className="font-semibold capitalize leading-tight">{monthLabel(month)}</p>
        {!isCurrent && (
          <button
            onClick={() => setMonth(current)}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Volver al mes actual
          </button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 cursor-pointer"
        onClick={() => setMonth(shiftMonth(month, 1))}
        aria-label="Mes siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
