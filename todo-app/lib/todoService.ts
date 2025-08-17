import { db } from "@/lib/firebase";
import { NewTodoInput, Todo, UpdateTodoInput } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const TODOS_COLLECTION = "todos";

export class TodoService {
  // Obtener todos los todos de un usuario
  static async getTodosByUser(userId: string): Promise<Todo[]> {
    const q = query(
      collection(db, TODOS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      dueDate: doc.data().dueDate?.toDate(),
    })) as Todo[];
  }

  // Suscribirse a cambios en tiempo real
  static subscribeToUserTodos(userId: string, callback: (todos: Todo[]) => void): () => void {
    const q = query(
      collection(db, TODOS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const todos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      })) as Todo[];

      callback(todos);
    });
  }

  // Crear un nuevo todo
  static async createTodo(userId: string, todoInput: NewTodoInput): Promise<string> {
    const newTodo = {
      userId,
      ...todoInput,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, TODOS_COLLECTION), newTodo);
    return docRef.id;
  }

  // Actualizar un todo
  static async updateTodo(
    todoId: string,
    updates: Partial<UpdateTodoInput & { completed?: boolean }>
  ): Promise<void> {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  // Eliminar un todo
  static async deleteTodo(todoId: string): Promise<void> {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await deleteDoc(todoRef);
  }

  // Alternar el estado completado de un todo
  static async toggleTodo(todoId: string, completed: boolean): Promise<void> {
    await this.updateTodo(todoId, { completed });
  }
}
