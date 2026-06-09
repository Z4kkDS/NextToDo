"use client";

import { useGamification } from "@/context/GamificationContext";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

/** Chip de racha diaria con icono de fuego. */
export function StreakChip({ className }: { className?: string }) {
  const { streak } = useGamification();

  return (
    <div
      title="Racha diaria"
      className={cn(
        "chip py-1.5 px-[11px] bg-brand-soft border-xp-soft",
        className
      )}
    >
      <Flame className="h-[18px] w-[18px] text-brand" strokeWidth={1.8} />
      <span className="font-display text-base text-brand-deep dark:text-brand">{streak}</span>
      <span className="text-xs font-semibold text-brand-deep dark:text-brand">
        {streak === 1 ? "día" : "días"}
      </span>
    </div>
  );
}
