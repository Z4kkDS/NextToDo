"use client";

import { BadgesPanel } from "@/components/gamification/BadgesPanel";
import { PetStage } from "@/components/mascotas/PetStage";
import { WelcomeChecklist } from "@/components/onboarding/WelcomeChecklist";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoFilter } from "@/components/todo/TodoFilter";
import { TodoList } from "@/components/todo/TodoList";
import { StatsSkeleton, TodoListSkeleton } from "@/components/todo/TodoSkeleton";
import { TodoStats } from "@/components/todo/TodoStats";
import { TodoToolbar } from "@/components/todo/TodoToolbar";
import { BentoCard } from "@/components/ui/bento-card";
import { SectionLabel } from "@/components/ui/section-label";
import { useTodo } from "@/context/TodoContext";
import { ListChecks, Medal } from "lucide-react";
import { useState } from "react";

interface TasksViewProps {
  createOpen?: boolean;
  onCreateOpenChange?: (open: boolean) => void;
  /** Abre la sección Mascotas (CTA "Colecciona más"). */
  onOpenStore?: () => void;
}

/** Vista de Tareas — bento grid: lista (7 col) + mascota/stats/insignias (5 col) + primeros pasos (12 col). */
export function TasksView({
  createOpen: controlledOpen,
  onCreateOpenChange,
  onOpenStore,
}: TasksViewProps = {}) {
  const { loading: todosLoading } = useTodo();
  const [internalOpen, setInternalOpen] = useState(false);
  const createOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setCreateOpen = onCreateOpenChange ?? setInternalOpen;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Lista de tareas — tile grande */}
      <BentoCard className="rise lg:col-span-7 lg:row-span-3 flex flex-col min-h-0">
        <div className="flex items-center justify-between gap-2.5 mb-3 flex-wrap">
          <div className="flex items-center gap-[9px]">
            <ListChecks className="h-[18px] w-[18px] text-brand" strokeWidth={1.8} />
            <span className="font-display text-[17px] text-ink whitespace-nowrap">
              Tareas de hoy
            </span>
          </div>
          <CreateTodoDialog open={createOpen} onOpenChange={setCreateOpen} />
        </div>

        {todosLoading ? (
          <TodoListSkeleton count={3} />
        ) : (
          <div className="space-y-3.5">
            <TodoFilter />
            <TodoToolbar />
            <TodoList onCreateClick={() => setCreateOpen(true)} />
          </div>
        )}
      </BentoCard>

      {/* Mascota activa — escenario animado */}
      <BentoCard className="rise lg:col-span-5">
        <PetStage onOpenStore={onOpenStore} />
      </BentoCard>

      {/* Panel de estadísticas */}
      <BentoCard className="rise lg:col-span-5">
        {todosLoading ? <StatsSkeleton /> : <TodoStats />}
      </BentoCard>

      {/* Insignias */}
      <BentoCard className="rise lg:col-span-5">
        <SectionLabel icon={Medal} accent="var(--orange)">
          INSIGNIAS
        </SectionLabel>
        <BadgesPanel />
      </BentoCard>

      {/* Primeros pasos — ancho completo */}
      <div className="lg:col-span-12">
        <WelcomeChecklist />
      </div>
    </div>
  );
}
