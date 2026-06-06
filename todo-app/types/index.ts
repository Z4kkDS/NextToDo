import type { ExpenseCategory } from "./finance";

export interface Todo {
  id: string;
  userId: string;
  text: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: "baja" | "media" | "alta";
  tags?: string[];
  /** Monto en CLP. Si está presente, la tarea cuenta como gasto en Finanzas. */
  amount?: number;
  /** Categoría de gasto a la que se imputa el monto (default "cuentas"). */
  expenseCategory?: ExpenseCategory;
  /** Si la tarea se repite, al completarla se genera la siguiente ocurrencia. */
  recurrence?: TodoRecurrence;
  /** Checklist de sub-pasos. */
  subtasks?: Subtask[];
}

export type TodoFilter = "all" | "active" | "completed" | "overdue";

export type TodoSort = "created" | "dueDate" | "priority" | "alphabetical";

/** Frecuencia de repetición de una tarea. "none" = no se repite. */
export type TodoRecurrence = "none" | "daily" | "weekly" | "monthly";

/** Sub-paso dentro de una tarea (checklist). */
export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

export interface NewTodoInput {
  text: string;
  description?: string;
  dueDate?: Date;
  priority: "baja" | "media" | "alta";
  tags?: string[];
  amount?: number;
  expenseCategory?: ExpenseCategory;
  recurrence?: TodoRecurrence;
  subtasks?: Subtask[];
}

export interface UpdateTodoInput {
  text?: string;
  description?: string;
  dueDate?: Date;
  priority?: "baja" | "media" | "alta";
  completed?: boolean;
  tags?: string[];
  amount?: number;
  expenseCategory?: ExpenseCategory;
  recurrence?: TodoRecurrence;
  subtasks?: Subtask[];
}

export interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: NewTodoInput) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, todo: Partial<UpdateTodoInput>) => void;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  sort: TodoSort;
  setSort: (sort: TodoSort) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tagFilter: string | null;
  setTagFilter: (tag: string | null) => void;
  loading: boolean;
}
