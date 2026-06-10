"use client";

import { FinanceService } from "@/lib/financeService";
import { monthKey, shiftMonth } from "@/lib/finance-utils";
import { LocalFinanceService } from "@/lib/localFinanceService";
import {
  Expense,
  Income,
  MonthBudget,
  NewExpenseInput,
  NewIncomeInput,
  SavingsGoal,
} from "@/types/finance";
import { FirebaseError } from "firebase/app";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface FinanceContextType {
  month: string;
  setMonth: (m: string) => void;
  budget: MonthBudget | null;
  goals: SavingsGoal[];
  loading: boolean;
  error: string | null;
  retry: () => void;
  addIncome: (input: NewIncomeInput) => void;
  deleteIncome: (id: string) => void;
  addExpense: (input: NewExpenseInput) => void;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addGoal: (name: string, target: number) => void;
  updateGoal: (id: string, patch: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  /** Carga los presupuestos existentes de los últimos N meses (para gráficos). */
  loadTrend: (monthsBack: number) => Promise<MonthBudget[]>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [month, setMonth] = useState<string>(() => monthKey(new Date()));
  const [budget, setBudget] = useState<MonthBudget | null>(null);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const isLocal = !!user && "isLocal" in user && user.isLocal;

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  // Cargar presupuesto del mes + metas cuando cambia el usuario o el mes.
  useEffect(() => {
    if (!user) {
      setBudget(null);
      setGoals([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        if (isLocal) {
          const b = LocalFinanceService.getOrCreateBudget(user.uid, month);
          const g = LocalFinanceService.getGoals(user.uid);
          if (!cancelled) {
            setBudget(b);
            setGoals(g);
          }
        } else {
          const [b, g] = await Promise.all([
            FinanceService.getOrCreateBudget(user.uid, month),
            FinanceService.getGoals(user.uid),
          ]);
          if (!cancelled) {
            setBudget(b);
            setGoals(g);
          }
        }
      } catch (error) {
        console.error("Error loading finance:", error);
        if (!cancelled) {
          const denied =
            error instanceof FirebaseError && error.code === "permission-denied";
          setError(
            denied
              ? "No tienes permisos para leer tus finanzas. Verifica que las reglas de Firestore del proyecto incluyan las colecciones budgets y financeGoals."
              : "No se pudieron cargar tus finanzas. Revisa tu conexión e inténtalo de nuevo."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, month, isLocal, reloadKey]);

  const persistBudget = useCallback(
    (next: MonthBudget) => {
      if (!user) return;
      setBudget(next);
      if (isLocal) LocalFinanceService.saveBudget(user.uid, next);
      else FinanceService.saveBudget(user.uid, next).catch(console.error);
    },
    [user, isLocal]
  );

  const persistGoals = useCallback(
    (next: SavingsGoal[]) => {
      if (!user) return;
      setGoals(next);
      if (isLocal) LocalFinanceService.saveGoals(user.uid, next);
      else FinanceService.saveGoals(user.uid, next).catch(console.error);
    },
    [user, isLocal]
  );

  // ── Ingresos ──
  const addIncome = (input: NewIncomeInput) => {
    if (!budget) return;
    const income: Income = { id: uid(), ...input };
    persistBudget({ ...budget, incomes: [...budget.incomes, income] });
  };
  const deleteIncome = (id: string) => {
    if (!budget) return;
    persistBudget({ ...budget, incomes: budget.incomes.filter((i) => i.id !== id) });
  };

  // ── Gastos ──
  const addExpense = (input: NewExpenseInput) => {
    if (!budget) return;
    const expense: Expense = { id: uid(), ...input };
    persistBudget({ ...budget, expenses: [...budget.expenses, expense] });
  };
  const updateExpense = (id: string, patch: Partial<Expense>) => {
    if (!budget) return;
    persistBudget({
      ...budget,
      expenses: budget.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });
  };
  const deleteExpense = (id: string) => {
    if (!budget) return;
    persistBudget({ ...budget, expenses: budget.expenses.filter((e) => e.id !== id) });
  };

  // ── Metas de ahorro (globales, cruzan meses) ──
  const addGoal = (name: string, target: number) => {
    persistGoals([
      ...goals,
      { id: uid(), name, target, saved: 0, createdAt: new Date().toISOString() },
    ]);
  };
  const updateGoal = (id: string, patch: Partial<SavingsGoal>) => {
    persistGoals(goals.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };
  const deleteGoal = (id: string) => {
    persistGoals(goals.filter((g) => g.id !== id));
  };

  // ── Tendencia (varios meses) ──
  const loadTrend = useCallback(
    async (monthsBack: number): Promise<MonthBudget[]> => {
      if (!user) return [];
      // Genera las claves de mes desde (N-1) meses atrás hasta el mes actual.
      const months: string[] = [];
      for (let i = monthsBack - 1; i >= 0; i--) months.push(shiftMonth(month, -i));
      try {
        return isLocal
          ? LocalFinanceService.getBudgets(user.uid, months)
          : await FinanceService.getBudgets(user.uid, months);
      } catch (error) {
        console.error("Error loading trend:", error);
        return [];
      }
    },
    [user, isLocal, month]
  );

  return (
    <FinanceContext.Provider
      value={{
        month,
        setMonth,
        budget,
        goals,
        loading,
        error,
        retry,
        addIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addGoal,
        updateGoal,
        deleteGoal,
        loadTrend,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
