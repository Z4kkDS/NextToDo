"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { Progress } from "@/components/ui/progress";
import { SectionLabel } from "@/components/ui/section-label";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTodo } from "@/context/TodoContext";
import { OnboardingStorage } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import { Check, HelpCircle, Inbox, X } from "lucide-react";
import { useEffect, useState } from "react";

/** Checklist de bienvenida — tile ancho del bento con pasos y progreso. */
export function WelcomeChecklist() {
  const { user } = useAuth();
  const { todos } = useTodo();
  const { filterUsed, startTour } = useOnboarding();
  const [dismissed, setDismissed] = useState(true);

  // Cargar el estado de "descartado" cuando cambie el usuario.
  useEffect(() => {
    if (!user) {
      setDismissed(true);
      return;
    }
    setDismissed(OnboardingStorage.isChecklistDismissed(user.uid));
  }, [user]);

  if (dismissed || !user) return null;

  const steps = [
    { label: "Crea tu primera tarea", done: todos.length > 0 },
    { label: "Completa una tarea", done: todos.some((t) => t.completed) },
    { label: "Prueba un filtro", done: filterUsed },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  const handleDismiss = () => {
    setDismissed(true);
    OnboardingStorage.dismissChecklist(user.uid);
  };

  return (
    <BentoCard tone="tint" className="rise">
      <div className="flex items-center justify-between mb-3 gap-2">
        <SectionLabel icon={Inbox} accent="var(--pri-baja)" className="mb-0">
          PRIMEROS PASOS
        </SectionLabel>
        <div className="flex items-center gap-2">
          <span className="font-num text-[13px] text-ink-2">
            {completedCount}/{steps.length}
          </span>
          <button
            type="button"
            onClick={startTour}
            title="Ver el tutorial"
            aria-label="Ver el tutorial"
            className="grid place-items-center h-7 w-7 rounded-lg text-ink-3 hover:bg-surface-3 hover:text-ink-2 transition-colors cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Cerrar guía de primeros pasos"
            className="grid place-items-center h-7 w-7 rounded-lg text-ink-3 hover:bg-surface-3 hover:text-ink-2 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-3.5">
        <Progress
          value={(completedCount / steps.length) * 100}
          className="h-2 bg-surface-3 [&>div]:bg-pri-baja"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex items-center gap-[9px] py-2.5 px-[11px] bg-card border rounded-[11px]",
              s.done && "opacity-70"
            )}
          >
            <span
              className={cn(
                "grid place-items-center w-[22px] h-[22px] rounded-[7px] shrink-0 border",
                s.done ? "bg-pos border-pos" : "border-input"
              )}
            >
              {s.done ? (
                <Check className="h-[13px] w-[13px] text-white" strokeWidth={3} />
              ) : (
                <span className="font-num text-[11.5px] text-ink-3">{i + 1}</span>
              )}
            </span>
            <span
              className={cn("text-[13px] text-ink font-medium", s.done && "line-through")}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {allDone && (
        <p className="mt-3 text-[12.5px] text-ink-2">
          ¡Lo dominaste! Ya conoces lo esencial de NexToDo.
        </p>
      )}
    </BentoCard>
  );
}
