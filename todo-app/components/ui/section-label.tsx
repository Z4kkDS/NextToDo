import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionLabelProps {
  icon?: LucideIcon;
  /** Color CSS para el icono (ej. "var(--amber)"). */
  accent?: string;
  className?: string;
  children: React.ReactNode;
}

/** Etiqueta de sección del bento — icono + texto corto en mayúsculas. */
export function SectionLabel({ icon: Icon, accent, className, children }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2 mb-3", className)}>
      {Icon && (
        <Icon
          className="h-4 w-4 shrink-0"
          style={{ color: accent ?? "var(--ink-2)" }}
          strokeWidth={1.8}
        />
      )}
      <span className="font-display text-[15px] text-ink-2 tracking-[.5px] whitespace-nowrap">
        {children}
      </span>
    </div>
  );
}
