"use client";

import { useTodo } from "@/context/TodoContext";
import { calculateStreak } from "@/lib/streak";
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

/** XP otorgado por completar una tarea. */
export const XP_PER_TASK = 25;
/** XP necesario para subir de nivel. */
export const XP_PER_LEVEL = 500;

interface GamificationContextType {
  /** Nivel actual del usuario (1+). */
  level: number;
  /** XP acumulado dentro del nivel actual. */
  xp: number;
  /** XP necesario para completar el nivel. */
  xpMax: number;
  /** Racha de días consecutivos con tareas completadas. */
  streak: number;
  /** true mientras dura el destello dorado de la barra de XP. */
  flash: boolean;
  /** true mientras el toast "+25 XP" está visible. */
  toastVisible: boolean;
  /** Dispara la celebración (destello + toast). Llamar al completar una tarea. */
  celebrate: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { todos } = useTodo();
  const [flash, setFlash] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // XP derivado del estado real: determinista y sincronizado entre dispositivos.
  const { level, xp, streak } = useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const totalXp = completed * XP_PER_TASK;
    return {
      level: Math.floor(totalXp / XP_PER_LEVEL) + 1,
      xp: totalXp % XP_PER_LEVEL,
      streak: calculateStreak(todos),
    };
  }, [todos]);

  const celebrate = useCallback(() => {
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
    () => ({ level, xp, xpMax: XP_PER_LEVEL, streak, flash, toastVisible, celebrate }),
    [level, xp, streak, flash, toastVisible, celebrate]
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
