"use client";

import { useGamification } from "@/context/GamificationContext";
import { Check } from "lucide-react";

/**
 * Toast de celebración "+XP" al completar una tarea.
 *
 * - Vive en una capa fija a viewport con overflow hidden, así el sobre-rebote
 *   de la animación nunca agranda el área de scroll (sin rebote vertical).
 * - role="status" + aria-live lo anuncian a lectores de pantalla con una
 *   frase limpia; los elementos visuales internos van aria-hidden.
 */
export function XPToast() {
  const { toastVisible, lastEarnedXp } = useGamification();

  if (!toastVisible) return null;

  return (
    <div className="fixed inset-0 z-150 pointer-events-none overflow-hidden">
      <div className="absolute top-[18px] left-1/2 -translate-x-1/2">
        <div
          className="pix-pop flex items-center gap-3 rounded-[14px] py-[11px] pl-3 pr-4"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`Tarea completada. Ganaste ${lastEarnedXp} puntos de experiencia.`}
          style={{
            background: "linear-gradient(90deg,#F08C00,#FBBF24)",
            color: "#2A1B04",
            border: "1px solid #B66E04",
            boxShadow: "0 12px 30px -10px rgba(234,99,6,.5)",
          }}
        >
          <span
            aria-hidden="true"
            className="grid place-items-center w-[30px] h-[30px] shrink-0 rounded-[9px]"
            style={{ background: "rgba(42,27,4,.15)" }}
          >
            <Check className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </span>
          <span aria-hidden="true" className="text-[15px] font-bold tracking-[-0.01em]">
            ¡Tarea completada!
          </span>
          <span
            aria-hidden="true"
            className="font-display text-[15px] py-[3px] px-[9px] rounded-lg leading-none whitespace-nowrap"
            style={{ background: "rgba(42,27,4,.16)" }}
          >
            +{lastEarnedXp} XP
          </span>
        </div>
      </div>
    </div>
  );
}
