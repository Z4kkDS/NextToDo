"use client";

import { computeEarnedXp } from "@/lib/gamification";
import { LocalTodoService } from "@/lib/localTodoService";
import { buildNextOccurrence, isRecurring } from "@/lib/recurrence";
import { TodoService } from "@/lib/todoService";
import { LocalXpBank, XpBankService } from "@/lib/xpBank";
import { NewTodoInput, Todo, TodoContextType, TodoFilter, TodoSort, UpdateTodoInput } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("active");
  const [sort, setSort] = useState<TodoSort>("created");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar todos del usuario cuando se autentique
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    setLoading(true);

    // Si es usuario local, cargar desde localStorage
    if ("isLocal" in user && user.isLocal) {
      const localTodos = LocalTodoService.getTodos(user.uid);
      setTodos(localTodos);
      setLoading(false);
      return;
    }

    // Si es usuario de Firebase, suscribirse a cambios en tiempo real
    const unsubscribe = TodoService.subscribeToUserTodos(user.uid, (userTodos) => {
      setTodos(userTodos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (todoInput: NewTodoInput) => {
    if (!user) return;

    try {
      // Si es usuario local, usar LocalTodoService
      if ("isLocal" in user && user.isLocal) {
        const newTodoId = LocalTodoService.createTodo(user.uid, todoInput);
        // Recargar todos locales
        const updatedTodos = LocalTodoService.getTodos(user.uid);
        setTodos(updatedTodos);
        return;
      }

      // Si es usuario de Firebase, usar TodoService
      await TodoService.createTodo(user.uid, todoInput);
      // No necesitamos actualizar el estado local porque la suscripción se encarga
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo || !user) return;

    const willComplete = !todo.completed;

    try {
      // Si es usuario local, usar LocalTodoService
      if ("isLocal" in user && user.isLocal) {
        LocalTodoService.toggleTodo(user.uid, id, willComplete);
        setTodos(LocalTodoService.getTodos(user.uid));
      } else {
        // Si es usuario de Firebase, usar TodoService
        await TodoService.toggleTodo(id, willComplete);
      }

      // Si se completó una tarea recurrente, generar la siguiente ocurrencia.
      if (willComplete && isRecurring(todo)) {
        await addTodo(buildNextOccurrence(todo));
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Conserva en el banco el XP que aportaban las tareas a eliminar, para que
  // borrar completadas (una a una o en limpieza) no haga perder progreso.
  const bankXpBeforeDelete = async (ids: Set<string>) => {
    if (!user) return;
    const earned =
      computeEarnedXp(todos) - computeEarnedXp(todos.filter((t) => !ids.has(t.id)));
    if (earned <= 0) return;

    if ("isLocal" in user && user.isLocal) {
      LocalXpBank.add(user.uid, earned);
    } else {
      await XpBankService.add(user.uid, earned);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const todo = todos.find((t) => t.id === id);
      if (todo?.completed) {
        await bankXpBeforeDelete(new Set([id]));
      }

      // Si es usuario local, usar LocalTodoService
      if ("isLocal" in user && user.isLocal) {
        LocalTodoService.deleteTodo(user.uid, id);
        // Recargar todos locales
        const updatedTodos = LocalTodoService.getTodos(user.uid);
        setTodos(updatedTodos);
        return;
      }

      // Si es usuario de Firebase, usar TodoService
      await TodoService.deleteTodo(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const clearCompleted = async () => {
    if (!user) return;

    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    if (completedIds.length === 0) return;

    try {
      await bankXpBeforeDelete(new Set(completedIds));

      if ("isLocal" in user && user.isLocal) {
        completedIds.forEach((id) => LocalTodoService.deleteTodo(user.uid, id));
        setTodos(LocalTodoService.getTodos(user.uid));
        return;
      }

      await Promise.all(completedIds.map((id) => TodoService.deleteTodo(id)));
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };

  const updateTodo = async (id: string, todoInput: Partial<UpdateTodoInput>) => {
    if (!user) return;

    try {
      // Si es usuario local, usar LocalTodoService
      if ("isLocal" in user && user.isLocal) {
        LocalTodoService.updateTodo(user.uid, id, todoInput);
        // Recargar todos locales
        const updatedTodos = LocalTodoService.getTodos(user.uid);
        setTodos(updatedTodos);
        return;
      }

      // Si es usuario de Firebase, usar TodoService
      await TodoService.updateTodo(id, todoInput);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
        clearCompleted,
        filter,
        setFilter,
        sort,
        setSort,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        loading,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
}
