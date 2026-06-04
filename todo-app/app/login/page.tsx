"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { CheckSquare, ListChecks, Loader2, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BENEFITS = [
  {
    icon: ListChecks,
    title: "Crea y organiza al instante",
    desc: "Añade tareas en segundos con prioridades y fechas límite.",
  },
  {
    icon: Target,
    title: "Enfócate en lo que importa",
    desc: "Filtra por estado, prioridad y vencimiento.",
  },
  {
    icon: TrendingUp,
    title: "Sigue tu progreso en tiempo real",
    desc: "Estadísticas claras de tu rendimiento diario.",
  },
];

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Panel izquierdo: hero con gradiente aurora ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #1a1560 40%, #24243e 100%)",
        }}
      >
        {/* Blobs aurora animados */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full opacity-20 blur-3xl animate-[drift_14s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full opacity-15 blur-3xl animate-[drift_18s_ease-in-out_infinite_reverse]"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
          <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] rounded-full opacity-10 blur-2xl animate-[drift_22s_ease-in-out_infinite_1s]"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
        </div>

        {/* Contenido del hero */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">NexToDo</span>
          </div>
        </div>

        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Organiza tu día.<br />
              <span className="text-indigo-300">Logra más.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              La gestión de tareas que se adapta a tu ritmo — simple, visual y sin fricciones.
            </p>
          </div>

          <ul className="space-y-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mt-0.5">
                  <Icon className="h-4 w-4 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{title}</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-xs">© 2026 NexToDo</p>
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Logo mobile */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">NexToDo</span>
        </div>

        <div className="w-full max-w-[360px] space-y-8">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Bienvenido</h2>
            <p className="text-muted-foreground text-sm">
              Elige cómo quieres continuar.
            </p>
          </div>

          <LoginForm />

          <p className="text-muted-foreground text-center text-xs">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Términos
            </a>{" "}
            y{" "}
            <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
              Privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
