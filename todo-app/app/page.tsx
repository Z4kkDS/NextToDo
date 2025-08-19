"use client";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Usuario autenticado, redirigir al dashboard
        router.push("/dashboard");
      } else {
        // Usuario no autenticado, redirigir al login
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica la autenticación y redirige
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
