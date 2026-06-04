import { ExpenseCategory, Expense, Income, MonthBudget } from "@/types/finance";

/** Formatea un número como pesos chilenos: 650000 -> "$650.000". */
export function formatCLP(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Clave de mes "YYYY-MM" a partir de una fecha. */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Nombre legible del mes: "2026-06" -> "junio 2026". */
export function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
}

/** Mes anterior/siguiente a partir de una clave. */
export function shiftMonth(key: string, delta: number): string {
  const [year, month] = key.split("-").map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return monthKey(d);
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "cuentas", label: "Cuentas" },
  { value: "ahorro", label: "Ahorro" },
  { value: "proyectos", label: "Proyectos" },
  { value: "deudas", label: "Deudas" },
  { value: "subscripciones", label: "Subscripciones" },
  { value: "otros", label: "Otros" },
];

export const CATEGORY_META: Record<ExpenseCategory, { label: string; color: string }> = {
  cuentas: { label: "Cuentas", color: "bg-sky-500" },
  ahorro: { label: "Ahorro", color: "bg-emerald-500" },
  proyectos: { label: "Proyectos", color: "bg-violet-500" },
  deudas: { label: "Deudas", color: "bg-rose-500" },
  subscripciones: { label: "Subscripciones", color: "bg-amber-500" },
  otros: { label: "Otros", color: "bg-slate-500" },
};

export function totalIncome(incomes: Income[]): number {
  return incomes.reduce((sum, i) => sum + i.amount, 0);
}

export function totalPlanned(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.planned, 0);
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.spent, 0);
}

/** Saldo disponible real = ingresos − gastado. */
export function availableBalance(budget: MonthBudget): number {
  return totalIncome(budget.incomes) - totalSpent(budget.expenses);
}

/** Tasa de ahorro: (ingreso − gasto) / ingreso, en %. */
export function savingsRate(budget: MonthBudget): number {
  const income = totalIncome(budget.incomes);
  if (income <= 0) return 0;
  return Math.round((availableBalance(budget) / income) * 100);
}

// ── Regla 50/30/20 ──────────────────────────────────────────────────────
// Mapea cada categoría de gasto a un bucket de la regla.
type Bucket = "needs" | "wants" | "savings";

const CATEGORY_BUCKET: Record<ExpenseCategory, Bucket> = {
  cuentas: "needs",
  deudas: "needs",
  subscripciones: "wants",
  proyectos: "wants",
  otros: "wants",
  ahorro: "savings",
};

export interface Rule503020 {
  needs: { spent: number; target: number; pct: number };
  wants: { spent: number; target: number; pct: number };
  savings: { spent: number; target: number; pct: number };
  income: number;
}

/** Calcula la distribución 50/30/20 a partir del gasto planificado por categoría. */
export function calcRule503020(budget: MonthBudget): Rule503020 {
  const income = totalIncome(budget.incomes);
  const buckets: Record<Bucket, number> = { needs: 0, wants: 0, savings: 0 };

  budget.expenses.forEach((e) => {
    buckets[CATEGORY_BUCKET[e.category]] += e.planned;
  });

  const pct = (v: number) => (income > 0 ? Math.round((v / income) * 100) : 0);

  return {
    income,
    needs: { spent: buckets.needs, target: income * 0.5, pct: pct(buckets.needs) },
    wants: { spent: buckets.wants, target: income * 0.3, pct: pct(buckets.wants) },
    savings: { spent: buckets.savings, target: income * 0.2, pct: pct(buckets.savings) },
  };
}
