"use client";

import { auth, googleProvider } from "@/lib/firebase";
import { LocalTodoService } from "@/lib/localTodoService";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

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

    // Si no hay usuario local, escuchar el estado de Firebase Auth.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("localUser");
      // Popup: el flujo se completa en la ventana emergente y la credencial
      // vuelve por el SDK. Es más fiable que signInWithRedirect en navegadores
      // que particionan cookies de terceros (el redirect perdía la sesión al
      // volver desde el dominio *.firebaseapp.com).
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged se encarga de actualizar el usuario.
    } catch (error) {
      console.error("Error signing in with Google:", error);

      if (error instanceof FirebaseError) {
        // El usuario cerró el popup o canceló: no es un error que mostrar.
        if (
          error.code === "auth/popup-closed-by-user" ||
          error.code === "auth/cancelled-popup-request"
        ) {
          // silencioso
        } else if (error.code === "auth/popup-blocked") {
          toast.error("El navegador bloqueó la ventana. Permite las ventanas emergentes e inténtalo de nuevo.");
        } else if (error.code === "auth/unauthorized-domain") {
          toast.error(
            "Este dominio no está autorizado en Firebase. Agrégalo en Authentication → Settings → Authorized domains."
          );
        } else {
          toast.error("No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
        }
      } else {
        toast.error("No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
      }
    } finally {
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
