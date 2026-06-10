"use client";

import { RARITY } from "@/lib/petCatalog";
import type { PetSlot } from "@/types/pet";
import { Check, Coins, Lock, PawPrint } from "lucide-react";

interface PetSlotCardProps {
  slot: PetSlot;
  /** Nivel actual del usuario, para previsualizar el desbloqueo por nivel. */
  level: number;
}

/**
 * Tarjeta-hueco de la tienda de mascotas. Reserva el sitio del avatar
 * (aún en diseño) con un marcador "Próximamente" y muestra cómo se obtendrá:
 * gratis al subir de nivel o de pago.
 */
export function PetSlotCard({ slot, level }: PetSlotCardProps) {
  const r = RARITY[slot.rarity];
  const isPaid = slot.unlock.kind === "paid";
  const reached = slot.unlock.kind === "level" && level >= slot.unlock.level;

  return (
    <div
      className="rounded-2xl border bg-card elev-1 p-3 flex flex-col items-center gap-2.5"
      style={{ borderColor: `${r.color}33` }}
    >
      {/* Hueco del avatar — en desarrollo */}
      <div
        className="sprite-slot relative w-full aspect-square rounded-xl border-2 border-dashed grid place-items-center overflow-hidden"
        style={{ borderColor: `${r.color}66` }}
      >
        <PawPrint
          className="h-8 w-8"
          style={{ color: r.color, opacity: 0.45 }}
          strokeWidth={1.6}
        />
        <span
          className="dev-pulse absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-display uppercase tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap"
          style={{ background: r.soft, color: r.color }}
        >
          Próximamente
        </span>
      </div>

      {/* Rareza */}
      <span
        className="text-[11px] font-display uppercase tracking-wide px-2 py-0.5 rounded-full"
        style={{ background: r.soft, color: r.color }}
      >
        {r.label}
      </span>

      {/* Cómo se obtiene */}
      <div className="flex items-center gap-1 text-[11.5px] font-semibold">
        {isPaid ? (
          <span className="flex items-center gap-1 text-xp">
            <Coins className="h-3.5 w-3.5" /> De pago
          </span>
        ) : reached ? (
          <span className="flex items-center gap-1 text-pos">
            <Check className="h-3.5 w-3.5" /> Nivel {slot.unlock.kind === "level" && slot.unlock.level}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-ink-3">
            <Lock className="h-3.5 w-3.5" /> Nivel {slot.unlock.kind === "level" && slot.unlock.level}
          </span>
        )}
      </div>
    </div>
  );
}
