"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { CheckSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Panel izquierdo — hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12 text-primary-foreground">
        <div className="max-w-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">NexToDo</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight">
              Organiza tu día en segundos
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              La forma más simple de gestionar tus tareas y cumplir tus metas.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: "✅", text: "Crea y organiza tareas en segundos" },
              { icon: "🎯", text: "Prioridades y fechas límite claras" },
              { icon: "📊", text: "Sigue tu progreso en tiempo real" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-primary-foreground/90">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Logo mobile */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">NexToDo</span>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold">Empieza ahora</h2>
            <p className="text-muted-foreground text-sm">
              Sin tarjetas, sin complicaciones.
            </p>
          </div>

          <LoginForm />

          <p className="text-muted-foreground text-center text-xs">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Términos
            </a>{" "}
            y{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
