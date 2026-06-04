"use client";

import { OnboardingStorage } from "@/lib/onboarding";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

interface OnboardingContextType {
  /** Indica si el tour guiado está activo en pantalla. */
  isTourOpen: boolean;
  /** Inicia (o reinicia) el tour manualmente. */
  startTour: () => void;
  /** Cierra el tour y lo marca como completado para el usuario actual. */
  finishTour: () => void;
  /** True si el usuario ya ha usado algún filtro (para el checklist). */
  filterUsed: boolean;
  /** Marca que el usuario probó un filtro. */
  markFilterUsed: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [filterUsed, setFilterUsed] = useState(false);

  // Sincronizar el estado reactivo con lo almacenado para el usuario actual.
  useEffect(() => {
    if (!user) {
      setFilterUsed(false);
      return;
    }
    setFilterUsed(OnboardingStorage.hasUsedFilter(user.uid));
  }, [user]);

  // Auto-inicio: la primera vez que un usuario autenticado entra y no ha
  // completado el tour, lo lanzamos automáticamente.
  useEffect(() => {
    if (loading || !user) return;
    if (!OnboardingStorage.hasCompletedTour(user.uid)) {
      // Pequeño retardo para que el dashboard termine de montar/animar.
      const timer = setTimeout(() => setIsTourOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const startTour = () => setIsTourOpen(true);

  const finishTour = () => {
    setIsTourOpen(false);
    if (user) {
      OnboardingStorage.markTourCompleted(user.uid);
    }
  };

  const markFilterUsed = () => {
    if (filterUsed) return;
    setFilterUsed(true);
    if (user) {
      OnboardingStorage.markFilterUsed(user.uid);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{ isTourOpen, startTour, finishTour, filterUsed, markFilterUsed }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
