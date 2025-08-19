import { NewTodoInput, Todo, UpdateTodoInput } from "@/types";

const LOCAL_TODOS_KEY = "nexToDo_localTodos";

export class LocalTodoService {
  // Obtener todos los todos locales
  static getTodos(userId: string): Todo[] {
    try {
      const stored = localStorage.getItem(`${LOCAL_TODOS_KEY}_${userId}`);
      if (!stored) return [];

      const todos = JSON.parse(stored);
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    } catch (error) {
      console.error("Error loading local todos:", error);
      return [];
    }
  }

  // Guardar todos en localStorage
  private static saveTodos(userId: string, todos: Todo[]): void {
    try {
      localStorage.setItem(`${LOCAL_TODOS_KEY}_${userId}`, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving local todos:", error);
    }
  }

  // Crear un nuevo todo
  static createTodo(userId: string, todoInput: NewTodoInput): string {
    const todos = this.getTodos(userId);
    const newTodo: Todo = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...todoInput,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    todos.unshift(newTodo); // Agregar al inicio
    this.saveTodos(userId, todos);
    return newTodo.id;
  }

  // Actualizar un todo
  static updateTodo(
    userId: string,
    todoId: string,
    updates: Partial<UpdateTodoInput & { completed?: boolean }>
  ): void {
    const todos = this.getTodos(userId);
    const todoIndex = todos.findIndex((t) => t.id === todoId);

    if (todoIndex === -1) return;

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveTodos(userId, todos);
  }

  // Eliminar un todo
  static deleteTodo(userId: string, todoId: string): void {
    const todos = this.getTodos(userId);
    const filteredTodos = todos.filter((t) => t.id !== todoId);
    this.saveTodos(userId, filteredTodos);
  }

  // Alternar completado
  static toggleTodo(userId: string, todoId: string, completed: boolean): void {
    this.updateTodo(userId, todoId, { completed });
  }

  // Limpiar todos los datos locales (útil para logout)
  static clearLocalData(userId: string): void {
    localStorage.removeItem(`${LOCAL_TODOS_KEY}_${userId}`);
  }
}
