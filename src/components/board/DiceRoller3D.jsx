// ============================================================
//  DiceRoller3D — 3D CSS kostka + progress kroků pohybu
//  Opravy: useEffect import, mrtvý kód odstraněn,
//          skutečný avatar v player baru
// ============================================================

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";
import { getAvatarComponent, getAvatarColor } from "./AvatarSVG";

// ─── Tečky na každé straně ───────────────────────────────────
const DOTS = {
  1: [[50,50]],
  2: [[25,25],[75,75]],
  3: [[25,25],[50,50],[75,75]],
  4: [[25,25],[75,25],[25,75],[75,75]],
  5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
  6: [[25,20],[75,20],[25,50],[75,50],[25,80],[75,80]],
};

// Rotace kostky aby daná hodnota byla viditelná zepředu
const SHOW_ROTATIONS = {
  1: "rotateX(0deg)   rotateY(0deg)",
  2: "rotateX(-90deg) rotateY(0deg)",
  3: "rotateX(0deg)   rotateY(-90deg)",
  4: "rotateX(0deg)   rotateY(90deg)",
  5: "rotateX(90deg)  rotateY(0deg)",
  6: "rotateX(0deg)   rotateY(180deg)",
};

// Transformace každé ze 6 stěn kostky
const FACE_TRANSFORMS = [
  "rotateY(0deg)   translateZ(36px)",
  "rotateY(180deg) translateZ(36px)",
  "rotateY(90deg)  translateZ(36px)",
  "rotateY(-90deg) translateZ(36px)",
  "rotateX(90deg)  translateZ(36px)",
  "rotateX(-90deg) translateZ(36px)",
];

// Hodnoty na každé stěně (1=čelní, 6=zadní, 3=pravá, 4=levá, 2=horní, 5=dolní)
const FACE_VALUES = [1, 6, 3, 4, 2, 5];

// ─── Jedna stěna kostky ──────────────────────────────────────
const DiceFace = ({ faceIndex }) => {
  const value = FACE_VALUES[faceIndex];
  const dots  = DOTS[value] ?? DOTS[1];

  return (
    <div style={{
      position:       "absolute",
      width:          72, height: 72,
      transform:      FACE_TRANSFORMS[faceIndex],
      background:     "#1a2a1a",
      border:         "1.5px solid #1D9E75",
      borderRadius:   10,
    }}>
      {/* Lesk */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "35%", background: "rgba(255,255,255,0.06)",
        borderRadius: "8px 8px 0 0", pointerEvents: "none",
      }} />
      {/* Tečky */}
      <svg viewBox="0 0 100 100" style={{ width: 56, height: 56, position: "absolute", top: 8, left: 8 }}>
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" fill="#9FE1CB" />
        ))}
      </svg>
    </div>
  );
};

// ─── 3D Kostka ───────────────────────────────────────────────
const Dice3D = ({ rotation }) => (
  <div style={{ width: 72, height: 72, perspective: 400, flexShrink: 0 }}>
    <div style={{
      width: "100%", height: "100%",
      position: "relative",
      transformStyle: "preserve-3d",
      transform: rotation,
      transition: "transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
      {[0,1,2,3,4,5].map((i) => <DiceFace key={i} faceIndex={i} />)}
    </div>
  </div>
);

// ─── Hlavní komponenta ────────────────────────────────────────
const DiceRoller3D = () => {
  const diceRoll    = useGameStore((s) => s.diceRoll);
  const rollDice    = useGameStore((s) => s.rollDice);
  const confirmMove = useGameStore((s) => s.confirmMove);
  const curIdx      = useGameStore((s) => s.currentPlayerIndex);
  const players     = useGameStore((s) => s.players) ?? [];
  const gamePhase   = useGameStore((s) => s.gamePhase);
  const isModalOpen = useGameStore((s) => s.isModalOpen);
  const isMoving    = useGameStore((s) => s.isMoving);
  const movingStep  = useGameStore((s) => s.movingStep);
  const movingTotal = useGameStore((s) => s.movingTotal);
  const diceType    = useGameStore((s) => s.diceType ?? "virtual");
  const setDiceType = useGameStore((s) => s.setDiceType);
  const { sounds }  = useSound();

  const [localRolling, setLocalRolling] = useState(false);
  const [rotation, setRotation]         = useState("rotateX(0deg) rotateY(0deg)");
  const intervalRef = useRef(null);
  const prevStepRef = useRef(0);

  const currentPlayer = players[curIdx];
  const canRoll  = gamePhase === "playing" && diceRoll === null && !isModalOpen() && !isMoving;
  const willSkip = (currentPlayer?.skipTurnsRemaining ?? 0) > 0;

  // Avatar aktuálního hráče
  const AvatarC = currentPlayer ? getAvatarComponent(currentPlayer.avatarId) : null;
  const color   = currentPlayer ? getAvatarColor(currentPlayer.avatarId) : "#1D9E75";

  // ── Tiktak zvuk při každém kroku pohybu ─────────────────
  useEffect(() => {
    if (isMoving && movingStep !== prevStepRef.current) {
      prevStepRef.current = movingStep;
      sounds.land();
    }
    if (!isMoving) prevStepRef.current = 0;
  }, [movingStep, isMoving]);

  // ── Cleanup intervalu ────────────────────────────────────
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // ── Hod kostkou ──────────────────────────────────────────
  const randomSpin = useCallback(() => {
    const rx = Math.floor(Math.random() * 4) * 90;
    const ry = Math.floor(Math.random() * 4) * 90;
    const rz = Math.floor(Math.random() * 4) * 90;
    return `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
  }, []);

  const handleRoll = useCallback(() => {
    if (!canRoll || localRolling) return;
    sounds.dice();
    setLocalRolling(true);

    let count = 0;
    intervalRef.current = setInterval(() => {
      setRotation(randomSpin());
      count++;
      if (count >= 6) {
        clearInterval(intervalRef.current);
        rollDice();
        setLocalRolling(false);
        // Nastav správnou stranu po hodu
        setTimeout(() => {
          const val = useGameStore.getState().diceRoll;
          if (val) setRotation(SHOW_ROTATIONS[val] ?? SHOW_ROTATIONS[1]);
        }, 100);
      }
    }, 115);
  }, [canRoll, localRolling, rollDice, randomSpin, sounds]);

  const handleConfirm = useCallback(() => {
    if (diceRoll === null || isMoving) return;
    sounds.move();
    confirmMove();
    setRotation("rotateX(0deg) rotateY(0deg)");
  }, [diceRoll, isMoving, confirmMove, sounds]);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 14, padding: "14px 0 8px",
    }}>

      {/* ── Aktuální hráč ── */}
      {currentPlayer && (
        <motion.div
          key={curIdx}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "7px 16px",
            background: `${color}14`,
            border: `1px solid ${color}44`,
            borderRadius: 30,
          }}
        >
          {/* Skutečný avatar místo iniciál */}
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            overflow: "hidden", flexShrink: 0,
            border: `2px solid ${color}`,
          }}>
            {AvatarC && <AvatarC size={28} />}
          </div>
          <span style={{ color, fontWeight: 600, fontSize: 14 }}>
            {currentPlayer.name}
          </span>
          <span style={{
            fontSize: 10, color,
            background: `${color}18`,
            padding: "2px 8px", borderRadius: 10, opacity: 0.8,
          }}>
            {currentPlayer.circle === "inner" ? "⛪ Sbor" : "🌍 Svět"}
          </span>
        </motion.div>
      )}

      {/* ── Progress kroků ── */}
      <AnimatePresence>
        {isMoving && movingTotal > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: 8,
              padding: "10px 20px",
              background: "rgba(29,158,117,0.08)",
              border: "1px solid rgba(29,158,117,0.2)",
              borderRadius: 12, minWidth: 160,
            }}
          >
            <div style={{ fontSize: 12, color: "#5DCAA5", fontWeight: 600 }}>
              {movingStep < movingTotal
                ? `Krok ${movingStep} z ${movingTotal}...`
                : "Přistání! 🎯"}
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {Array.from({ length: Math.min(movingTotal, 12) }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < movingStep
                    ? { background: "#1D9E75" }
                    : i === movingStep
                    ? { scale: [1, 1.5, 1], background: "#9FE1CB" }
                    : { background: "#1a1a2a" }
                  }
                  transition={{ duration: 0.18 }}
                  style={{
                    width: i === movingStep - 1 ? 12 : 8,
                    height: i === movingStep - 1 ? 12 : 8,
                    borderRadius: "50%",
                    border: "1px solid rgba(29,158,117,0.3)",
                    transition: "width 0.15s, height 0.15s",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Přeskočení tahu ── */}
      {willSkip && !isMoving && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{
            padding: "7px 16px",
            background: "rgba(226,75,74,0.1)",
            border: "1px solid rgba(226,75,74,0.3)",
            borderRadius: 8, fontSize: 12, color: "#E24B4A",
          }}
        >
          ⏭ {currentPlayer?.name} přeskakuje tento tah
        </motion.div>
      )}

      {/* ── Kostka + tlačítka ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>

        <motion.div
          onClick={canRoll ? handleRoll : undefined}
          whileHover={canRoll ? { scale: 1.08 } : {}}
          whileTap={canRoll ? { scale: 0.92 } : {}}
          style={{ cursor: canRoll ? "pointer" : "default" }}
        >
          <Dice3D rotation={rotation} />
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 130 }}>

          {/* Přepínač fyzická/virtuální */}
          {diceRoll === null && !isMoving && !localRolling && (
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {["virtual", "physical"].map((type) => (
                <button
                  key={type}
                  onClick={() => { setDiceType(type); setPhysicalValue(null); }}
                  style={{
                    flex: 1, padding: "4px 6px", fontSize: 10,
                    background: diceType === type ? "rgba(29,158,117,0.3)" : "transparent",
                    border: `1px solid ${diceType === type ? "#1D9E75" : "#333"}`,
                    borderRadius: 6, color: diceType === type ? "#9FE1CB" : "#555",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {type === "virtual" ? "🎲 Virtuální" : "🎯 Vlastní"}
                </button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isMoving ? (
              <motion.div
                key="moving"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  padding: "11px 16px", textAlign: "center",
                  background: "rgba(29,158,117,0.08)",
                  border: "1px solid rgba(29,158,117,0.2)",
                  borderRadius: 10, color: "#5DCAA5", fontSize: 12,
                }}
              >
                Pohyb...
              </motion.div>

            ) : diceRoll === null && !localRolling ? (
              diceType === "physical" ? (
                <motion.div
                  key="physical"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <div style={{ fontSize: 11, color: "#5DCAA5", textAlign: "center" }}>
                    Hodil/a jsem:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                    {[1,2,3,4,5,6].map((n) => (
                      <button
                        key={n}
                        onClick={() => {
                          if (!canRoll) return;
                          sounds.dice();
                          useGameStore.getState().rollDiceWithValue(n);
                        }}
                        disabled={!canRoll}
                        style={{
                          padding: "8px 4px", fontSize: 16, fontWeight: 700,
                          background: "rgba(29,158,117,0.15)",
                          border: "1px solid rgba(29,158,117,0.3)",
                          borderRadius: 8, color: "#9FE1CB",
                          cursor: canRoll ? "pointer" : "not-allowed",
                          fontFamily: "inherit",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
              <motion.button
                key="roll"
                onClick={handleRoll}
                disabled={!canRoll}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={canRoll ? { scale: 1.04 } : {}}
                whileTap={canRoll ? { scale: 0.96 } : {}}
                style={{
                  padding: "11px 20px",
                  background: canRoll ? "#1D9E75" : "rgba(29,158,117,0.15)",
                  border: "none", borderRadius: 10,
                  color: canRoll ? "#fff" : "#5DCAA5",
                  fontSize: 14, fontWeight: 600,
                  cursor: canRoll ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                }}
              >
                🎲 Hodit
              </motion.button>
              )

            ) : localRolling ? (
              <motion.div
                key="rolling"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  padding: "11px 16px", textAlign: "center",
                  background: "rgba(29,158,117,0.1)",
                  border: "1px solid rgba(29,158,117,0.2)",
                  borderRadius: 10, color: "#5DCAA5", fontSize: 13,
                }}
              >
                Hází se...
              </motion.div>

            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}
              >
                <div style={{
                  fontSize: 34, fontWeight: 700, color: "#9FE1CB",
                  textShadow: "0 0 20px rgba(159,225,203,0.6)",
                }}>
                  {diceRoll}
                </div>
                <motion.button
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "10px 20px",
                    background: "#1D9E75", border: "none",
                    borderRadius: 10, color: "#fff",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Jít → {diceRoll} políček
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller3D;
