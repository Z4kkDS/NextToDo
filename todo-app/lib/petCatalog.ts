import type { PetRarity, PetSlot, RarityMeta } from "@/types/pet";

/**
 * Catálogo de la tienda de mascotas. De momento son huecos reservados
 * ("Próximamente"); al diseñar el pixel art se completa cada uno con su
 * avatar y, si aplica, se activa la compra/desbloqueo.
 */
export const RARITY: Record<PetRarity, RarityMeta> = {
  comun: { label: "Común", color: "#9a9085", soft: "rgba(154,144,133,.16)" },
  raro: { label: "Raro", color: "#2da8a0", soft: "rgba(45,168,160,.16)" },
  epico: { label: "Épico", color: "#7c5cff", soft: "rgba(124,92,255,.18)" },
  legendario: { label: "Legendario", color: "#f59e0b", soft: "rgba(245,158,11,.18)" },
};

/** Orden de menor a mayor rareza (para agrupar la cuadrícula). */
export const RARITY_ORDER: PetRarity[] = ["comun", "raro", "epico", "legendario"];

/**
 * Huecos de la colección. Los gratuitos se desbloquean subiendo de nivel
 * (los primeros niveles son más fáciles); los de pago llegarán después.
 */
export const PET_SLOTS: PetSlot[] = [
  { id: "comun-1", rarity: "comun", unlock: { kind: "level", level: 1 } },
  { id: "comun-2", rarity: "comun", unlock: { kind: "level", level: 2 } },
  { id: "comun-3", rarity: "comun", unlock: { kind: "level", level: 3 } },
  { id: "comun-4", rarity: "comun", unlock: { kind: "level", level: 4 } },
  { id: "comun-5", rarity: "comun", unlock: { kind: "level", level: 5 } },

  { id: "raro-1", rarity: "raro", unlock: { kind: "level", level: 7 } },
  { id: "raro-2", rarity: "raro", unlock: { kind: "level", level: 9 } },
  { id: "raro-3", rarity: "raro", unlock: { kind: "level", level: 11 } },

  { id: "epico-1", rarity: "epico", unlock: { kind: "level", level: 14 } },
  { id: "epico-2", rarity: "epico", unlock: { kind: "paid", price: 3000 } },

  { id: "legendario-1", rarity: "legendario", unlock: { kind: "paid", price: 6000 } },
  { id: "legendario-2", rarity: "legendario", unlock: { kind: "paid", price: 9000 } },
];

/** Total de mascotas gratuitas (desbloqueables por nivel). */
export const FREE_PET_COUNT = PET_SLOTS.filter((s) => s.unlock.kind === "level").length;

/** ¿El usuario alcanzó el nivel para desbloquear este hueco gratuito? */
export function isLevelReached(slot: PetSlot, level: number): boolean {
  return slot.unlock.kind === "level" && level >= slot.unlock.level;
}
