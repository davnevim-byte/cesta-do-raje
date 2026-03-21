// ============================================================
//  useDisplaySize — hook pro nastavení velikosti zobrazení
//  Výchozí hodnota dle deviceType ze store
// ============================================================

import { useState, useCallback } from "react";
import { useGameStore } from "../store/gameStore";

const STORAGE_KEY = "cesta-do-raje-display-size";
const MIN_SIZE = 60;
const MAX_SIZE = 160;

// Výchozí velikost dle deviceType
const getDefaultSizeForDevice = (deviceType) => {
  switch (deviceType) {
    case "tv":     return 150;  // TV/Projektor — maximum
    case "tablet": return 100;  // PC/Tablet — střed (layout je jiný)
    case "mobile": return 85;   // Telefon — kompaktní
    default:
      // Fallback dle šířky obrazovky
      const w = window.innerWidth;
      if (w >= 1400) return 130;
      if (w >= 1024) return 110;
      if (w >= 768)  return 90;
      return 80;
  }
};

export const useDisplaySize = () => {
  const deviceType = useGameStore((s) => s.deviceType ?? "mobile");

  const [size, setSize] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved) : getDefaultSizeForDevice(deviceType);
    } catch {
      return getDefaultSizeForDevice(deviceType);
    }
  });

  const saveSize = useCallback((newSize) => {
    setSize(newSize);
    try {
      localStorage.setItem(STORAGE_KEY, String(newSize));
    } catch {}
  }, []);

  return { size, setSize, saveSize, MIN_SIZE, MAX_SIZE };
};
