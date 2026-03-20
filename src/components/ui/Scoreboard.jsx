// ============================================================
//  Scoreboard — live přehled hráčů
// ============================================================

import { motion } from "framer-motion";
import { useGameStore, AVATARS } from "../../store/gameStore";
import { FRUITS, getTopFruits, getTotalFruitScore } from "../../data/fruitOfSpirit";
import { getAvatarComponent, getAvatarColor } from "../board/AvatarSVG";

const PLAYER_COLORS = [
  "#1D9E75","#EF9F27","#D4537E","#378ADD",
  "#7F77DD","#E24B4A","#9FE1CB","#FAC775",
  "#85B7EB","#ED93B1",
];

export const Scoreboard = ({ compact = false }) => {
  const players            = useGameStore((s) => s.players) ?? [];
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);

  const sorted = [...players]
    .map((p, i) => ({ ...p, origIndex: i }))
    .sort((a, b) => {
      if (a.circle === "inner" && b.circle !== "inner") return -1;
      if (b.circle === "inner" && a.circle !== "inner") return 1;
      return b.position - a.position;
    });

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: compact ? 4 : 6,
    }}>
      {sorted.map((player, rank) => {
        const isActive = player.origIndex === currentPlayerIndex;
        const color    = getAvatarColor(player.avatarId);
        const AvatarComp = getAvatarComponent(player.avatarId);
        const topFruit = getTopFruits(player.fruitScore ?? {}, 1)[0];
        const total    = getTotalFruitScore(player.fruitScore ?? {});

        return (
          <motion.div
            key={player.id}
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rank * 0.05 }}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          8,
              padding:      compact ? "6px 10px" : "8px 12px",
              background:   isActive ? `${color}18` : "rgba(255,255,255,0.03)",
              border:       `1px solid ${isActive ? color : "rgba(255,255,255,0.06)"}`,
              borderRadius: 10,
              transition:   "all 0.3s",
            }}
          >
            {/* Rank */}
            <span style={{
              fontSize: 11, color: "#555",
              minWidth: 14, textAlign: "center",
            }}>
              {rank + 1}
            </span>

            {/* Avatar */}
            <div style={{ flexShrink: 0, border: isActive ? `2px solid ${color}` : "2px solid transparent", borderRadius: "50%" }}>
              <AvatarComp size={compact ? 24 : 30} />
            </div>

            {/* Jméno + pozice */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: compact ? 12 : 13,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#e8e8e8" : "#aaa",
                whiteSpace: "nowrap", overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {player.name}
                {player.skipTurnsRemaining > 0 && (
                  <span style={{ fontSize: 10, color: "#E24B4A", marginLeft: 4 }}>⏭</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: "#555" }}>
                {player.circle === "inner" ? "⛪ Sbor" : "🌍 Svět"}
                {" · "}pol. {player.position + 1}
              </div>
            </div>

            {/* Top ovoce */}
            {topFruit && total > 0 && !compact && (
              <div style={{
                fontSize: 10, color: topFruit.color,
                display: "flex", alignItems: "center", gap: 3,
              }}>
                {topFruit.emoji}
                <span style={{ fontSize: 9, color: "#555" }}>{total}</span>
              </div>
            )}

            {/* Aktivní indikátor */}
            {isActive && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  width: 6, height: 6,
                  borderRadius: "50%",
                  background: color,
                  flexShrink: 0,
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================
//  FruitTracker — ovoce ducha aktuálního hráče
// ============================================================

export const FruitTracker = ({ playerIndex }) => {
  const players = useGameStore((s) => s.players) ?? [];
  const player  = players[playerIndex ?? 0];

  if (!player?.fruitScore) return null;

  const topFruits = getTopFruits(player.fruitScore, 9).filter((f) => f.score > 0);

  if (topFruits.length === 0) {
    return (
      <div style={{ fontSize: 12, color: "#444", textAlign: "center", padding: "8px 0" }}>
        Zatím žádné ovoce ducha
      </div>
    );
  }

  return (
    <div>
      <div style={{
        fontSize: 10, color: "#555",
        marginBottom: 8, fontWeight: 600, letterSpacing: 0.5,
      }}>
        OVOCE DUCHA
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {topFruits.map((fruit) => (
          <motion.div
            key={fruit.key}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ease: "backOut" }}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          5,
              padding:      "4px 10px",
              background:   `${fruit.color}18`,
              border:       `1px solid ${fruit.color}44`,
              borderRadius: 20,
            }}
          >
            <span style={{ fontSize: 12 }}>{fruit.emoji}</span>
            <span style={{ fontSize: 11, color: fruit.color, fontWeight: 500 }}>
              {fruit.label}
            </span>
            <span style={{
              fontSize: 10, color: "#555",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10, padding: "1px 5px",
            }}>
              {fruit.score}×
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
//  Timer — odpočet
// ============================================================

export const Timer = () => {
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const timerMinutes  = useGameStore((s) => s.timerMinutes);
  const pauseTimer    = useGameStore((s) => s.pauseTimer);
  const resumeTimer   = useGameStore((s) => s.resumeTimer);
  const isRunning     = useGameStore((s) => s.isTimerRunning ?? true);

  const pct     = timeRemaining / (timerMinutes * 60);
  const urgent  = timeRemaining <= 120;
  const warning = timeRemaining <= 300;
  const color   = urgent ? "#E24B4A" : warning ? "#EF9F27" : "#1D9E75";

  const m = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
  const s = (timeRemaining % 60).toString().padStart(2, "0");

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "8px 14px",
      background: urgent ? "rgba(226,75,74,0.08)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${color}44`,
      borderRadius: 30,
    }}>
      {/* Progress ring */}
      <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0 }}>
        <svg viewBox="0 0 36 36" style={{ width: 36, height: 36, transform: "rotate(-90deg)" }}>
          <circle cx="18" cy="18" r="15" fill="none" stroke="#222" strokeWidth={2.5} />
          <motion.circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`${94.2 * pct} 94.2`}
            animate={{ strokeDasharray: `${94.2 * pct} 94.2` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Čas */}
      <motion.span
        style={{
          fontSize:    16,
          fontWeight:  700,
          color,
          fontFamily:  "monospace",
        }}
        animate={urgent ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.8, repeat: urgent ? Infinity : 0 }}
      >
        {m}:{s}
      </motion.span>

      {/* Pause/Resume */}
      <button
        onClick={isRunning ? pauseTimer : resumeTimer}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#555",
          fontSize: 14,
          padding: "2px 4px",
        }}
        title={isRunning ? "Pozastavit" : "Spustit"}
      >
        {isRunning ? "⏸" : "▶"}
      </button>
    </div>
  );
};
