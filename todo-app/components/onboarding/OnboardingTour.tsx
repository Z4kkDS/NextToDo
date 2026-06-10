"use client";

import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/context/OnboardingContext";
import type { OnboardingTourTab } from "@/context/OnboardingContext";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CheckCircle2,
  Filter,
  Landmark,
  Lightbulb,
  PartyPopper,
  PieChart,
  PlusCircle,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TourStep {
  /** Valor del atributo data-tour del elemento a resaltar. Si se omite, el paso se muestra centrado. */
  selector?: string;
  /** Pestaña que debe estar visible antes de medir el elemento objetivo. */
  tab?: OnboardingTourTab;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: TourStep[] = [
  {
    icon: Sparkles,
    title: "¡Bienvenido a NexToDo! 👋",
    description:
      "Te muestro en unos pasos cómo organizar tus tareas y tus finanzas. Solo te tomará unos segundos.",
  },
  {
    selector: "create-todo",
    tab: "tasks",
    icon: PlusCircle,
    title: "Crea tus tareas",
    description:
      "Pulsa «Nueva Tarea» para añadir algo que quieras recordar. Puedes ponerle descripción, fecha límite y prioridad.",
  },
  {
    selector: "filters",
    tab: "tasks",
    icon: Filter,
    title: "Filtra y enfócate",
    description:
      "Cambia entre todas tus tareas, las pendientes, las completadas y las vencidas con un solo clic.",
  },
  {
    selector: "todo-checkbox",
    tab: "tasks",
    icon: CheckCircle2,
    title: "Márcalas como completadas",
    description:
      "Activa la casilla de una tarea cuando la termines. ¡Verás cómo sube tu progreso al instante!",
  },
  {
    selector: "stats",
    tab: "tasks",
    icon: BarChart3,
    title: "Sigue tu progreso",
    description:
      "Aquí ves tu porcentaje completado, las tareas pendientes y un resumen de tu día.",
  },
  {
    selector: "finance-tab",
    tab: "finance",
    icon: Wallet,
    title: "También tienes finanzas",
    description:
      "Entra a la pestaña Finanzas para revisar tu presupuesto mensual junto a tus tareas.",
  },
  {
    selector: "finance-balance",
    tab: "finance",
    icon: Landmark,
    title: "Revisa tu saldo del mes",
    description:
      "Este resumen combina ingresos, gastos y montos pagados desde tareas para mostrar cuánto tienes disponible.",
  },
  {
    selector: "finance-categories",
    tab: "finance",
    icon: PieChart,
    title: "Entiende en qué gastas",
    description:
      "La dona de categorías y la tendencia mensual te ayudan a detectar patrones de gasto rápidamente.",
  },
  {
    selector: "finance-advice",
    tab: "finance",
    icon: Lightbulb,
    title: "Recibe consejos automáticos",
    description:
      "El semáforo financiero te avisa si vas bien, si conviene ajustar gastos o si puedes ahorrar más.",
  },
  {
    selector: "finance-management",
    tab: "finance",
    icon: Target,
    title: "Gestiona ingresos, gastos y metas",
    description:
      "Agrega movimientos, conecta tareas con montos, proyecta el cierre de mes y sigue tus objetivos de ahorro.",
  },
  {
    icon: PartyPopper,
    title: "¡Todo listo! 🚀",
    description:
      "Ya conoces lo esencial. Crea tu primera tarea, registra tus finanzas y organiza tu día con NexToDo.",
  },
];

const PADDING = 8; // halo alrededor del elemento resaltado
const GAP = 14; // separación entre el elemento y el tooltip

function getVisibleTourElement(selector: string): HTMLElement | null {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-tour="${selector}"]`)
  );
  return (
    elements.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }) ?? null
  );
}

export function OnboardingTour() {
  const { isTourOpen, finishTour, requestTourTab } = useOnboarding();
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reiniciar al primer paso cada vez que se abre el tour.
  useEffect(() => {
    if (isTourOpen) setStepIndex(0);
  }, [isTourOpen]);

  const step = STEPS[stepIndex];

  const updatePosition = useCallback(() => {
    const current = STEPS[stepIndex];
    if (!current?.selector) {
      setRect(null);
      return;
    }
    const el = getVisibleTourElement(current.selector);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [stepIndex]);

  useEffect(() => {
    if (!isTourOpen) return;

    const current = STEPS[stepIndex];
    requestTourTab(current?.tab ?? null);

    const scrollToTarget = () => {
      const el = current?.selector ? getVisibleTourElement(current.selector) : null;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    };

    scrollToTarget();
    const scrollTimers = [80, 180, 360].map((delay) => setTimeout(scrollToTarget, delay));

    // Medimos varias veces para captar el cambio de pestaña y el final del scroll suave.
    updatePosition();
    const t1 = setTimeout(updatePosition, 150);
    const t2 = setTimeout(updatePosition, 420);
    const t3 = setTimeout(updatePosition, 700);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      scrollTimers.forEach((timer) => clearTimeout(timer));
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isTourOpen, requestTourTab, stepIndex, updatePosition]);

  // Cerrar con la tecla Escape.
  useEffect(() => {
    if (!isTourOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finishTour();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isTourOpen, finishTour]);

  if (!mounted || !isTourOpen || !step) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (isLast) finishTour();
    else setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const handleBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  // --- Posicionamiento del tooltip ---
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const tipWidth = Math.min(360, vw - 32);

  let tooltipStyle: React.CSSProperties;
  if (rect) {
    const placeBelow = rect.bottom + GAP + 220 < vh;
    const left = Math.min(Math.max(rect.left, 16), vw - tipWidth - 16);
    tooltipStyle = placeBelow
      ? { top: rect.bottom + GAP, left }
      : { top: rect.top - GAP, left, transform: "translateY(-100%)" };
  } else {
    // Paso centrado (sin elemento objetivo).
    tooltipStyle = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Tour guiado">
      {/* Capa oscura: con elemento usamos box-shadow para crear el "foco"; sin él, fondo completo. */}
      {rect ? (
        <div
          className="pointer-events-none fixed rounded-xl ring-2 ring-primary/70 transition-all duration-300 ease-out"
          style={{
            top: rect.top - PADDING,
            left: rect.left - PADDING,
            width: rect.width + PADDING * 2,
            height: rect.height + PADDING * 2,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
          }}
        />
      ) : (
        <div className="pointer-events-none fixed inset-0 bg-black/60 transition-opacity duration-300" />
      )}

      {/* Tooltip */}
      <div
        className={cn(
          "fixed z-[101] w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border bg-popover text-popover-foreground shadow-2xl",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        style={tooltipStyle}
      >
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold leading-tight">{step.title}</h3>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

          {/* Indicador de progreso */}
          <div className="flex items-center gap-1.5 pt-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === stepIndex ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={finishTour}
              className="text-muted-foreground"
            >
              Saltar
            </Button>
            <div className="flex items-center gap-2">
              {!isFirst && (
                <Button variant="outline" size="sm" onClick={handleBack}>
                  Atrás
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {isLast ? "¡Empezar!" : "Siguiente"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
