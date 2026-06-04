import { Todo, TodoFilter, TodoSort } from "@/types";

const PRIORITY_ORDER: Record<string, number> = { alta: 0, media: 1, baja: 2 };

function isOverdue(todo: Todo): boolean {
  return !todo.completed && !!todo.dueDate && new Date(todo.dueDate) < new Date();
}

/** Aplica filtro de estado, búsqueda por texto y filtro por etiqueta. */
export function applyFilters(
  todos: Todo[],
  filter: TodoFilter,
  searchQuery: string,
  tagFilter: string | null
): Todo[] {
  const q = searchQuery.trim().toLowerCase();

  return todos.filter((todo) => {
    // Estado
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;
    if (filter === "overdue" && !isOverdue(todo)) return false;

    // Etiqueta
    if (tagFilter && !(todo.tags ?? []).includes(tagFilter)) return false;

    // Búsqueda en título, descripción y etiquetas
    if (q) {
      const haystack = [
        todo.text,
        todo.description ?? "",
        ...(todo.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

/** Ordena una copia de la lista según el criterio elegido. */
export function applySort(todos: Todo[], sort: TodoSort): Todo[] {
  const copy = [...todos];

  switch (sort) {
    case "dueDate":
      return copy.sort((a, b) => {
        // Sin fecha al final
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    case "priority":
      return copy.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
    case "alphabetical":
      return copy.sort((a, b) => a.text.localeCompare(b.text, "es"));
    case "created":
    default:
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
}

/** Lista única de etiquetas presentes en las tareas, ordenada alfabéticamente. */
export function getAllTags(todos: Todo[]): string[] {
  const set = new Set<string>();
  todos.forEach((t) => (t.tags ?? []).forEach((tag) => set.add(tag)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
}

/** Color determinista (clase Tailwind) para una etiqueta según su hash. */
const TAG_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
];

export function getTagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash << 5) - hash + tag.charCodeAt(i);
    hash |= 0;
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}
