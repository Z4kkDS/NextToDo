// Utilidades de persistencia para el onboarding interactivo.
// Guardamos el estado por usuario para que el tour solo se muestre la primera vez.

const TOUR_DONE_PREFIX = "nexttodo_tour_done_";
const CHECKLIST_DISMISSED_PREFIX = "nexttodo_checklist_dismissed_";
const FILTER_USED_PREFIX = "nexttodo_filter_used_";

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignorar errores de almacenamiento (modo privado, cuota, etc.)
  }
}

export const OnboardingStorage = {
  hasCompletedTour(uid: string): boolean {
    return safeGet(`${TOUR_DONE_PREFIX}${uid}`) === "true";
  },
  markTourCompleted(uid: string) {
    safeSet(`${TOUR_DONE_PREFIX}${uid}`, "true");
  },
  isChecklistDismissed(uid: string): boolean {
    return safeGet(`${CHECKLIST_DISMISSED_PREFIX}${uid}`) === "true";
  },
  dismissChecklist(uid: string) {
    safeSet(`${CHECKLIST_DISMISSED_PREFIX}${uid}`, "true");
  },
  hasUsedFilter(uid: string): boolean {
    return safeGet(`${FILTER_USED_PREFIX}${uid}`) === "true";
  },
  markFilterUsed(uid: string) {
    safeSet(`${FILTER_USED_PREFIX}${uid}`, "true");
  },
};
