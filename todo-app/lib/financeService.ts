import { db } from "@/lib/firebase";
import { MonthBudget, SavingsGoal } from "@/types/finance";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { shiftMonth } from "./finance-utils";

// Un documento por usuario+mes en la colección "budgets" (id: `${userId}_${month}`)
// y un documento por usuario en "financeGoals" (id: userId).
const BUDGETS = "budgets";
const GOALS = "financeGoals";

function emptyBudget(userId: string, month: string): MonthBudget {
  return { userId, month, incomes: [], expenses: [] };
}

export class FinanceService {
  static async getOrCreateBudget(userId: string, month: string): Promise<MonthBudget> {
    const ref = doc(db, BUDGETS, `${userId}_${month}`);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as MonthBudget;

    // No existe: intentar copiar recurrentes del mes anterior.
    const prevRef = doc(db, BUDGETS, `${userId}_${shiftMonth(month, -1)}`);
    const prevSnap = await getDoc(prevRef);
    const budget = emptyBudget(userId, month);

    if (prevSnap.exists()) {
      const prev = prevSnap.data() as MonthBudget;
      budget.expenses = prev.expenses
        .filter((e) => e.recurring)
        .map((e) => ({
          ...e,
          id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          spent: 0,
        }));
    }

    await setDoc(ref, budget);
    return budget;
  }

  static async saveBudget(userId: string, budget: MonthBudget): Promise<void> {
    const ref = doc(db, BUDGETS, `${userId}_${budget.month}`);
    await setDoc(ref, budget);
  }

  /** Lee los presupuestos existentes para una lista de meses (no crea). */
  static async getBudgets(userId: string, months: string[]): Promise<MonthBudget[]> {
    const snaps = await Promise.all(
      months.map((m) => getDoc(doc(db, BUDGETS, `${userId}_${m}`)))
    );
    return snaps.filter((s) => s.exists()).map((s) => s.data() as MonthBudget);
  }

  static async getGoals(userId: string): Promise<SavingsGoal[]> {
    const ref = doc(db, GOALS, userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return [];
    return (snap.data().goals ?? []) as SavingsGoal[];
  }

  static async saveGoals(userId: string, goals: SavingsGoal[]): Promise<void> {
    const ref = doc(db, GOALS, userId);
    await setDoc(ref, { goals });
  }
}
