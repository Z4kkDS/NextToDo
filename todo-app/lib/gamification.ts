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

/* ── Anti-farming: rendimientos decrecientes por día ──────────────────────
   Completar muchas tareas el mismo día reduce el XP de las siguientes, para
   que crear tareas triviales en masa no sirva para farmear niveles:
   1ª–10ª del día → 100% · 11ª–20ª → 50% · 21ª en adelante → 10%. */

export const FULL_XP_TASKS_PER_DAY = 10;
export const REDUCED_XP_TASKS_PER_DAY = 20;
const REDUCED_RATE = 0.5;
const MIN_RATE = 0.1;

/** Multiplicador de XP para la n-ésima tarea completada del día (0-based). */
export function dailyXpRate(indexInDay: number): number {
  if (indexInDay < FULL_XP_TASKS_PER_DAY) return 1;
  if (indexInDay < REDUCED_XP_TASKS_PER_DAY) return REDUCED_RATE;
  return MIN_RATE;
}

/** XP efectivo de una tarea según su posición entre las completadas del día. */
export function effectiveXp(
  todo: Pick<Todo, "priority" | "subtasks">,
  indexInDay: number
): number {
  return Math.max(1, Math.round(xpForTodo(todo) * dailyXpRate(indexInDay)));
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/**
 * XP total que otorgan las tareas completadas existentes, aplicando los
 * rendimientos decrecientes por día. updatedAt de una completada ≈ fecha en
 * que se completó (mismo criterio que racha y estadísticas).
 */
export function computeEarnedXp(todos: Todo[]): number {
  const completed = todos
    .filter((t) => t.completed)
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

  const countPerDay = new Map<string, number>();
  let total = 0;
  for (const t of completed) {
    const key = dayKey(new Date(t.updatedAt));
    const idx = countPerDay.get(key) ?? 0;
    total += effectiveXp(t, idx);
    countPerDay.set(key, idx + 1);
  }
  return total;
}

/** XP que otorgará completar `todo` ahora mismo (para el toast). */
export function nextCompletionXp(
  todos: Todo[],
  todo: Pick<Todo, "id" | "priority" | "subtasks">
): number {
  const today = dayKey(new Date());
  const doneToday = todos.filter(
    (t) => t.completed && t.id !== todo.id && dayKey(new Date(t.updatedAt)) === today
  ).length;
  return effectiveXp(todo, doneToday);
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
