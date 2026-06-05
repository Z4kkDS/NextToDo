import { MonthBudget } from "@/types/finance";
import {
  calcRule503020,
  formatCLP,
  monthKey,
  totalIncome,
  totalPlanned,
  totalSpent,
} from "./finance-utils";

export type AdviceSeverity = "good" | "info" | "warning" | "danger";

export interface Advice {
  id: string;
  severity: AdviceSeverity;
  title: string;
  message: string;
}

export type HealthStatus = "good" | "warning" | "danger" | "neutral";

export interface FinanceHealth {
  status: HealthStatus;
  label: string;
  advices: Advice[];
}

interface AnalyzeOptions {
  /** Gasto ya registrado proveniente de tareas completadas con monto. */
  taskSpent?: number;
  /** Gasto programado proveniente de tareas pendientes con monto. */
  taskPlanned?: number;
  /** Fecha "ahora" (inyectable para tests). */
  now?: Date;
}

function daysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

const HEALTH_LABEL: Record<HealthStatus, string> = {
  good: "Saludable",
  warning: "Atención",
  danger: "En riesgo",
  neutral: "Sin datos",
};

/**
 * Motor de reglas: analiza el presupuesto del mes (incluyendo los gastos
 * derivados de tareas) y devuelve un estado de salud + lista de consejos.
 * Todo basado en reglas locales, sin IA.
 */
export function analyzeFinances(budget: MonthBudget, opts: AnalyzeOptions = {}): FinanceHealth {
  const { taskSpent = 0, taskPlanned = 0, now = new Date() } = opts;

  const income = totalIncome(budget.incomes);
  const spent = totalSpent(budget.expenses) + taskSpent;
  const available = income - spent;
  const rate = income > 0 ? Math.round((available / income) * 100) : 0;

  const advices: Advice[] = [];

  // 1. Sin ingresos → no hay nada que analizar.
  if (income <= 0) {
    return {
      status: "neutral",
      label: HEALTH_LABEL.neutral,
      advices: [
        {
          id: "no-income",
          severity: "info",
          title: "Agrega tus ingresos",
          message: "Registra el sueldo y otros ingresos del mes para activar el análisis.",
        },
      ],
    };
  }

  let hasDanger = false;
  let hasWarning = false;

  // 2. Saldo negativo.
  if (available < 0) {
    hasDanger = true;
    advices.push({
      id: "negative-balance",
      severity: "danger",
      title: "Estás gastando de más",
      message: `Tu saldo es ${formatCLP(available)}. Gastas más de lo que ingresas este mes.`,
    });
  }

  // 3. Ritmo de gasto (solo para el mes en curso).
  if (monthKey(now) === budget.month && available >= 0) {
    const dim = daysInMonth(budget.month);
    const expectedPct = Math.round((now.getDate() / dim) * 100);
    const spentPct = Math.round((spent / income) * 100);
    if (spentPct > expectedPct + 15) {
      hasWarning = true;
      advices.push({
        id: "fast-pace",
        severity: "warning",
        title: "Vas más rápido que el calendario",
        message: `Llevas ${spentPct}% de tus ingresos gastado y solo va ${expectedPct}% del mes. Modera el ritmo.`,
      });
    }
  }

  // 4. Categorías del presupuesto sobregiradas.
  const overspent = budget.expenses.filter((e) => e.spent > e.planned && e.planned > 0);
  if (overspent.length > 0) {
    hasWarning = true;
    const names = overspent.map((e) => e.name).join(", ");
    advices.push({
      id: "overspent",
      severity: "warning",
      title: "Te pasaste del plan",
      message: `Superaste lo presupuestado en: ${names}.`,
    });
  }

  // 5. Tareas programadas que no alcanzan a cubrirse con el saldo.
  if (taskPlanned > 0 && taskPlanned > available) {
    hasWarning = true;
    advices.push({
      id: "tasks-exceed",
      severity: "warning",
      title: "Tareas programadas por encima del saldo",
      message: `Tienes ${formatCLP(taskPlanned)} en tareas pendientes con monto, pero solo ${formatCLP(
        available
      )} disponibles.`,
    });
  }

  // 6. Tasa de ahorro.
  if (rate >= 20) {
    advices.push({
      id: "savings-great",
      severity: "good",
      title: "¡Excelente ahorro!",
      message: `Vas ahorrando un ${rate}% de tus ingresos. Mantén el ritmo.`,
    });
  } else if (rate >= 1) {
    advices.push({
      id: "savings-ok",
      severity: "info",
      title: `Ahorras un ${rate}%`,
      message: "La meta saludable es 20%. Pequeños recortes te acercan.",
    });
  } else if (available >= 0) {
    hasWarning = true;
    advices.push({
      id: "savings-none",
      severity: "warning",
      title: "Sin margen de ahorro",
      message: "Estás gastando casi todo lo que ingresas. Intenta reservar algo este mes.",
    });
  }

  // 7. Regla 50/30/20: necesidades por encima del 50%.
  const rule = calcRule503020(budget);
  if (rule.needs.pct > 50) {
    advices.push({
      id: "needs-high",
      severity: "info",
      title: "Necesidades altas",
      message: `Tus gastos esenciales son ${rule.needs.pct}% de tus ingresos (recomendado ≤50%).`,
    });
  }

  // 8. Presupuesto sin planificar (hay ingresos pero casi nada planificado).
  if (totalPlanned(budget.expenses) === 0 && taskPlanned === 0) {
    advices.push({
      id: "no-plan",
      severity: "info",
      title: "Planifica tus gastos",
      message: "Aún no registras gastos planificados. Añádelos para controlar mejor el mes.",
    });
  }

  // 9. Todo en orden.
  if (!hasDanger && !hasWarning) {
    advices.unshift({
      id: "all-good",
      severity: "good",
      title: "Finanzas sanas",
      message: "Tu mes luce equilibrado. ¡Buen trabajo!",
    });
  }

  const status: HealthStatus = hasDanger ? "danger" : hasWarning ? "warning" : "good";

  return { status, label: HEALTH_LABEL[status], advices };
}
