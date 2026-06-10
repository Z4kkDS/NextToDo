/** Rareza de una mascota — define color e importancia en la colección. */
export type PetRarity = "comun" | "raro" | "epico" | "legendario";

/** Condición para obtener una mascota. */
export type PetUnlock =
  | { kind: "level"; level: number } // gratis, se desbloquea al alcanzar el nivel
  | { kind: "paid"; price: number }; // de pago (mock / próximamente)

/**
 * Hueco de mascota en la colección. El pixel art se diseñará más adelante;
 * por ahora cada hueco reserva su sitio con estado "Próximamente".
 * Cuando el avatar esté listo, añade `name` y el sprite/imagen aquí.
 */
export interface PetSlot {
  id: string;
  /** Nombre del avatar — se rellenará al diseñar el pixel art. */
  name?: string;
  rarity: PetRarity;
  unlock: PetUnlock;
}

/** Metadatos visuales de una rareza. */
export interface RarityMeta {
  label: string;
  /** Color principal (badges, bordes). */
  color: string;
  /** Fondo suave translúcido del mismo tono. */
  soft: string;
}
