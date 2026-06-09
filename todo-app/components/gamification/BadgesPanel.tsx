"use client";

import { useGamification } from "@/context/GamificationContext";
import { useTodo } from "@/context/TodoContext";
import { cn } from "@/lib/utils";
import { Flame, LucideIcon, Medal, Sparkles, Star, Trophy } from "lucide-react";
import { useMemo } from "react";

interface BadgeDef {
  id: string;
  name: string;
  icon: LucideIcon;
  got: boolean;
}

function BadgeTile({ badge }: { badge: BadgeDef }) {
  const { icon: Icon } = badge;
  return (
    <div
      title={badge.name}
      className={cn(
        "flex flex-col items-center gap-1.5 flex-1",
        !badge.got && "opacity-40"
      )}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-xl grid place-items-center border",
          badge.got ? "bg-xp-soft border-xp elev-1" : "bg-surface-3"
        )}
      >
        <Icon
          className={cn("h-6 w-6", badge.got ? "text-brand-deep dark:text-brand" : "text-ink-3")}
          strokeWidth={1.6}
        />
      </div>
      <span className="text-[10.5px] text-ink-2 text-center font-semibold leading-tight">
        {badge.name}
      </span>
    </div>
  );
}

/** Insignias de logros — se desbloquean con el progreso real del usuario. */
export function BadgesPanel() {
  const { todos } = useTodo();
  const { level, streak } = useGamification();

  const badges = useMemo<BadgeDef[]>(() => {
    const completed = todos.filter((t) => t.completed).length;
    const pending = todos.length - completed;
    return [
      { id: "first", name: "Primera tarea", icon: Sparkles, got: completed >= 1 },
      { id: "streak3", name: "Racha 3 días", icon: Flame, got: streak >= 3 },
      { id: "ten", name: "10 hechas", icon: Medal, got: completed >= 10 },
      { id: "level2", name: "Nivel 2", icon: Star, got: level >= 2 },
      { id: "clear", name: "Todo al día", icon: Trophy, got: todos.length > 0 && pending === 0 },
    ];
  }, [todos, level, streak]);

  return (
    <div className="flex gap-2">
      {badges.map((b) => (
        <BadgeTile key={b.id} badge={b} />
      ))}
    </div>
  );
}
