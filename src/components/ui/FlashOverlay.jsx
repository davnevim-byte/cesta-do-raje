// ============================================================
//  FlashOverlay — záblesk obrazovky při akcích
//  Červený = negativní, zlatý = dveře, zelený = výhra
// ============================================================

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";

export const FlashOverlay = () => {
  const showTileAction   = useGameStore((s) => s.showTileAction);
  const currentTileAction= useGameStore((s) => s.currentTileAction);
  const showWitnessing   = useGameStore((s) => s.showWitnessing);
  const gamePhase        = useGameStore((s) => s.gamePhase);

  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (showTileAction && currentTileAction) {
      const type = currentTileAction.tile?.type;
      if (type === "negative") setFlash({ color: "rgba(192,57,43,0.18)", dur: 0.5 });
      else if (type === "special") setFlash({ color: "rgba(41,128,185,0.12)", dur: 0.4 });
      else if (type === "study" || type === "prayer")
        setFlash({ color: "rgba(29,158,117,0.1)", dur: 0.4 });
      setTimeout(() => setFlash(null), 600);
    }
  }, [showTileAction]);

  useEffect(() => {
    if (showWitnessing) {
      setFlash({ color: "rgba(212,172,13,0.2)", dur: 0.6 });
      setTimeout(() => setFlash(null), 700);
    }
  }, [showWitnessing]);

  useEffect(() => {
    if (gamePhase === "ended") {
      setFlash({ color: "rgba(29,158,117,0.3)", dur: 1.2 });
      setTimeout(() => setFlash(null), 1400);
    }
  }, [gamePhase]);

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key={Date.now()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: flash.dur }}
          style={{
            position:      "fixed",
            inset:         0,
            background:    flash.color,
            pointerEvents: "none",
            zIndex:        999,
          }}
        />
      )}
    </AnimatePresence>
  );
};

// ============================================================
//  FruitBadge — SVG odznak ovoce ducha
//  Animovaně se objeví při získání
// ============================================================

const FRUIT_ICONS = {
  láska:        { emoji: "❤️", color: "#D4537E", path: "M28 22 C28 16 22 12 16 16 C10 20 10 28 16 34 L28 44 L40 34 C46 28 46 20 40 16 C34 12 28 16 28 22Z" },
  radost:       { emoji: "🌟", color: "#EF9F27", path: "M28 10 L31 21 L42 21 L33 28 L36 39 L28 32 L20 39 L23 28 L14 21 L25 21Z" },
  pokoj:        { emoji: "🕊️", color: "#1D9E75", path: "M28 14 C22 14 18 18 18 22 C18 26 20 28 24 30 L24 38 L28 36 L32 38 L32 30 C36 28 38 26 38 22 C38 18 34 14 28 14Z" },
  trpělivost:   { emoji: "⏳", color: "#7F77DD", path: "M18 10 L38 10 L38 16 L30 24 L38 32 L38 38 L18 38 L18 32 L26 24 L18 16Z" },
  laskavost:    { emoji: "🤲", color: "#378ADD", path: "M20 30 L16 22 C16 20 18 18 20 20 L24 26 M28 30 L28 18 C28 16 30 14 32 16 L32 28 M24 30 L22 20 C22 18 24 16 26 18 L26 28 M36 30 L34 20 C34 18 36 16 38 18 L38 26" },
  dobrota:      { emoji: "🌟", color: "#639922", path: "M28 12 C22 12 14 20 14 28 C14 36 22 44 28 44 C34 44 42 36 42 28 C42 20 34 12 28 12Z" },
  víra:         { emoji: "🙏", color: "#185FA5", path: "M28 10 L28 44 M14 24 L42 24" },
  mírnost:      { emoji: "🍃", color: "#0F6E56", path: "M28 40 C28 40 14 30 14 20 C14 14 20 10 28 14 C36 10 42 14 42 20 C42 30 28 40 28 40Z" },
  sebeovládání: { emoji: "💪", color: "#854F0B", path: "M18 28 C18 22 22 16 28 16 C34 16 38 22 38 28 L38 34 C38 36 36 38 34 38 L22 38 C20 38 18 36 18 34Z" },
};

export const FruitBadge = ({ fruitKey, show = true, size = 48 }) => {
  const fruit = FRUIT_ICONS[fruitKey];
  if (!fruit) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          style={{
            width:          size, height: size,
            borderRadius:   "50%",
            background:     `${fruit.color}20`,
            border:         `2px solid ${fruit.color}`,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       size * 0.42,
            flexShrink:     0,
          }}
        >
          {fruit.emoji}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Popup který se krátce zobrazí při získání ovoce
export const FruitEarnedPopup = ({ fruitKey, onDone }) => {
  const fruit = FRUIT_ICONS[fruitKey];
  if (!fruit) return null;

  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        position:       "fixed",
        bottom:         80,
        left:           "50%",
        transform:      "translateX(-50%)",
        zIndex:         500,
        display:        "flex",
        alignItems:     "center",
        gap:            10,
        padding:        "10px 20px",
        background:     "rgba(6,8,16,0.95)",
        border:         `1.5px solid ${fruit.color}`,
        borderRadius:   30,
        pointerEvents:  "none",
      }}
    >
      <span style={{ fontSize: 22 }}>{fruit.emoji}</span>
      <div>
        <div style={{ fontSize: 12, color: fruit.color, fontWeight: 700 }}>
          Získáno ovoce ducha!
        </div>
        <div style={{ fontSize: 11, color: "#888" }}>
          {fruitKey.charAt(0).toUpperCase() + fruitKey.slice(1)}
        </div>
      </div>
    </motion.div>
  );
};
