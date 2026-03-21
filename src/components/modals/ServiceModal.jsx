// ============================================================
//  ServiceModal — políčko Služba (vnitřní kruh)
//  Těžší svědectví scénáře + START tlačítko
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const TimerRing = ({ seconds, total = 210 }) => {
  const pct   = seconds / total;
  const r     = 28;
  const circ  = 2 * Math.PI * r;
  const dash  = circ * pct;
  const urgent = seconds <= 30;
  const color  = urgent ? "#E24B4A" : seconds <= 60 ? "#EF9F27" : "#378ADD";
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

const ServiceModal = () => {
  const showService       = useGameStore((s) => s.showService);
  const currentService    = useGameStore((s) => s.currentService);
  const serviceTime       = useGameStore((s) => s.serviceTimeRemaining);
  const serviceStarted    = useGameStore((s) => s.serviceStarted);
  const answerService     = useGameStore((s) => s.answerService);
  const startServiceTimer = useGameStore((s) => s.startServiceTimer);
  const { sounds }        = useSound();

  const handleResult = (success) => {
    if (success) sounds.witnessSuccess?.();
    else sounds.witnessFail?.();
    answerService(success);
  };

  if (!showService || !currentService) return null;

  const scenario = currentService;

  return (
    <AnimatePresence>
      <motion.div
        key="service-overlay"
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
          initial={{ opacity: 0, scale: 0.88, rotateY: -12 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 500,
            maxHeight: "90dvh",
            background: "#0d0f1a",
            border: "1.5px solid #378ADD",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{
            background: "rgba(55,138,221,0.1)",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(55,138,221,0.2)",
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
                📢
              </motion.span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#B5D4F4" }}>
                  Služba!
                </div>
                <div style={{ fontSize: 11, color: "#2a5a8a" }}>
                  {scenario.category} · {scenario.difficulty === "easy" ? "Snadné" : scenario.difficulty === "medium" ? "Střední" : "Těžké"}
                </div>
              </div>
            </div>

            {!serviceStarted ? (
              <motion.button
                onClick={() => startServiceTimer()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  padding: "10px 20px",
                  background: "#378ADD",
                  border: "none", borderRadius: 10,
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 0 16px rgba(55,138,221,0.5)",
                }}
              >
                ▶ START
              </motion.button>
            ) : serviceTime !== null ? (
              <TimerRing seconds={serviceTime} total={210} />
            ) : null}
          </div>

          {/* Obsah */}
          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>

            {/* Název + místo */}
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#B5D4F4", marginBottom: 4 }}>
                {scenario.title}
              </div>
              <div style={{ fontSize: 12, color: "#2a5a8a", display: "flex", alignItems: "center", gap: 6 }}>
                📍 {scenario.setting}
              </div>
            </div>

            {/* Situace */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(55,138,221,0.15)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 11, color: "#2a5a8a", marginBottom: 5, fontWeight: 600 }}>SITUACE</div>
              <p style={{ fontSize: 13, color: "#c8d8ea", lineHeight: 1.55, margin: 0 }}>
                {scenario.situation}
              </p>
            </div>

            {/* Role hráčů */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{
                background: "rgba(55,138,221,0.08)",
                border: "1px solid rgba(55,138,221,0.2)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 10, color: "#1a5a9a", marginBottom: 5, fontWeight: 600 }}>TY (SVĚDEK)</div>
                <p style={{ fontSize: 12, color: "#B5D4F4", lineHeight: 1.45, margin: 0 }}>{scenario.roleA}</p>
              </div>
              <div style={{
                background: "rgba(55,138,221,0.06)",
                border: "1px solid rgba(55,138,221,0.15)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 10, color: "#1a5a9a", marginBottom: 5, fontWeight: 600 }}>DRUHÝ HRÁČ</div>
                <p style={{ fontSize: 12, color: "#8ab4d4", lineHeight: 1.45, margin: 0 }}>{scenario.roleB}</p>
              </div>
            </div>

            {/* Námitka */}
            <div style={{
              background: "rgba(226,75,74,0.07)",
              border: "1px solid rgba(226,75,74,0.2)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, color: "#A32D2D", marginBottom: 5, fontWeight: 600 }}>CO ŘÍKÁ DRUHÝ HRÁČ:</div>
              <p style={{ fontSize: 14, color: "#F09595", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                „{scenario.objection}"
              </p>
            </div>

            {/* Cíl */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 12, color: "#888",
              borderLeft: "3px solid #378ADD",
            }}>
              <strong style={{ color: "#B5D4F4" }}>Cíl: </strong>
              {scenario.goal}
            </div>

            {/* Nápověda */}
            <div style={{
              fontSize: 11, color: "#2a5a8a",
              padding: "8px 12px",
              background: "rgba(55,138,221,0.05)",
              borderRadius: 8,
            }}>
              💡 {scenario.hint}
            </div>

            {/* Hlasování */}
            <div>
              {!serviceStarted ? (
                <div style={{
                  fontSize: 12, color: "#378ADD",
                  textAlign: "center", marginBottom: 10,
                  padding: "8px", background: "rgba(55,138,221,0.08)",
                  borderRadius: 8, border: "1px solid rgba(55,138,221,0.2)",
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
                  onClick={() => serviceStarted && handleResult(true)}
                  whileHover={serviceStarted ? { scale: 1.03 } : {}}
                  whileTap={serviceStarted ? { scale: 0.96 } : {}}
                  style={{
                    flex: 1, padding: "13px",
                    background: serviceStarted ? "#0a1a2a" : "rgba(10,26,42,0.3)",
                    border: `1.5px solid ${serviceStarted ? "#378ADD" : "#1a3a5a"}`,
                    borderRadius: 10,
                    color: serviceStarted ? "#B5D4F4" : "#2a4a6a",
                    fontSize: 14, fontWeight: 600,
                    cursor: serviceStarted ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "all 0.3s",
                  }}
                >
                  ✓ Úspěšné svědectví
                </motion.button>
                <motion.button
                  onClick={() => serviceStarted && handleResult(false)}
                  whileHover={serviceStarted ? { scale: 1.03 } : {}}
                  whileTap={serviceStarted ? { scale: 0.96 } : {}}
                  style={{
                    flex: 1, padding: "13px",
                    background: serviceStarted ? "#1a0a0a" : "rgba(26,10,10,0.3)",
                    border: `1.5px solid ${serviceStarted ? "#E24B4A" : "#3a1a1a"}`,
                    borderRadius: 10,
                    color: serviceStarted ? "#F09595" : "#5a2a2a",
                    fontSize: 14, fontWeight: 600,
                    cursor: serviceStarted ? "pointer" : "not-allowed",
                    fontFamily: "inherit", transition: "all 0.3s",
                  }}
                >
                  ✗ Neúspěšné
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;
