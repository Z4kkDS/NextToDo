"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { SectionLabel } from "@/components/ui/section-label";
import { useTodo } from "@/context/TodoContext";
import { AdviceSeverity, analyzeFinances, HealthStatus } from "@/lib/finance-advice";
import { getTaskExpenses } from "@/lib/task-finance";
import { cn } from "@/lib/utils";
import { MonthBudget } from "@/types/finance";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

/** Color del punto semáforo por severidad del consejo. */
const SEVERITY_DOT: Record<AdviceSeverity, string> = {
  good: "var(--sema-ok)",
  info: "#0ea5e9",
  warning: "var(--sema-warn)",
  danger: "var(--sema-bad)",
};

const HEALTH_STYLE: Record<HealthStatus, { dot: string; text: string }> = {
  good: { dot: "var(--sema-ok)", text: "text-pos" },
  warning: { dot: "var(--sema-warn)", text: "text-xp" },
  danger: { dot: "var(--sema-bad)", text: "text-neg" },
  neutral: { dot: "var(--ink-3)", text: "text-ink-2" },
};

export function FinanceAdvice({ budget }: { budget: MonthBudget }) {
  const { todos } = useTodo();

  const health = useMemo(() => {
    const { planned, spent } = getTaskExpenses(todos, budget.month);
    return analyzeFinances(budget, { taskPlanned: planned, taskSpent: spent });
  }, [budget, todos]);

  const hs = HEALTH_STYLE[health.status];

  return (
    <BentoCard className="rise h-full">
      <div className="flex items-center justify-between gap-2 mb-3">
        <SectionLabel icon={Sparkles} accent="var(--amber)" className="mb-0">
          CONSEJOS
        </SectionLabel>
        {/* Semáforo de salud financiera */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="h-2.5 w-2.5 rounded-[4px] shrink-0 animate-pulse"
            style={{ background: hs.dot }}
          />
          <span className={cn("text-[13px] font-semibold truncate", hs.text)}>
            {health.label}
          </span>
        </div>
      </div>

      <div className="grid gap-[11px]">
        {health.advices.map((a) => (
          <div key={a.id} className="flex items-start gap-[9px]">
            <span
              className="w-3 h-3 rounded-[4px] shrink-0 mt-[3px] border border-black/10"
              style={{ background: SEVERITY_DOT[a.severity] }}
            />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink leading-tight">{a.title}</p>
              <p className="text-[12.5px] text-ink-2 leading-snug mt-0.5">{a.message}</p>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}
