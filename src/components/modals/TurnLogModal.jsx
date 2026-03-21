// TurnLogModal - historie tahu
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { getAvatarColor } from "../board/AvatarSVG";

const TurnLogModal = ({ onClose }) => {
  const turnLog = useGameStore((s) => s.turnLog);
  const players = useGameStore((s) => s.players) ?? [];
  const [filter, setFilter] = useState(null);

  // Barva hrace dle jmena
  const playerColor = (name) => {
    const p = players.find((pl) => pl.name === name);
    return p ? getAvatarColor(p.avatarId) : "#1D9E75";
  };

  const filtered = filter
    ? turnLog.filter((e) => e.playerName === filter)
    : turnLog;

  // Unikatni hraci v logu
  const logPlayers = [...new Set(turnLog.map((e) => e.playerName))];

  return (
    <AnimatePresence>
      <motion.div
        key="turnlog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 460, maxHeight: "90dvh",
            background: "#0a0a14",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#9FE1CB" }}>
                Historie tahu
              </div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                {turnLog.length} tahu celkem
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent", border: "1px solid #333",
                borderRadius: 8, color: "#555", fontSize: 14,
                cursor: "pointer", padding: "4px 10px", fontFamily: "inherit",
              }}
            >X</button>
          </div>

          {/* Filter hracu */}
          {logPlayers.length > 1 && (
            <div style={{
              display: "flex", gap: 6, padding: "10px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexWrap: "wrap", flexShrink: 0,
            }}>
              <button
                onClick={() => setFilter(null)}
                style={{
                  padding: "4px 12px",
                  background: filter === null ? "rgba(29,158,117,0.2)" : "transparent",
                  border: `1px solid ${filter === null ? "#1D9E75" : "#333"}`,
                  borderRadius: 8,
                  color: filter === null ? "#9FE1CB" : "#555",
                  fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Vsichni
              </button>
              {logPlayers.map((name) => {
                const c = playerColor(name);
                return (
                  <button
                    key={name}
                    onClick={() => setFilter(filter === name ? null : name)}
                    style={{
                      padding: "4px 12px",
                      background: filter === name ? `${c}22` : "transparent",
                      border: `1px solid ${filter === name ? c : "#333"}`,
                      borderRadius: 8,
                      color: filter === name ? c : "#555",
                      fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Log zaznamy */}
          <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
            {filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                color: "#333", fontSize: 13,
              }}>
                Zatim zadne tahy.
              </div>
            ) : (
              filtered.map((entry, i) => {
                const c = playerColor(entry.playerName);
                const isFirst = i === 0;
                return (
                  <motion.div
                    key={entry.id}
                    initial={isFirst ? { opacity: 0, x: -10 } : {}}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 18px",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      background: isFirst ? `${c}08` : "transparent",
                    }}
                  >
                    {/* Cislo tahu */}
                    <div style={{
                      fontSize: 10, color: "#333",
                      minWidth: 28, textAlign: "right",
                    }}>
                      #{filtered.length - i}
                    </div>

                    {/* Barevna tecka */}
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: c, flexShrink: 0,
                      boxShadow: isFirst ? `0 0 6px ${c}` : "none",
                    }} />

                    {/* Obsah */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: c }}>
                          {entry.playerName}
                        </span>
                        <span style={{ fontSize: 11, color: "#444" }}>
                          hodil/a {entry.roll}
                        </span>
                      </div>
                      <div style={{
                        fontSize: 12, color: "#666",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {entry.tileName}
                      </div>
                    </div>

                    {/* Cas */}
                    <div style={{ fontSize: 10, color: "#2a2a3a", flexShrink: 0 }}>
                      {entry.timestamp}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TurnLogModal;
