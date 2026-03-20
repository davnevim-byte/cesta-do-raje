// ============================================================
//  WitnessingModal — svědectví scénář
//  Dramatické otevření, countdown timer, hlasování skupiny
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const TimerRing = ({ seconds, total = 180 }) => {
  const pct     = seconds / total;
  const r       = 28;
  const circ    = 2 * Math.PI * r;
  const dash    = circ * pct;
  const urgent  = seconds <= 30;
  const color   = urgent ? "#E24B4A" : seconds <= 60 ? "#EF9F27" : "#1D9E75";
  const m       = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s       = (seconds % 60).toString().padStart(2, "0");

  return (
    <div style={{ position: "relative", width: 70, height: 70 }}>
      <svg viewBox="0 0 70 70" style={{ width: 70, height: 70, transform: "rotate(-90deg)" }}>
        <circle cx="35" cy="35" r={r} fill="none" stroke="#222" strokeWidth={4} />
        <motion.circle
          cx="35" cy="35" r={r}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column",
      }}>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color, fontFamily: "monospace",
        }}>
          {m}:{s}
        </span>
      </div>
    </div>
  );
};

const WitnessingModal = () => {
  const showWitnessing      = useGameStore((s) => s.showWitnessing);
  const currentWitnessing   = useGameStore((s) => s.currentWitnessing);
  const witnessingTime      = useGameStore((s) => s.witnessingTimeRemaining);
  const answerWitnessing    = useGameStore((s) => s.answerWitnessing);
  const currentPlayer       = useGameStore((s) => s.players[s.currentPlayerIndex]);
  const { sounds }          = useSound();

  const handleResult = (success) => {
    if (success) sounds.witnessSuccess();
    else sounds.witnessFail();
    answerWitnessing(success);
  };

  if (!showWitnessing || !currentWitnessing) return null;

  const scenario = currentWitnessing;

  return (
    <AnimatePresence>
      <motion.div
        key="witnessing-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
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
            background: "#0d1a0f",
            border: "1.5px solid #EF9F27",
            borderRadius: 16, overflow: "hidden",
          }}
        >
          {/* Header — dramatický */}
          <div style={{
            background: "rgba(239,159,39,0.1)",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(239,159,39,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.span
                style={{ fontSize: 24 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🚪
              </motion.span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#FAC775" }}>
                  Svědectví!
                </div>
                <div style={{ fontSize: 11, color: "#854F0B" }}>
                  {scenario.category} · {scenario.difficulty === "easy" ? "Snadné" : scenario.difficulty === "medium" ? "Střední" : "Těžké"}
                </div>
              </div>
            </div>
            {witnessingTime !== null && (
              <TimerRing seconds={witnessingTime} total={180} />
            )}
          </div>

          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Název + místo */}
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#FAC775", marginBottom: 4 }}>
                {scenario.title}
              </div>
              <div style={{
                fontSize: 12, color: "#854F0B",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                📍 {scenario.setting}
              </div>
            </div>

            {/* Situace */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(239,159,39,0.15)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 11, color: "#633806", marginBottom: 5, fontWeight: 600 }}>
                SITUACE
              </div>
              <p style={{ fontSize: 13, color: "#c8b89a", lineHeight: 1.55, margin: 0 }}>
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
                <div style={{ fontSize: 10, color: "#0F6E56", marginBottom: 5, fontWeight: 600 }}>
                  TY (SVĚDEK)
                </div>
                <p style={{ fontSize: 12, color: "#9FE1CB", lineHeight: 1.45, margin: 0 }}>
                  {scenario.roleA}
                </p>
              </div>
              <div style={{
                background: "rgba(239,159,39,0.08)",
                border: "1px solid rgba(239,159,39,0.2)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 10, color: "#854F0B", marginBottom: 5, fontWeight: 600 }}>
                  DRUHÝ HRÁČ
                </div>
                <p style={{ fontSize: 12, color: "#FAC775", lineHeight: 1.45, margin: 0 }}>
                  {scenario.roleB}
                </p>
              </div>
            </div>

            {/* Námitka — výrazně */}
            <div style={{
              background: "rgba(226,75,74,0.07)",
              border: "1px solid rgba(226,75,74,0.2)",
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ fontSize: 10, color: "#A32D2D", marginBottom: 5, fontWeight: 600 }}>
                CO ŘÍKÁ DRUHÝ HRÁČ:
              </div>
              <p style={{
                fontSize: 14, color: "#F09595",
                fontStyle: "italic", lineHeight: 1.5, margin: 0,
              }}>
                „{scenario.objection}"
              </p>
            </div>

            {/* Cíl */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 12, color: "#888",
              borderLeft: "3px solid #EF9F27",
            }}>
              <strong style={{ color: "#FAC775" }}>Cíl: </strong>
              {scenario.goal}
            </div>

            {/* Nápověda */}
            <div style={{
              fontSize: 11, color: "#633806",
              padding: "8px 12px",
              background: "rgba(239,159,39,0.05)",
              borderRadius: 8,
            }}>
              💡 {scenario.hint}
            </div>

            {/* Hlasování */}
            <div>
              <div style={{
                fontSize: 12, color: "#666",
                textAlign: "center", marginBottom: 10,
              }}>
                {scenario.successCriteria}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  onClick={() => handleResult(true)}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1, padding: "13px",
                    background: "#0a2a1a",
                    border: "1.5px solid #1D9E75",
                    borderRadius: 10, color: "#9FE1CB",
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  ✓ Úspěšné svědectví
                </motion.button>
                <motion.button
                  onClick={() => handleResult(false)}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 1, padding: "13px",
                    background: "#1a0a0a",
                    border: "1.5px solid #E24B4A",
                    borderRadius: 10, color: "#F09595",
                    fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
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

export default WitnessingModal;
