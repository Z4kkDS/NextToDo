import type { Todo } from "@/types";

/** XP base al completar una tarea según su prioridad. */
export const XP_BY_PRIORITY: Record<Todo["priority"], number> = {
  baja: 10,
  media: 25,
  alta: 50,
};

const XP_PER_SUBTASK = 5;
const MAX_SUBTASK_BONUS = 20;

/** XP que otorga completar `todo` (prioridad + bonificación por subtareas). */
export function xpForTodo(todo: Pick<Todo, "priority" | "subtasks">): number {
  const base = XP_BY_PRIORITY[todo.priority] ?? XP_BY_PRIORITY.media;
  const subtaskBonus = Math.min(
    (todo.subtasks?.length ?? 0) * XP_PER_SUBTASK,
    MAX_SUBTASK_BONUS
  );
  return base + subtaskBonus;
}

/**
 * XP total acumulado para alcanzar el nivel `n` desde 0.
 * Curva cuadrática: cada nivel cuesta 100×nivel XP más que el anterior.
 * L1=0 · L2=100 · L3=300 · L4=600 · L5=1000 · L10=4500 …
 */
export function totalXpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 50 * n * (n + 1);
}

/** XP necesario para avanzar del nivel `level` al siguiente. */
export function xpToNextLevel(level: number): number {
  return level * 100;
}

/** Nivel dado el XP total acumulado (sin límite de nivel). */
export function levelFromXp(totalXp: number): number {
  if (totalXp <= 0) return 1;
  // Despejando totalXpForLevel(n) = 50*(n-1)*n ≤ totalXp
  const m = Math.floor((-1 + Math.sqrt(1 + 4 * totalXp / 50)) / 2);
  return m + 1;
}

/** XP dentro del nivel actual (progreso hacia el siguiente). */
export function xpWithinLevel(totalXp: number): number {
  return totalXp - totalXpForLevel(levelFromXp(totalXp));
}
