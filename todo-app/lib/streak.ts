import { Todo } from "@/types";

/** Normaliza una fecha a su día (medianoche) en timestamp local. */
function dayStart(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Calcula la racha de productividad: número de días consecutivos (terminando
 * hoy o ayer) en los que se completó al menos una tarea.
 *
 * Usa updatedAt de las tareas completadas como aproximación de la fecha en que
 * se completaron (no guardamos completedAt en el modelo actual).
 */
export function calculateStreak(todos: Todo[]): number {
  const completedDays = new Set<number>();
  todos.forEach((t) => {
    if (t.completed) completedDays.add(dayStart(new Date(t.updatedAt)));
  });

  if (completedDays.size === 0) return 0;

  const today = dayStart(new Date());
  const yesterday = today - ONE_DAY;

  // La racha solo cuenta si hubo actividad hoy o ayer.
  let cursor: number;
  if (completedDays.has(today)) cursor = today;
  else if (completedDays.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  while (completedDays.has(cursor)) {
    streak++;
    cursor -= ONE_DAY;
  }
  return streak;
}
