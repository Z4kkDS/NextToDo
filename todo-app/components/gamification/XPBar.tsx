"use client";

import { useGamification } from "@/context/GamificationContext";
import { cn } from "@/lib/utils";

interface XPBarProps {
  compact?: boolean;
  className?: string;
}

/** Barra de XP con insignia de nivel — cabecera gamificada del dashboard. */
export function XPBar({ compact = false, className }: XPBarProps) {
  const { level, xp, xpMax, flash } = useGamification();
  const pct = Math.min(100, (xp / xpMax) * 100);

  return (
    <div className={cn("flex items-center gap-2.5", className)} data-tour="xp-bar">
      {/* Insignia de nivel */}
      <div
        title={`Nivel ${level}`}
        className={cn(
          "font-display grid place-items-center shrink-0 rounded-[11px] bg-brand text-primary-foreground border border-brand-deep elev-primary leading-none",
          compact ? "w-[34px] h-[34px] text-base" : "w-10 h-10 text-[19px]"
        )}
      >
        {level}
      </div>

      <div className={cn("flex-1", compact ? "min-w-[90px]" : "min-w-[120px]")}>
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-display text-xs text-ink-2 tracking-[.5px]">
            NIVEL {level}
          </span>
          <span className="font-num text-[12.5px] text-xp">
            {xp}/{xpMax} XP
          </span>
        </div>
        <div
          className={cn(
            "h-[11px] rounded-full overflow-hidden border bg-surface-3",
            flash && "xp-flash"
          )}
        >
          <div
            className="h-full rounded-full transition-[width] duration-600"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#F59E0B,#FBBF24)",
              boxShadow: flash ? "0 0 12px 2px rgba(245,158,11,.7)" : "none",
              transitionTimingFunction: "cubic-bezier(.34,1.3,.5,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
