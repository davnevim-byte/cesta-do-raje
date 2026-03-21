// ============================================================
//  CongregationModal — políčko Sbor (vnitřní kruh)
//  Sborové scénáře + komentáře ke Strážní věži + START tlačítko
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const TimerRing = ({ seconds, total = 120 }) => {
  const pct   = seconds / total;
  const r     = 28;
  const circ  = 2 * Math.PI * r;
  const dash  = circ * pct;
  const urgent = seconds <= 20;
  const color  = urgent ? "#E24B4A" : seconds <= 40 ? "#EF9F27" : "#1D9E75";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");

  return (
    <div style={{ position: "relative", width: 70, height: 70 }}>
      <svg viewBox="0 0 70 70" style={{ width: 70, height: 70, transform: "rotate(-90deg)" }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke="#222" strokeWidth={4} />
        <motion.circle
          cx="35" cy="35" r={r}
          fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: "monospace" }}>
          {m}:{s}
        </span>
      </div>
    </div>
  );
};

const CongregationModal = () => {
  const showCongregation        = useGameStore((s) => s.showCongregation);
  const currentCongregation     = useGameStore((s) => s.currentCongregation);
  const congregationTime        = useGameStore((s) => s.congregationTimeRemaining);
  const congregationStarted     = useGameStore((s) => s.congregationStarted);
  const answerCongregation      = useGameStore((s) => s.answerCongregation);
  const startCongregationTimer  = useGameStore((s) => s.startCongregationTimer);
  const { sounds }              = useSound();

  const handleResult = (success) => {
    sounds.witnessSuccess?.();
    answerCongregation(success);
  };

  if (!showCongregation || !currentCongregation) return null;

  const scenario = currentCongregation;
  const isStrazniVez = scenario.category === "strážní věž";

  return (
    <AnimatePresence>
      <motion.div
        key="congregation-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 500,
            maxHeight: "90dvh",
            background: "#0a1a0f",
            border: "1.5px solid #1D9E75",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{
            background: "rgba(29,158,117,0.1)",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(29,158,117,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.span
                style={{ fontSize: 24 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isStrazniVez ? "📰" : "🏛️"}
              </motion.span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#9FE1CB" }}>
                  {isStrazniVez ? "Strážní věž!" : "Sbor!"}
                </div>
                <div style={{ fontSize: 11, color: "#0F6E56" }}>
                  {scenario.category} · {scenario.difficulty === "easy" ? "Snadné" : scenario.difficulty === "medium" ? "Střední" : "Těžké"}
                </div>
              </div>
            </div>

            {!congregationStarted ? (
              <motion.button
                onClick={() => startCongregationTimer()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  padding: "10px 20px",
                  background: "#1D9E75",
                  border: "none", borderRadius: 10,
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 0 16px rgba(29,158,117,0.5)",
                }}
              >
                ▶ START
              </motion.button>
            ) : congregationTime !== null ? (
              <TimerRing seconds={congregationTime} total={isStrazniVez ? 90 : 120} />
            ) : null}
          </div>

          {/* Obsah */}
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>

            {/* Název + místo */}
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#9FE1CB", marginBottom: 4 }}>
                {scenario.title}
              </div>
              <div style={{ fontSize: 12, color: "#0F6E56" }}>
                📍 {scenario.setting}
              </div>
            </div>

            {/* Odstavec ze Strážní věže — speciální zobrazení */}
            {isStrazniVez && scenario.passage && (
              <div style={{
                background: "rgba(29,158,117,0.06)",
                border: "2px solid rgba(29,158,117,0.25)",
                borderRadius: 10, padding: "14px 16px",
              }}>
                <div style={{ fontSize: 10, color: "#0F6E56", marginBottom: 8, fontWeight: 600, letterSpacing: 1 }}>
                  📖 ODSTAVEC ZE STRÁŽNÍ VĚŽE
                </div>
                <p style={{
                  fontSize: 14, color: "#c8e8d8",
                  lineHeight: 1.65, margin: 0,
                  fontStyle: "italic",
                }}>
                  {scenario.passage}
                </p>
              </div>
            )}

            {/* Situace */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(29,158,117,0.15)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 11, color: "#0F6E56", marginBottom: 5, fontWeight: 600 }}>SITUACE</div>
              <p style={{ fontSize: 13, color: "#c8e8d8", lineHeight: 1.55, margin: 0 }}>
                {scenario.situation}
              </p>
            </div>

            {/* Role hráčů */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{
                background: "rgba(29,158,117,0.08)",
                border: "1px solid rgba(29,158,117,0.2)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 10, color: "#0F6E56", marginBottom: 5, fontWeight: 600 }}>TY</div>
                <p style={{ fontSize: 12, color: "#9FE1CB", lineHeight: 1.45, margin: 0 }}>{scenario.roleA}</p>
              </div>
              <div style={{
                background: "rgba(29,158,117,0.05)",
                border: "1px solid rgba(29,158,117,0.15)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 10, color: "#0F6E56", marginBottom: 5, fontWeight: 600 }}>MODERÁTOR / DRUHÝ HRÁČ</div>
                <p style={{ fontSize: 12, color: "#5DCAA5", lineHeight: 1.45, margin: 0 }}>{scenario.roleB}</p>
              </div>
            </div>

            {/* Otázka / výzva */}
            <div style={{
              background: "rgba(29,158,117,0.08)",
              border: "1px solid rgba(29,158,117,0.2)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, color: "#0F6E56", marginBottom: 5, fontWeight: 600 }}>
                {isStrazniVez ? "OTÁZKA:" : "SITUACE:"}
              </div>
              <p style={{ fontSize: 14, color: "#9FE1CB", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                „{scenario.objection}"
              </p>
            </div>

            {/* Cíl */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 12, color: "#888",
              borderLeft: "3px solid #1D9E75",
            }}>
              <strong style={{ color: "#9FE1CB" }}>Cíl: </strong>
              {scenario.goal}
            </div>

            {/* Nápověda */}
            <div style={{
              fontSize: 11, color: "#0F6E56",
              padding: "8px 12px",
              background: "rgba(29,158,117,0.05)",
              borderRadius: 8,
            }}>
              💡 {scenario.hint}
            </div>

            {/* Hlasování */}
            <div>
              {!congregationStarted ? (
                <div style={{
                  fontSize: 12, color: "#1D9E75",
                  textAlign: "center", marginBottom: 10,
                  padding: "8px", background: "rgba(29,158,117,0.08)",
                  borderRadius: 8, border: "1px solid rgba(29,158,117,0.2)",
                }}>
                  ⏸ Přečti si situaci a stiskni START až budete připraveni
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "#666", textAlign: "center", marginBottom: 10 }}>
                  {scenario.successCriteria}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  onClick={() => congregationStarted && handleResult(true)}
                  whileHover={congregationStarted ? { scale: 1.03 } : {}}
                  whileTap={congregationStarted ? { scale: 0.96 } : {}}
                  style={{
                    flex: 1, padding: "13px",
                    background: congregationStarted ? "#0a2a1a" : "rgba(10,42,26,0.3)",
                    border: `1.5px solid ${congregationStarted ? "#1D9E75" : "#1a3a2a"}`,
                    borderRadius: 10,
                    color: congregationStarted ? "#9FE1CB" : "#2a5a3a",
                    fontSize: 14, fontWeight: 600,
                    cursor: congregationStarted ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "all 0.3s",
                  }}
                >
                  ✓ Splněno
                </motion.button>
                <motion.button
                  onClick={() => congregationStarted && handleResult(false)}
                  whileHover={congregationStarted ? { scale: 1.03 } : {}}
                  whileTap={congregationStarted ? { scale: 0.96 } : {}}
                  style={{
                    flex: 1, padding: "13px",
                    background: congregationStarted ? "#1a0a0a" : "rgba(26,10,10,0.3)",
                    border: `1.5px solid ${congregationStarted ? "#E24B4A" : "#3a1a1a"}`,
                    borderRadius: 10,
                    color: congregationStarted ? "#F09595" : "#5a2a2a",
                    fontSize: 14, fontWeight: 600,
                    cursor: congregationStarted ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "all 0.3s",
                  }}
                >
                  ✗ Nesplněno
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CongregationModal;
