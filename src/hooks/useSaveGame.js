// ============================================================
//  useSaveGame — uložení a obnova rozehrané hry
//  Zustand persist se stará o automatické ukládání.
//  Tento hook přidává:
//    - detekci uložené hry při načtení
//    - možnost smazat uloženou hru
//    - informaci o době posledního uložení
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

const SAVE_KEY = "cesta-do-raje-game"; // musí odpovídat persist name v store

export const useSaveGame = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const players   = useGameStore((s) => s.players) ?? [];
  const [savedAt, setSavedAt] = useState(null);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // ── Detekuj uloženou hru ──────────────────
  useEffect(() => {
    try {
      const raw  = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      const state = data?.state;

      if (
        state?.gamePhase === "playing" &&
        Array.isArray(state?.players) &&
        state.players.length > 0
      ) {
        setHasSavedGame(true);
        // Zjisti kdy bylo naposledy uloženo (Zustand to neukládá — použijeme vlastní timestamp)
        const ts = localStorage.getItem(`${SAVE_KEY}-timestamp`);
        if (ts) setSavedAt(new Date(parseInt(ts)));
      } else {
        setHasSavedGame(false);
      }
    } catch {
      setHasSavedGame(false);
    }
  }, [gamePhase]);

  // ── Aktualizuj timestamp při každé změně hry ──
  useEffect(() => {
    if (gamePhase === "playing") {
      localStorage.setItem(`${SAVE_KEY}-timestamp`, Date.now().toString());
      setSavedAt(new Date());
    }
  }, [gamePhase, players]);

  // ── Smaž uloženou hru ─────────────────────
  const clearSavedGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(`${SAVE_KEY}-timestamp`);
    setHasSavedGame(false);
    setSavedAt(null);
  }, []);

  // ── Formátovaný čas uložení ───────────────
  const savedAtFormatted = savedAt
    ? savedAt.toLocaleString("cs-CZ", {
        day:    "2-digit",
        month:  "2-digit",
        hour:   "2-digit",
        minute: "2-digit",
      })
    : null;

  // ── Jména uložených hráčů ─────────────────
  const getSavedPlayerNames = useCallback(() => {
    try {
      const raw   = localStorage.getItem(SAVE_KEY);
      if (!raw) return [];
      const data  = JSON.parse(raw);
      return data?.state?.players?.map((p) => p.name) ?? [];
    } catch {
      return [];
    }
  }, []);

  return {
    hasSavedGame,
    savedAt,
    savedAtFormatted,
    clearSavedGame,
    getSavedPlayerNames,
  };
};
