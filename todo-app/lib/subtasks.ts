import { Subtask, Todo } from "@/types";

export function newSubtaskId(): string {
  return `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface SubtaskProgress {
  done: number;
  total: number;
  pct: number;
}

export function subtaskProgress(todo: Todo): SubtaskProgress {
  const subs = todo.subtasks ?? [];
  const total = subs.length;
  const done = subs.filter((s) => s.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}

export function hasSubtasks(todo: Todo): boolean {
  return !!todo.subtasks && todo.subtasks.length > 0;
}

/** Crea un subtask nuevo a partir de un texto. */
export function makeSubtask(text: string): Subtask {
  return { id: newSubtaskId(), text: text.trim(), done: false };
}
