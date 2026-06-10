"use client";

import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

interface PetWidgetProps {
  /** Abre la sección Mascotas. */
  onOpen: () => void;
  className?: string;
}

/**
 * Hueco de la mascota activa en la barra superior del dashboard. Por ahora
 * muestra un marcador "Próximamente"; al diseñar los avatares aquí se verá
 * la mascota equipada. Clic → abre la tienda de Mascotas.
 */
export function PetWidget({ onOpen, className }: PetWidgetProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title="Mascotas (próximamente)"
      aria-label="Abrir Mascotas"
      className={cn(
        "sprite-slot relative grid place-items-center w-[42px] h-[42px] rounded-xl border text-ink-3 hover:text-brand transition-colors cursor-pointer elev-1 shrink-0",
        className
      )}
    >
      <PawPrint className="h-5 w-5" strokeWidth={1.8} />
      <span
        className="dev-pulse absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-xp border border-card"
        aria-hidden="true"
      />
    </button>
  );
}
