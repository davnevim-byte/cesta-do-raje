// ============================================================
//  DiceRoller — animovaná kostka
//  CSS 3D efekt + Framer Motion animace
//  Integrovaná s gameStore
// ============================================================

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

// ── Tečky na kostce ────────────────────────────────────────

const DOTS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
};

const DieFace = ({ value, size = 64, active, rolling }) => {
  const dots = DOTS[value] ?? DOTS[1];
  const dotSize = size * 0.12;

  return (
    <motion.div
      style={{
        width:        size,
        height:       size,
        borderRadius: size * 0.16,
        background:   active ? "#1D2A1E" : "#111318",
        border:       `2px solid ${active ? "#1D9E75" : "#333"}`,
        position:     "relative",
        overflow:     "hidden",
        flexShrink:   0,
      }}
      animate={rolling ? {
        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        scale:  [1, 1.08, 0.95, 1.05, 0.98, 1],
      } : {}}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {/* Světelný odraz */}
      <div style={{
        position: "absolute",
        top: 0, left: 0,
        right: 0,
        height: "35%",
        background: "rgba(255,255,255,0.04)",
        borderRadius: `${size * 0.16}px ${size * 0.16}px 0 0`,
      }} />

      {/* Tečky */}
      <svg
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {dots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx} cy={cy}
            r={dotSize * (100 / size)}
            fill={active ? "#9FE1CB" : "#5F5E5A"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.2, ease: "backOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

// ── Hlavní komponenta ──────────────────────────────────────

const DiceRoller = () => {
  const diceRoll           = useGameStore((s) => s.diceRoll);
  const isRolling          = useGameStore((s) => s.isRolling);
  const rollDice           = useGameStore((s) => s.rollDice);
  const confirmMove        = useGameStore((s) => s.confirmMove);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const players            = useGameStore((s) => s.players);
  const gamePhase          = useGameStore((s) => s.gamePhase);
  const isModalOpen        = useGameStore((s) => s.isModalOpen);
  const { sounds }         = useSound();

  const [localRolling, setLocalRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState(1);

  const currentPlayer = players[currentPlayerIndex];
  const canRoll       = gamePhase === "playing" && diceRoll === null && !isModalOpen();
  const willSkip      = currentPlayer?.skipTurnsRemaining > 0;

  // Animace hodu — rychlé přeskakování čísel pak finální hodnota
  const handleRoll = useCallback(() => {
    if (!canRoll) return;
    sounds.dice();
    setLocalRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 8) {
        clearInterval(interval);
        rollDice();
        setLocalRolling(false);
      }
    }, 70);
  }, [canRoll, rollDice, sounds]);

  const handleConfirm = useCallback(() => {
    if (diceRoll === null) return;
    sounds.move();
    confirmMove();
  }, [diceRoll, confirmMove, sounds]);

  const shownValue = isRolling || localRolling ? displayValue : (diceRoll ?? displayValue);

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            16,
      padding:        "16px 0 8px",
    }}>

      {/* Jméno aktuálního hráče */}
      {currentPlayer && (
        <motion.div
          key={currentPlayerIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            10,
            padding:        "8px 20px",
            background:     "rgba(29,158,117,0.1)",
            border:         "1px solid #1D9E75",
            borderRadius:   30,
          }}
        >
          <div style={{
            width:        28, height: 28,
            borderRadius: "50%",
            background:   "#1D9E75",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            fontSize:     11, fontWeight: 700, color: "#fff",
          }}>
            {currentPlayer.name?.slice(0, 2).toUpperCase()}
          </div>
          <span style={{ color: "#9FE1CB", fontWeight: 500, fontSize: 15 }}>
            {currentPlayer.name}
          </span>
          <span style={{
            fontSize: 11,
            color: "#5DCAA5",
            background: "rgba(29,158,117,0.15)",
            padding: "2px 8px",
            borderRadius: 10,
          }}>
            {currentPlayer.circle === "inner" ? "Sbor" : "Svět"}
            {" · "}políčko {currentPlayer.position + 1}
          </span>
        </motion.div>
      )}

      {/* Přeskočení tahu */}
      {willSkip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            padding:      "8px 16px",
            background:   "rgba(226,75,74,0.1)",
            border:       "1px solid #E24B4A",
            borderRadius: 8,
            fontSize:     13,
            color:        "#E24B4A",
            textAlign:    "center",
          }}
        >
          ⏭ {currentPlayer?.name} přeskakuje tento tah
        </motion.div>
      )}

      {/* Kostka + tlačítka */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>

        {/* Kostka */}
        <motion.div
          onClick={canRoll ? handleRoll : undefined}
          style={{ cursor: canRoll ? "pointer" : "default" }}
          whileHover={canRoll ? { scale: 1.08 } : {}}
          whileTap={canRoll ? { scale: 0.92 } : {}}
        >
          <DieFace
            value={shownValue}
            size={72}
            active={diceRoll !== null}
            rolling={localRolling || isRolling}
          />
        </motion.div>

        {/* Výsledek a tlačítka */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AnimatePresence mode="wait">
            {diceRoll === null && !localRolling ? (
              <motion.button
                key="roll"
                onClick={handleRoll}
                disabled={!canRoll}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                style={{
                  padding:          "10px 24px",
                  background:       canRoll ? "#1D9E75" : "rgba(29,158,117,0.2)",
                  border:           "none",
                  borderRadius:     10,
                  color:            canRoll ? "#fff" : "#5DCAA5",
                  fontSize:         15,
                  fontWeight:       600,
                  cursor:           canRoll ? "pointer" : "not-allowed",
                  fontFamily:       "Inter, sans-serif",
                  transition:       "all 0.15s",
                }}
              >
                Hodit kostkou
              </motion.button>
            ) : diceRoll !== null ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <div style={{
                  textAlign:  "center",
                  fontSize:   22,
                  fontWeight: 700,
                  color:      "#9FE1CB",
                }}>
                  {diceRoll}
                </div>
                <motion.button
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding:      "10px 20px",
                    background:   "#1D9E75",
                    border:       "none",
                    borderRadius: 10,
                    color:        "#fff",
                    fontSize:     14,
                    fontWeight:   600,
                    cursor:       "pointer",
                    fontFamily:   "Inter, sans-serif",
                  }}
                >
                  Provést tah →
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="rolling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: "#5DCAA5", fontSize: 13 }}
              >
                Hází se...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller;
