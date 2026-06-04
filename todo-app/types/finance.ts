// Modelo del Panel de Finanzas. Cada mes es independiente (un "sobre" propio).

export type ExpenseCategory =
  | "cuentas"
  | "ahorro"
  | "proyectos"
  | "deudas"
  | "subscripciones"
  | "otros";

export type IncomeType = "sueldo" | "extra";

export interface Income {
  id: string;
  label: string;
  amount: number;
  /** ISO date string (YYYY-MM-DD) en que ingresó el dinero. */
  date: string;
  type: IncomeType;
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  /** Monto presupuestado para el mes. */
  planned: number;
  /** Monto realmente gastado hasta ahora. */
  spent: number;
  /** Si es true, se copia automáticamente al crear el mes siguiente. */
  recurring: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  createdAt: string;
}

/** Presupuesto de un mes concreto. Clave de mes: "YYYY-MM". */
export interface MonthBudget {
  userId: string;
  month: string;
  incomes: Income[];
  expenses: Expense[];
}

/** Estructura completa persistida por usuario. */
export interface FinanceData {
  budgets: Record<string, MonthBudget>;
  goals: SavingsGoal[];
}

export interface NewIncomeInput {
  label: string;
  amount: number;
  date: string;
  type: IncomeType;
}

export interface NewExpenseInput {
  name: string;
  category: ExpenseCategory;
  planned: number;
  spent: number;
  recurring: boolean;
}
