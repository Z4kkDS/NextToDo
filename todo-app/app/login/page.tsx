"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";
import {
  Coins,
  Flame,
  Loader2,
  LucideIcon,
  Sparkles,
  Star,
  Target,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ── Fondo animado: orbes difuminados + glifos flotando ── */
const GLYPHS: { Icon: LucideIcon; size: number; top: string; left: string; cls: string; op: number }[] = [
  { Icon: Sparkles, size: 22, top: "16%", left: "14%", cls: "lh-fa", op: 0.5 },
  { Icon: Coins, size: 26, top: "26%", left: "72%", cls: "lh-fb", op: 0.42 },
  { Icon: Star, size: 18, top: "60%", left: "10%", cls: "lh-fc", op: 0.4 },
  { Icon: Zap, size: 20, top: "72%", left: "78%", cls: "lh-fa", op: 0.46 },
  { Icon: Trophy, size: 22, top: "44%", left: "86%", cls: "lh-fb", op: 0.36 },
  { Icon: Target, size: 20, top: "85%", left: "40%", cls: "lh-fc", op: 0.34 },
];

function AnimatedBg() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="lh-oa absolute -top-[12%] -left-[10%] w-80 h-80 rounded-full blur-lg"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,.22), transparent 68%)" }}
      />
      <div
        className="lh-ob absolute -bottom-[14%] -right-[8%] w-[360px] h-[360px] rounded-full blur-xl"
        style={{ background: "radial-gradient(circle, rgba(255,180,90,.30), transparent 66%)" }}
      />
      <div
        className="lh-oa absolute top-[34%] left-[44%] w-60 h-60 rounded-full blur-xl"
        style={{ background: "radial-gradient(circle, rgba(180,50,5,.22), transparent 70%)" }}
      />
      {GLYPHS.map(({ Icon, size, top, left, cls, op }, i) => (
        <div key={i} className={`absolute ${cls}`} style={{ top, left, opacity: op }}>
          <Icon style={{ width: size, height: size }} className="text-white" strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

/* ── Hero rotativo: frase + icono que ciclan por las facetas del producto ── */
const HERO_ITEMS: { Icon: LucideIcon; line1: string; line2: string; sub: string }[] = [
  { Icon: Zap, line1: "Tu día,", line2: "nivel a nivel.", sub: "Completa tareas y gana XP en cada paso." },
  { Icon: Wallet, line1: "Tus finanzas,", line2: "bajo control.", sub: "Gastos, ingresos y ahorro en un solo lugar." },
  { Icon: Trophy, line1: "Cada avance", line2: "cuenta.", sub: "Sube de nivel y desbloquea insignias." },
  { Icon: Target, line1: "Metas de ahorro", line2: "que sí cumples.", sub: "Define un objetivo y acércate cada día." },
  { Icon: Flame, line1: "Mantén tu", line2: "racha encendida.", sub: "Vuelve cada día y no la pierdas." },
];

function RotatingHero() {
  const [idx, setIdx] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduce(true);
      return;
    }
    const id = setInterval(() => setIdx((i) => (i + 1) % HERO_ITEMS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const { Icon, line1, line2, sub } = HERO_ITEMS[idx];

  return (
    <div className="relative z-10">
      {/* item activo: re-montado por key para que la entrada se reproduzca en cada cambio */}
      <div key={idx} className={reduce ? "" : "hero-enter"} style={{ minHeight: 224 }}>
        <div
          className="grid place-items-center w-14 h-14 rounded-2xl mb-5 border"
          style={{
            background: "rgba(255,255,255,.22)",
            borderColor: "rgba(255,255,255,.34)",
            boxShadow: "0 10px 24px -12px rgba(0,0,0,.35)",
          }}
        >
          <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-4xl leading-[1.08] mb-3 max-w-[360px] text-white">
          {line1}
          <br />
          {line2}
        </h1>
        <p className="m-0 text-[15.5px] leading-normal max-w-[360px] text-white/90">{sub}</p>
      </div>

      {/* dots de progreso */}
      <div className="flex gap-[7px] mt-[22px]">
        {HERO_ITEMS.map((_, i) => (
          <span
            key={i}
            className="h-1.5 rounded-full"
            style={{
              width: i === idx ? 22 : 6,
              background: i === idx ? "#fff" : "rgba(255,255,255,.4)",
              transition: reduce ? "none" : "width .5s cubic-bezier(.2,.7,.3,1), background .5s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* ── Panel izquierdo: hero animado naranja ── */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-between p-10 text-white"
        style={{ background: "linear-gradient(160deg, #F97316, #EA6306)" }}
      >
        <AnimatedBg />

        {/* marca */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div
            className="font-display grid place-items-center w-10 h-10 bg-white rounded-[10px] text-[22px]"
            style={{ color: "#EA6306", boxShadow: "0 6px 16px -6px rgba(0,0,0,.22)" }}
          >
            N
          </div>
          <span className="font-display text-2xl">NexToDo</span>
        </div>

        <RotatingHero />
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div className="flex flex-1 flex-col items-center justify-center p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        {/* Logo mobile */}
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="font-display grid place-items-center w-10 h-10 bg-primary text-primary-foreground rounded-[10px] text-[22px]">
            N
          </div>
          <span className="font-display text-2xl">NexToDo</span>
        </div>

        <div className="w-full max-w-[380px]">
          <div className="font-display text-[13px] text-brand tracking-[1px] mb-1.5">
            ¡HOLA DE NUEVO!
          </div>
          <h2 className="font-display text-3xl text-ink mb-1.5">Inicia sesión</h2>
          <p className="text-sm text-ink-2 mb-6">
            Continúa donde lo dejaste y suma a tu racha de hoy.
          </p>

          <LoginForm />

          <p className="mt-[22px] text-[12.5px] text-ink-3 text-center leading-normal">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="text-brand-deep font-semibold no-underline hover:underline">
              Términos
            </a>{" "}
            y{" "}
            <a href="#" className="text-brand-deep font-semibold no-underline hover:underline">
              Privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
