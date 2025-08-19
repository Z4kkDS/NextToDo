"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { LocalTodoService } from "@/lib/localTodoService";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Tipo para usuario local
interface LocalUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  isLocal: boolean;
}

interface AuthContextType {
  user: User | LocalUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario local guardado
    const localUser = localStorage.getItem("localUser");
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false);
      return;
    }

    // Si no hay usuario local, verificar Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Limpiar usuario local si existe
      localStorage.removeItem("localUser");
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      // Manejar errores específicos
      if (error.code === "auth/popup-closed-by-user") {
        console.log("El usuario cerró el popup de autenticación");
      } else if (error.code === "auth/popup-blocked") {
        console.log("El popup fue bloqueado por el navegador");
      }
      setLoading(false);
    }
  };

  const signInAsGuest = () => {
    setLoading(true);
    const guestUser: LocalUser = {
      uid: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      displayName: "Usuario Local",
      email: "local@demo.com",
      isLocal: true,
    };

    localStorage.setItem("localUser", JSON.stringify(guestUser));
    setUser(guestUser);
    setLoading(false);
  };

  const logout = async () => {
    try {
      // Si es usuario local, limpiar sus datos
      if (user && (user as LocalUser).isLocal) {
        LocalTodoService.clearLocalData(user.uid);
        localStorage.removeItem("localUser");
        setUser(null);
        return;
      }

      // Limpiar usuario local del localStorage (por si acaso)
      localStorage.removeItem("localUser");

      // Si es usuario de Firebase, hacer logout
      if (user) {
        await signOut(auth);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
