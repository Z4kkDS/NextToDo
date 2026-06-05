import { FinanceData, MonthBudget, SavingsGoal } from "@/types/finance";
import { shiftMonth } from "./finance-utils";

const FINANCE_KEY = "nexToDo_finance";

function emptyData(): FinanceData {
  return { budgets: {}, goals: [] };
}

function emptyBudget(userId: string, month: string): MonthBudget {
  return { userId, month, incomes: [], expenses: [] };
}

export class LocalFinanceService {
  static getData(userId: string): FinanceData {
    try {
      const stored = localStorage.getItem(`${FINANCE_KEY}_${userId}`);
      if (!stored) return emptyData();
      const parsed = JSON.parse(stored) as FinanceData;
      return { budgets: parsed.budgets ?? {}, goals: parsed.goals ?? [] };
    } catch (error) {
      console.error("Error loading finance data:", error);
      return emptyData();
    }
  }

  private static saveData(userId: string, data: FinanceData): void {
    try {
      localStorage.setItem(`${FINANCE_KEY}_${userId}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving finance data:", error);
    }
  }

  /**
   * Obtiene el presupuesto de un mes. Si no existe, lo crea copiando los
   * gastos recurrentes del mes anterior (el dinero gastado se reinicia a 0).
   */
  static getOrCreateBudget(userId: string, month: string): MonthBudget {
    const data = this.getData(userId);
    if (data.budgets[month]) return data.budgets[month];

    const prev = data.budgets[shiftMonth(month, -1)];
    const budget = emptyBudget(userId, month);

    if (prev) {
      budget.expenses = prev.expenses
        .filter((e) => e.recurring)
        .map((e) => ({
          ...e,
          id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          spent: 0,
        }));
    }

    data.budgets[month] = budget;
    this.saveData(userId, data);
    return budget;
  }

  static saveBudget(userId: string, budget: MonthBudget): void {
    const data = this.getData(userId);
    data.budgets[budget.month] = budget;
    this.saveData(userId, data);
  }

  /** Devuelve los presupuestos existentes para una lista de meses (no crea). */
  static getBudgets(userId: string, months: string[]): MonthBudget[] {
    const data = this.getData(userId);
    return months.map((m) => data.budgets[m]).filter((b): b is MonthBudget => !!b);
  }

  static getGoals(userId: string): SavingsGoal[] {
    return this.getData(userId).goals;
  }

  static saveGoals(userId: string, goals: SavingsGoal[]): void {
    const data = this.getData(userId);
    data.goals = goals;
    this.saveData(userId, data);
  }

  static clearLocalData(userId: string): void {
    localStorage.removeItem(`${FINANCE_KEY}_${userId}`);
  }
}
