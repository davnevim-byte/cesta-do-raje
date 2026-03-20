// ============================================================
//  useAnimation — animace přechodů a vizuálních efektů
//  Používá CSS třídy + Framer Motion varianty
//  Centrální místo pro všechny animace v aplikaci
// ============================================================

import { useCallback, useRef, useState } from "react";

// ─────────────────────────────────────────────
//  FRAMER MOTION VARIANTY
//  Import v komponentách: import { VARIANTS } from "../hooks/useAnimation"
// ─────────────────────────────────────────────

export const VARIANTS = {

  // ── Obrazovky ───────────────────────────────
  screenEnter: {
    initial:   { opacity: 0, scale: 0.97 },
    animate:   { opacity: 1, scale: 1 },
    exit:      { opacity: 0, scale: 1.02 },
    transition: { duration: 0.35, ease: "easeInOut" },
  },

  slideUp: {
    initial:   { opacity: 0, y: 40 },
    animate:   { opacity: 1, y: 0 },
    exit:      { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  slideDown: {
    initial:   { opacity: 0, y: -30 },
    animate:   { opacity: 1, y: 0 },
    exit:      { opacity: 0, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  fadeIn: {
    initial:   { opacity: 0 },
    animate:   { opacity: 1 },
    exit:      { opacity: 0 },
    transition: { duration: 0.25 },
  },

  // ── Modaly ──────────────────────────────────
  modalOverlay: {
    initial:   { opacity: 0 },
    animate:   { opacity: 1 },
    exit:      { opacity: 0 },
    transition: { duration: 0.2 },
  },

  modalContent: {
    initial:   { opacity: 0, scale: 0.88, y: 30 },
    animate:   { opacity: 1, scale: 1, y: 0 },
    exit:      { opacity: 0, scale: 0.92, y: 20 },
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }, // spring-like
  },

  // ── Negativní políčko ── dramatické ─────────
  negativeModal: {
    initial:   { opacity: 0, scale: 1.1 },
    animate:   { opacity: 1, scale: 1 },
    exit:      { opacity: 0, scale: 0.95 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // ── Dveře — otevírání ───────────────────────
  doorsModal: {
    initial:   { opacity: 0, rotateY: -15, scale: 0.9 },
    animate:   { opacity: 1, rotateY: 0, scale: 1 },
    exit:      { opacity: 0, rotateY: 15, scale: 0.95 },
    transition: { duration: 0.45, ease: "easeOut" },
  },

  // ── Divoká karta ── whoosh ───────────────────
  wildCardModal: {
    initial:   { opacity: 0, rotate: -5, scale: 0.8 },
    animate:   { opacity: 1, rotate: 0, scale: 1 },
    exit:      { opacity: 0, rotate: 5, scale: 0.85 },
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },

  // ── Figurka hráče na desce ───────────────────
  playerToken: {
    initial:   { scale: 0, opacity: 0 },
    animate:   { scale: 1, opacity: 1 },
    transition: { duration: 0.3, ease: "backOut" },
  },

  tokenMove: {
    transition: { duration: 0.5, ease: "easeInOut" },
  },

  // ── Políčko na desce ─────────────────────────
  tileHover: {
    whileHover: { scale: 1.12, zIndex: 10 },
    transition: { duration: 0.15 },
  },

  tilePulse: {
    animate: {
      scale: [1, 1.08, 1],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    },
  },

  // ── Kostka ───────────────────────────────────
  diceRoll: {
    animate: {
      rotate: [0, 15, -15, 10, -10, 5, -5, 0],
      scale:  [1, 1.1, 0.95, 1.05, 0.98, 1],
    },
    transition: { duration: 0.6, ease: "easeOut" },
  },

  diceIdle: {
    whileHover: { scale: 1.08, rotate: 5 },
    whileTap:   { scale: 0.92 },
    transition: { duration: 0.15 },
  },

  // ── Konfety na konci hry ─────────────────────
  confetti: {
    initial:   { y: -20, opacity: 1, rotate: 0 },
    animate:   { y: "100vh", opacity: 0, rotate: 360 },
    transition: { duration: 2.5, ease: "easeIn" },
  },

  // ── Titul na konci hry ───────────────────────
  titleReveal: {
    initial:   { opacity: 0, y: 20, scale: 0.9 },
    animate:   { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, delay: 0.3, ease: "backOut" },
  },

  // ── Ovoce ducha ─────────────────────────────
  fruitBadge: {
    initial:   { scale: 0, rotate: -20 },
    animate:   { scale: 1, rotate: 0 },
    transition: { duration: 0.3, ease: "backOut" },
  },

  // ── Scoreboard hráče ─────────────────────────
  scoreboardRow: {
    initial:   { opacity: 0, x: -20 },
    animate:   { opacity: 1, x: 0 },
    transition: { duration: 0.25, ease: "easeOut" },
  },

  // ── Přesun do vnitřního kruhu ── velký moment
  innerCircleEntry: {
    initial:   { scale: 0.5, opacity: 0, rotate: -10 },
    animate:   {
      scale: [0.5, 1.2, 1],
      opacity: 1,
      rotate: ["-10deg", "5deg", "0deg"],
    },
    transition: { duration: 0.7, ease: "easeOut" },
  },

  // ── Staggered list ───────────────────────────
  listContainer: {
    animate: { transition: { staggerChildren: 0.07 } },
  },

  listItem: {
    initial:   { opacity: 0, y: 15 },
    animate:   { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  },
};

// ─────────────────────────────────────────────
//  KONFETY HELPER
// ─────────────────────────────────────────────

export const generateConfetti = (count = 60) => {
  const colors = [
    "#1D9E75", "#EF9F27", "#D4537E",
    "#378ADD", "#7F77DD", "#E24B4A",
    "#9FE1CB", "#FAC775",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id:    i,
    x:     Math.random() * 100,        // % šířky obrazovky
    delay: Math.random() * 1.5,        // sekundy
    color: colors[Math.floor(Math.random() * colors.length)],
    size:  6 + Math.random() * 10,     // px
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }));
};

// ─────────────────────────────────────────────
//  FLASH EFFECT — záblesk barvy na celé obrazovce
// ─────────────────────────────────────────────

export const useFlash = () => {
  const [flash, setFlash] = useState(null); // { color, key }

  const triggerFlash = useCallback((color) => {
    setFlash({ color, key: Date.now() });
    setTimeout(() => setFlash(null), 500);
  }, []);

  return { flash, triggerFlash };
};

// ─────────────────────────────────────────────
//  SHAKE EFFECT — animace třesení
// ─────────────────────────────────────────────

export const useShake = () => {
  const [shaking, setShaking] = useState(false);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }, []);

  return { shaking, triggerShake };
};

// ─────────────────────────────────────────────
//  ZOOM IN EFEKT — přiblížení na aktuálního hráče
// ─────────────────────────────────────────────

export const useZoomEffect = () => {
  const [zoomed, setZoomed] = useState(false);
  const [zoomTarget, setZoomTarget] = useState(null);

  const zoomIn = useCallback((target = null) => {
    setZoomTarget(target);
    setZoomed(true);
  }, []);

  const zoomOut = useCallback(() => {
    setZoomed(false);
    setTimeout(() => setZoomTarget(null), 400);
  }, []);

  return { zoomed, zoomTarget, zoomIn, zoomOut };
};

// ─────────────────────────────────────────────
//  HLAVNÍ HOOK
// ─────────────────────────────────────────────

export const useAnimation = () => {
  const { flash, triggerFlash } = useFlash();
  const { shaking, triggerShake } = useShake();
  const { zoomed, zoomTarget, zoomIn, zoomOut } = useZoomEffect();

  // Záblesk podle výsledku
  const flashCorrect  = useCallback(() => triggerFlash("#1D9E75"), [triggerFlash]);
  const flashWrong    = useCallback(() => triggerFlash("#E24B4A"), [triggerFlash]);
  const flashNegative = useCallback(() => triggerFlash("#2C2C2A"), [triggerFlash]);
  const flashDoors    = useCallback(() => triggerFlash("#EF9F27"), [triggerFlash]);
  const flashVictory  = useCallback(() => triggerFlash("#9FE1CB"), [triggerFlash]);

  return {
    VARIANTS,
    generateConfetti,

    // Flash
    flash,
    flashCorrect,
    flashWrong,
    flashNegative,
    flashDoors,
    flashVictory,
    triggerFlash,

    // Shake
    shaking,
    triggerShake,

    // Zoom
    zoomed,
    zoomTarget,
    zoomIn,
    zoomOut,
  };
};
