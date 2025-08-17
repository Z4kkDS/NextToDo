"use client";

import { NewTodoInput, Todo, TodoContextType, TodoFilter, UpdateTodoInput } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");

  // Cargar todos del localStorage al inicio
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Guardar todos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoInput: NewTodoInput) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...todoInput,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, todoInput: Partial<UpdateTodoInput>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...todoInput, updatedAt: new Date() } : todo))
    );
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
