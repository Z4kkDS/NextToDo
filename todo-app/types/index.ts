export interface Todo {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: "baja" | "media" | "alta";
}

export type TodoFilter = "all" | "active" | "completed" | "overdue";

export interface NewTodoInput {
  text: string;
  description?: string;
  dueDate?: Date;
  priority: "baja" | "media" | "alta";
}

export interface UpdateTodoInput {
  text?: string;
  description?: string;
  dueDate?: Date;
  priority?: "baja" | "media" | "alta";
  completed?: boolean;
}

export interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: NewTodoInput) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, todo: Partial<UpdateTodoInput>) => void;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
}
