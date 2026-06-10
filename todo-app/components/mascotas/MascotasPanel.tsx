"use client";

import { BentoCard } from "@/components/ui/bento-card";
import { SectionLabel } from "@/components/ui/section-label";
import { useGamification } from "@/context/GamificationContext";
import { FREE_PET_COUNT, PET_SLOTS, RARITY, RARITY_ORDER } from "@/lib/petCatalog";
import type { PetRarity } from "@/types/pet";
import { Crown, Hammer, PawPrint, Sparkles, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PetSlotCard } from "./PetSlotCard";

const RARITY_ICON: Record<PetRarity, LucideIcon> = {
  comun: PawPrint,
  raro: Star,
  epico: Sparkles,
  legendario: Crown,
};

/**
 * Tienda/colección de mascotas. De momento muestra los huecos reservados
 * con estado "Próximamente": el pixel art y la compra/desbloqueo se activarán
 * más adelante. La estructura ya refleja la mecánica (gratis por nivel / de pago).
 */
export function MascotasPanel() {
  const { level } = useGamification();

  return (
    <div className="space-y-5">
      {/* Intro + aviso de desarrollo */}
      <BentoCard tone="tint" className="flex items-start gap-3.5">
        <div className="font-display grid place-items-center w-11 h-11 shrink-0 bg-brand text-primary-foreground rounded-xl border border-brand-deep elev-primary">
          <PawPrint className="h-[22px] w-[22px]" strokeWidth={1.9} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-display text-xl text-ink leading-none">Mascotas</h2>
            <span className="dev-pulse inline-flex items-center gap-1 text-[11px] font-display uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-soft text-brand-deep dark:text-brand">
              <Hammer className="h-3 w-3" /> En desarrollo
            </span>
          </div>
          <p className="text-[13px] text-ink-2 leading-relaxed">
            Colecciona avatares y luce el tuyo en el panel. Algunos se desbloquean{" "}
            <span className="font-semibold text-ink">gratis subiendo de nivel</span> y otros
            serán de pago. Los animalitos están en diseño — aquí verás su sitio reservado.
            Vas por el <span className="font-semibold text-ink">Nivel {level}</span>.
          </p>
        </div>
      </BentoCard>

      {/* Progreso de colección (placeholder) */}
      <BentoCard className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-xp shrink-0" strokeWidth={1.8} />
          <div>
            <div className="font-display text-[15px] text-ink leading-tight">Tu colección</div>
            <div className="text-[12px] text-ink-3">Desbloquea {FREE_PET_COUNT} gratis subiendo de nivel</div>
          </div>
        </div>
        <div className="font-num text-xl text-ink-3 shrink-0">0/{PET_SLOTS.length}</div>
      </BentoCard>

      {/* Cuadrícula agrupada por rareza */}
      {RARITY_ORDER.map((rarity) => {
        const slots = PET_SLOTS.filter((s) => s.rarity === rarity);
        if (slots.length === 0) return null;
        return (
          <div key={rarity}>
            <SectionLabel icon={RARITY_ICON[rarity]} accent={RARITY[rarity].color}>
              {RARITY[rarity].label.toUpperCase()}
            </SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {slots.map((slot) => (
                <PetSlotCard key={slot.id} slot={slot} level={level} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
