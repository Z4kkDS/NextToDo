"use client";

import { useTodo } from "@/context/TodoContext";
import {
  levelFromXp,
  xpForTodo,
  xpToNextLevel,
  xpWithinLevel,
} from "@/lib/gamification";
import { calculateStreak } from "@/lib/streak";
import { Todo } from "@/types";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface GamificationContextType {
  /** Nivel actual del usuario (1+, sin límite). */
  level: number;
  /** XP acumulado dentro del nivel actual. */
  xp: number;
  /** XP necesario para completar el nivel actual (crece con el nivel). */
  xpMax: number;
  /** Racha de días consecutivos con tareas completadas. */
  streak: number;
  /** true mientras dura el destello dorado de la barra de XP. */
  flash: boolean;
  /** true mientras el toast "+XP" está visible. */
  toastVisible: boolean;
  /** XP ganado en la última tarea completada (para el toast). */
  lastEarnedXp: number;
  /** Dispara la celebración (destello + toast). Llamar al completar una tarea. */
  celebrate: (todo: Pick<Todo, "priority" | "subtasks">) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { todos } = useTodo();
  const [flash, setFlash] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(25);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // XP derivado del estado real: determinista y sincronizado entre dispositivos.
  const { level, xp, xpMax, streak } = useMemo(() => {
    const completedTodos = todos.filter((t) => t.completed);
    const totalXp = completedTodos.reduce((sum, t) => sum + xpForTodo(t), 0);
    const lvl = levelFromXp(totalXp);
    return {
      level: lvl,
      xp: xpWithinLevel(totalXp),
      xpMax: xpToNextLevel(lvl),
      streak: calculateStreak(todos),
    };
  }, [todos]);

  const celebrate = useCallback((todo: Pick<Todo, "priority" | "subtasks">) => {
    setLastEarnedXp(xpForTodo(todo));
    setFlash(true);
    setToastVisible(true);
    timers.current.push(setTimeout(() => setFlash(false), 750));
    timers.current.push(setTimeout(() => setToastVisible(false), 1700));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const value = useMemo(
    () => ({ level, xp, xpMax, streak, flash, toastVisible, lastEarnedXp, celebrate }),
    [level, xp, xpMax, streak, flash, toastVisible, lastEarnedXp, celebrate]
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification debe usarse dentro de GamificationProvider");
  }
  return ctx;
}
