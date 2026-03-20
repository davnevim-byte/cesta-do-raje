// ============================================================
//  useDisplaySize — hook pro nastavení velikosti zobrazení
//  Ukládá do localStorage, výchozí hodnota dle šířky obrazovky
// ============================================================

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "cesta-do-raje-display-size";
const MIN_SIZE = 60;
const MAX_SIZE = 160;

// Výchozí velikost dle šířky obrazovky
const getDefaultSize = () => {
  const w = window.innerWidth;
  if (w >= 1400) return 130;  // velký PC
  if (w >= 1024) return 110;  // PC
  if (w >= 768)  return 90;   // tablet
  return 75;                   // telefon
};

export const useDisplaySize = () => {
  const [size, setSize] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved) : getDefaultSize();
    } catch {
      return getDefaultSize();
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
