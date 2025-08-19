"use client";

import { LocalTodoService } from "@/lib/localTodoService";
import { TodoService } from "@/lib/todoService";
import { NewTodoInput, Todo, TodoContextType, TodoFilter, UpdateTodoInput } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
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

    try {
      // Si es usuario local, usar LocalTodoService
      if ("isLocal" in user && user.isLocal) {
        LocalTodoService.toggleTodo(user.uid, id, !todo.completed);
        // Recargar todos locales
        const updatedTodos = LocalTodoService.getTodos(user.uid);
        setTodos(updatedTodos);
        return;
      }

      // Si es usuario de Firebase, usar TodoService
      await TodoService.toggleTodo(id, !todo.completed);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
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
        filter,
        setFilter,
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
