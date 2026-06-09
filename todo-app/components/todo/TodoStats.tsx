"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { XP_PER_TASK } from "@/context/GamificationContext";
import { useTodo } from "@/context/TodoContext";
import { Todo } from "@/types";
import { Calendar, CheckCircle2, Gauge, LucideIcon, Trophy, Zap } from "lucide-react";
import { useMemo } from "react";

const ONE_DAY = 24 * 60 * 60 * 1000;

function dayStart(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

interface StatTileProps {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
  sub?: string;
}

function StatTile({ icon: Icon, value, label, color, sub }: StatTileProps) {
  return (
    <div className="bg-surface-2 border rounded-xl py-3 px-[13px] flex flex-col gap-1">
      <div className="flex items-center gap-[7px]">
        <Icon className="h-4 w-4 shrink-0" style={{ color }} strokeWidth={1.8} />
        <span className="text-xs text-ink-2 font-semibold">{label}</span>
      </div>
      <span className="font-display text-[26px] text-ink leading-none">{value}</span>
      {sub && <span className="text-[11.5px] text-ink-3">{sub}</span>}
    </div>
  );
}

const HEAT_SHADES = ["var(--surface-3)", "var(--amber-200)", "#FBBF24", "var(--orange)"];
const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function WeekHeat({ week }: { week: number[] }) {
  return (
    <div className="flex gap-1.5 justify-between">
      {week.map((count, i) => (
        <div key={i} className="flex flex-col items-center gap-[5px] flex-1">
          <div
            className="w-full aspect-square rounded-md border"
            title={`${count} ${count === 1 ? "tarea" : "tareas"}`}
            style={{ background: HEAT_SHADES[Math.min(count, 3)] }}
          />
          <span className="font-num text-[11px] text-ink-3">{DAY_LABELS[i]}</span>
        </div>
      ))}
    </div>
  );
}

/** Panel de estadísticas del bento: tiles 2×2 + heatmap de los últimos 7 días. */
export function TodoStats() {
  const { todos } = useTodo();

  const stats = useMemo(() => {
    const today = dayStart(new Date());
    const weekAgo = today - 6 * ONE_DAY;

    // updatedAt de una completada ≈ fecha en que se completó (no hay completedAt).
    const completedAt = (t: Todo) => dayStart(new Date(t.updatedAt));

    const completed = todos.filter((t) => t.completed);
    const doneToday = completed.filter((t) => completedAt(t) === today).length;
    const weekDone = completed.filter((t) => completedAt(t) >= weekAgo).length;
    const completion =
      todos.length > 0 ? Math.round((completed.length / todos.length) * 100) : 0;

    // Mapa de la semana actual (lunes a domingo).
    const now = new Date();
    const mondayOffset = (now.getDay() + 6) % 7; // 0 = lunes
    const monday = today - mondayOffset * ONE_DAY;
    const week = Array.from({ length: 7 }, (_, i) => {
      const day = monday + i * ONE_DAY;
      return completed.filter((t) => completedAt(t) === day).length;
    });

    return { doneToday, xpToday: doneToday * XP_PER_TASK, weekDone, completion, week };
  }, [todos]);

  return (
    <div data-tour="stats">
      <SectionLabel icon={Zap} accent="var(--amber)">
        PROGRESO DE HOY
      </SectionLabel>
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <StatTile
          icon={CheckCircle2}
          value={String(stats.doneToday)}
          label="Hechas hoy"
          color="var(--pos)"
          sub={stats.doneToday > 0 ? "¡Buen ritmo!" : "aún sin completar"}
        />
        <StatTile
          icon={Zap}
          value={`+${stats.xpToday}`}
          label="XP de hoy"
          color="var(--amber)"
          sub="esta jornada"
        />
        <StatTile
          icon={Trophy}
          value={String(stats.weekDone)}
          label="Esta semana"
          color="var(--orange)"
          sub="tareas"
        />
        <StatTile
          icon={Gauge}
          value={`${stats.completion}%`}
          label="Cumplimiento"
          color="var(--pri-baja)"
          sub="del total"
        />
      </div>
      <SectionLabel icon={Calendar}>ÚLTIMOS 7 DÍAS</SectionLabel>
      <WeekHeat week={stats.week} />
    </div>
  );
}
