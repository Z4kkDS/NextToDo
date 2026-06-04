"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTodo } from "@/context/TodoContext";
import { OnboardingStorage } from "@/lib/onboarding";
import { cn } from "@/lib/utils";
import { Check, PartyPopper, Rocket, X } from "lucide-react";
import { useEffect, useState } from "react";

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
    {
      label: "Crea tu primera tarea",
      done: todos.length > 0,
    },
    {
      label: "Completa una tarea",
      done: todos.some((t) => t.completed),
    },
    {
      label: "Prueba un filtro",
      done: filterUsed,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  const handleDismiss = () => {
    setDismissed(true);
    OnboardingStorage.dismissChecklist(user.uid);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            {allDone ? (
              <PartyPopper className="h-5 w-5 text-primary" />
            ) : (
              <Rocket className="h-5 w-5 text-primary" />
            )}
            <div>
              <h3 className="font-semibold leading-tight">
                {allDone ? "¡Lo dominaste! 🎉" : "Primeros pasos"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {allDone
                  ? "Ya conoces lo esencial de NexToDo."
                  : `${completedCount} de ${steps.length} completados`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-7 w-7 shrink-0 p-0 text-muted-foreground"
            aria-label="Cerrar guía de primeros pasos"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ul className="mt-4 space-y-2">
          {steps.map((s) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  s.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {s.done && <Check className="h-3 w-3" />}
              </span>
              <span className={cn(s.done && "text-muted-foreground line-through")}>{s.label}</span>
            </li>
          ))}
        </ul>

        {allDone ? (
          <Button size="sm" className="mt-4 w-full" onClick={handleDismiss}>
            ¡Genial, gracias!
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={startTour}
          >
            Ver el tutorial de nuevo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
