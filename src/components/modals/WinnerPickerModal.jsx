// ============================================================
//  WinnerPickerModal — výběr vítěze skupinové výzvy
//
//  Zobrazí se po skupinové aktivitě nebo skupinové divoké
//  kartě. Skupina vybere, kdo skutečně vyhrál, a odměna
//  putuje tomuto hráči (ne automaticky aktuálnímu hráči).
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";
import { AVATARS } from "../../store/gameStore";

const WinnerPickerModal = () => {
  const show         = useGameStore((s) => s.showWinnerPicker);
  const players      = useGameStore((s) => s.players);
  const reward       = useGameStore((s) => s.winnerPickerReward);
  const label        = useGameStore((s) => s.winnerPickerLabel);
  const selectWinner = useGameStore((s) => s.selectWinner);
  const skipPicker   = useGameStore((s) => s.skipWinnerPicker);
  const { sounds }   = useSound();

  if (!show) return null;

  const handleSelect = (idx) => {
    sounds.correct?.();
    selectWinner(idx);
  };

  const handleSkip = () => {
    sounds.nextTurn?.();
    skipPicker();
  };

  // Popis odměny pro zobrazení
  const rewardText = label ||
    (() => {
      if (!reward) return "Odměna pro vítěze";
      const spaces = reward.moveForward ?? reward.spaces ?? 0;
      const fruit  = reward.fruit;
      if (spaces > 0 && fruit)
        return `+${spaces} políček vpřed · ovoce ducha: ${fruit}`;
      if (spaces > 0)
        return `Vítěz postoupí o ${spaces} políčk${spaces === 1 ? "o" : spaces < 5 ? "a" : ""} vpřed`;
      if (fruit)
        return `Vítěz získá ovoce ducha: ${fruit}`;
      return "Odměna pro vítěze";
    })();

  return (
    <AnimatePresence>
      <motion.div
        key="winner-picker-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position:       "fixed",
          inset:          0,
          background:     "rgba(0,0,0,0.92)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          zIndex:         110,
          padding:        "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 24 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.9,  y: 12 }}
          transition={{ duration: 0.36, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width:        "100%",
            maxWidth:     420,
            maxHeight:    "90dvh",
            display:      "flex",
            flexDirection:"column",
            background:   "#0d0d14",
            border:       "2px solid #F4C842",
            borderRadius: 20,
            overflow:     "hidden",
          }}
        >
          {/* ── Header ── */}
          <div style={{
            background:   "rgba(244,200,66,0.10)",
            borderBottom: "1px solid rgba(244,200,66,0.25)",
            padding:      "18px 20px",
            display:      "flex",
            alignItems:   "center",
            gap:          12,
            flexShrink:   0,
          }}>
            <motion.span
              style={{ fontSize: 34 }}
              animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              🏆
            </motion.span>
            <div>
              <div style={{
                fontSize:    10,
                fontWeight:  700,
                color:       "#F4C842",
                letterSpacing: 1.2,
                marginBottom: 3,
              }}>
                SKUPINOVÁ VÝZVA · VÍTĚZ
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#ede8d0" }}>
                Kdo vyhrál?
              </div>
            </div>
          </div>

          {/* ── Popis odměny ── */}
          <div style={{
            padding:    "12px 20px 4px",
            flexShrink: 0,
          }}>
            <div style={{
              fontSize:   12,
              color:      "#F4C842",
              background: "rgba(244,200,66,0.08)",
              border:     "1px solid rgba(244,200,66,0.2)",
              borderRadius: 8,
              padding:    "8px 12px",
              textAlign:  "center",
              fontWeight: 600,
            }}>
              🎁 {rewardText}
            </div>
          </div>

          {/* ── Seznam hráčů ── */}
          <div style={{
            padding:           "12px 16px",
            display:           "flex",
            flexDirection:     "column",
            gap:               8,
            overflowY:         "auto",
            WebkitOverflowScrolling: "touch",
            flex:              1,
          }}>
            <div style={{
              fontSize: 11,
              color:    "#666",
              textAlign:"center",
              marginBottom: 4,
              letterSpacing: 0.5,
            }}>
              Vyberte hráče, který vyhrál skupinovou výzvu
            </div>

            {players.map((player, idx) => {
              const avatarInfo = AVATARS.find((a) => a.id === player.avatarId)
                ?? AVATARS[idx % AVATARS.length];
              const circleLabel = player.circle === "inner" ? "sbor" : "vnější kruh";

              return (
                <motion.button
                  key={player.id}
                  onClick={() => handleSelect(idx)}
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    gap:            12,
                    padding:        "12px 14px",
                    background:     "rgba(255,255,255,0.04)",
                    border:         "1.5px solid rgba(244,200,66,0.25)",
                    borderRadius:   12,
                    cursor:         "pointer",
                    fontFamily:     "inherit",
                    textAlign:      "left",
                    width:          "100%",
                  }}
                >
                  {/* Barevný kruh s iniciálou */}
                  <div style={{
                    width:          38,
                    height:         38,
                    borderRadius:   "50%",
                    background:     `var(--${avatarInfo.colorClass.replace("bg-", "").replace("-500", "")}-500, #666)`,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    fontSize:       16,
                    fontWeight:     700,
                    color:          "#fff",
                    flexShrink:     0,
                    // Fallback inline color mapping
                    backgroundColor: getPlayerColor(avatarInfo.colorClass),
                  }}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize:   15,
                      fontWeight: 700,
                      color:      "#e8e8e8",
                      whiteSpace: "nowrap",
                      overflow:   "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {player.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>
                      Políčko {player.position + 1} · {circleLabel}
                    </div>
                  </div>

                  {/* Šipka doprava */}
                  <span style={{ fontSize: 18, color: "#F4C842", opacity: 0.7 }}>
                    ›
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* ── Nikdo nevyhrál ── */}
          <div style={{
            padding:    "10px 16px 16px",
            flexShrink: 0,
            borderTop:  "1px solid rgba(255,255,255,0.06)",
          }}>
            <motion.button
              onClick={handleSkip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width:       "100%",
                padding:     "11px",
                background:  "transparent",
                border:      "1px solid #333",
                borderRadius: 10,
                color:       "#555",
                fontSize:    13,
                fontWeight:  600,
                cursor:      "pointer",
                fontFamily:  "inherit",
              }}
            >
              Nikdo nevyhrál — přeskočit
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Mapování Tailwind tříd na skutečné CSS barvy pro inline style
const getPlayerColor = (colorClass) => {
  const map = {
    "bg-teal-500":    "#14b8a6",
    "bg-indigo-500":  "#6366f1",
    "bg-rose-500":    "#f43f5e",
    "bg-amber-500":   "#f59e0b",
    "bg-emerald-500": "#10b981",
    "bg-violet-500":  "#8b5cf6",
    "bg-cyan-500":    "#06b6d4",
    "bg-fuchsia-500": "#d946ef",
    "bg-lime-500":    "#84cc16",
    "bg-orange-500":  "#f97316",
    "bg-sky-500":     "#0ea5e9",
    "bg-pink-500":    "#ec4899",
  };
  return map[colorClass] ?? "#6b7280";
};

export default WinnerPickerModal;
