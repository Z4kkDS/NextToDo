"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { useGamification } from "@/context/GamificationContext";
import { PET_SLOTS } from "@/lib/petCatalog";
import { ChevronRight, PawPrint, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL = PET_SLOTS.length;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Escenario de la mascota activa en el dashboard.
 *
 * El arte es intercambiable: las animaciones se aplican a contenedores
 * (transform), nunca al dibujo, así que el sprite de pixel art real entra
 * luego sin tocar nada. Por ahora un placeholder "demo" para sentir el efecto.
 *
 * - Idle bob continuo (CSS, en el wrapper exterior).
 * - Brinco con squash al completar una tarea — engancha la señal `flash` que
 *   ya emite celebrate(); tu mascota reacciona a tu productividad.
 * - Tap-to-pet: tócala y hace un squash + chispita.
 * Todo respeta prefers-reduced-motion.
 */
export function PetStage({ onOpenStore }: { onOpenStore?: () => void }) {
  const { level, flash } = useGamification();
  const petRef = useRef<HTMLDivElement>(null);
  const [sparkle, setSparkle] = useState(false);
  const owned = 0; // La propiedad de mascotas llegará después.

  const popSparkle = useCallback(() => {
    setSparkle(false);
    // Reinicia la animación en el siguiente frame.
    requestAnimationFrame(() => setSparkle(true));
  }, []);

  const hop = useCallback(() => {
    const el = petRef.current;
    if (!el || reducedMotion()) return;
    el.animate(
      [
        { transform: "translateY(0) scale(1, 1)" },
        { transform: "translateY(0) scale(1.08, 0.92)" },
        { transform: "translateY(-16px) scale(0.96, 1.06)" },
        { transform: "translateY(0) scale(1.04, 0.96)" },
        { transform: "translateY(0) scale(1, 1)" },
      ],
      { duration: 550, easing: "ease-out" }
    );
    popSparkle();
  }, [popSparkle]);

  const petPet = useCallback(() => {
    const el = petRef.current;
    if (!el || reducedMotion()) return;
    el.animate(
      [
        { transform: "scale(1, 1)" },
        { transform: "scale(1.12, 0.88)" },
        { transform: "scale(0.96, 1.05)" },
        { transform: "scale(1, 1)" },
      ],
      { duration: 420, easing: "ease-out" }
    );
    popSparkle();
  }, [popSparkle]);

  // Brinco al completar una tarea (flanco de subida de `flash`).
  const prevFlash = useRef(flash);
  useEffect(() => {
    if (flash && !prevFlash.current) hop();
    prevFlash.current = flash;
  }, [flash, hop]);

  return (
    <div className="flex flex-col h-full">
      <SectionLabel icon={PawPrint} accent="var(--orange)">
        TU MASCOTA
      </SectionLabel>

      {/* Escenario */}
      <div className="relative rounded-xl border bg-surface-2 overflow-hidden h-[150px]">
        {/* Resplandor del suelo */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 50% 100%, var(--brand-soft), transparent 70%)",
          }}
        />

        {/* Chispita */}
        {sparkle && (
          <div className="pet-spark absolute left-1/2 top-4 -translate-x-1/2 text-xp pointer-events-none">
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </div>
        )}

        {/* Mascota (zona táctil) */}
        <button
          type="button"
          onClick={petPet}
          aria-label="Acariciar a tu mascota"
          className="absolute inset-0 grid place-items-end justify-items-center pb-3.5 cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <div className="pet-bob">
              <div ref={petRef}>
                <PetPlaceholder />
              </div>
            </div>
            {/* Sombra (no brinca con la mascota) */}
            <div
              className="w-12 h-2 rounded-[50%] -mt-1"
              style={{ background: "rgba(0,0,0,.14)" }}
            />
          </div>
        </button>
      </div>

      {/* Nombre + CTA de colección */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="min-w-0">
          <div className="font-display text-[15px] text-ink leading-tight truncate">
            Pixel <span className="text-ink-3 text-[11px] font-semibold">· demo</span>
          </div>
          <div className="text-[11.5px] text-ink-3">Nivel {level} · tu compañero</div>
        </div>
        <button
          type="button"
          onClick={onOpenStore}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand-deep dark:text-brand px-3 py-1.5 text-xs font-semibold hover:bg-brand hover:text-primary-foreground transition-colors cursor-pointer shrink-0"
        >
          Colecciona más
          <span className="font-num">
            {owned}/{TOTAL}
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Placeholder temporal de la mascota (contenido intercambiable). Usa colores
 * del tema (var(--brand)) para adaptarse a claro/oscuro. Reemplázalo por tu
 * sprite de pixel art cuando esté listo — las animaciones del escenario se
 * mantienen porque viven en los contenedores, no aquí.
 */
function PetPlaceholder() {
  return (
    <svg viewBox="0 0 48 48" width="72" height="72" className="block" aria-hidden="true">
      {/* orejitas */}
      <circle cx="16" cy="15" r="2.6" fill="var(--brand)" />
      <circle cx="32" cy="15" r="2.6" fill="var(--brand)" />
      {/* cuerpo */}
      <path
        d="M8 30 Q8 14 24 14 Q40 14 40 30 Q40 40 24 40 Q8 40 8 30 Z"
        fill="var(--brand)"
      />
      {/* pancita */}
      <ellipse cx="24" cy="33" rx="9" ry="6" fill="rgba(255,255,255,.22)" />
      {/* ojos */}
      <circle cx="18" cy="26" r="3.3" fill="#fff" />
      <circle cx="30" cy="26" r="3.3" fill="#fff" />
      <circle cx="18.7" cy="26.6" r="1.6" fill="#2b2018" />
      <circle cx="30.7" cy="26.6" r="1.6" fill="#2b2018" />
      {/* sonrisa */}
      <path
        d="M21 31 Q24 34 27 31"
        stroke="#2b2018"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
