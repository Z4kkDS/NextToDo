import { db } from "@/lib/firebase";
import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";

/**
 * Banco de XP: conserva el XP de tareas completadas que el usuario elimina
 * (limpieza de completadas). XP total = banco + XP de las completadas vivas.
 */

const LOCAL_KEY = "nexToDo_bankedXp";

/** Evento emitido al cambiar el banco local (localStorage no notifica en la misma pestaña). */
export const XP_BANK_EVENT = "nexttodo:xpbank-changed";

/** Banco de XP para usuarios locales (localStorage). */
export class LocalXpBank {
  static get(userId: string): number {
    try {
      const raw = localStorage.getItem(`${LOCAL_KEY}_${userId}`);
      const n = raw ? Number(raw) : 0;
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    } catch {
      return 0;
    }
  }

  static add(userId: string, amount: number): void {
    try {
      localStorage.setItem(`${LOCAL_KEY}_${userId}`, String(this.get(userId) + amount));
      window.dispatchEvent(new Event(XP_BANK_EVENT));
    } catch (error) {
      console.error("Error saving banked XP:", error);
    }
  }

  static clear(userId: string): void {
    localStorage.removeItem(`${LOCAL_KEY}_${userId}`);
  }
}

const STATS_COLLECTION = "userStats";

/** Banco de XP para usuarios de Firebase — documento userStats/{userId}. */
export class XpBankService {
  static subscribe(userId: string, callback: (bankedXp: number) => void): () => void {
    return onSnapshot(
      doc(db, STATS_COLLECTION, userId),
      (snap) => {
        const value = snap.data()?.bankedXp;
        callback(typeof value === "number" && value > 0 ? Math.floor(value) : 0);
      },
      (error) => console.error("Error subscribing to banked XP:", error)
    );
  }

  static async add(userId: string, amount: number): Promise<void> {
    await setDoc(
      doc(db, STATS_COLLECTION, userId),
      { userId, bankedXp: increment(amount) },
      { merge: true }
    );
  }
}
