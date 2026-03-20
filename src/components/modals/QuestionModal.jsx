// ============================================================
//  QuestionModal — biblická otázka
//  Zobrazí otázku, nápovědu, pak odhalí odpověď
//  Skupina hlasuje správně / špatně
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";
import { VARIANTS } from "../../hooks/useAnimation";

const DIFFICULTY_COLORS = {
  EASY:   { bg: "#0a1a10", border: "#1D9E75", label: "Snadná",  color: "#9FE1CB" },
  MEDIUM: { bg: "#1a1205", border: "#EF9F27", label: "Střední", color: "#FAC775" },
  HARD:   { bg: "#1a0a0a", border: "#E24B4A", label: "Těžká",   color: "#F09595" },
};

const QuestionModal = () => {
  const showQuestion    = useGameStore((s) => s.showQuestion);
  const currentQuestion = useGameStore((s) => s.currentQuestion);
  const difficulty      = useGameStore((s) => s.difficulty);
  const answerQuestion  = useGameStore((s) => s.answerQuestion);
  const currentPlayer   = useGameStore((s) => s.players[s.currentPlayerIndex]);
  const { sounds }      = useSound();

  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint]     = useState(false);

  const dc = DIFFICULTY_COLORS[difficulty] ?? DIFFICULTY_COLORS.EASY;

  const handleRevealAnswer = () => {
    setShowAnswer(true);
    sounds.land();
  };

  const handleAnswer = (correct) => {
    if (correct) sounds.correct();
    else sounds.wrong();
    setShowAnswer(false);
    setShowHint(false);
    answerQuestion(correct);
  };

  if (!showQuestion || !currentQuestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="question-overlay"
        {...VARIANTS.modalOverlay}
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(0,0,0,0.85)",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex:     100,
          padding:    "16px",
        }}
      >
        <motion.div
          {...VARIANTS.modalContent}
          style={{
            width:        "100%",
            maxWidth:     480,
            background:   dc.bg,
            border:       `1.5px solid ${dc.border}`,
            borderRadius: 16,
            overflow:     "hidden",
          }}
        >
          {/* Header */}
          <div style={{
            padding:      "14px 20px",
            borderBottom: `1px solid ${dc.border}22`,
            display:      "flex",
            alignItems:   "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>📖</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: dc.color }}>
                  Biblická otázka
                </div>
                <div style={{ fontSize: 11, color: "#5F5E5A" }}>
                  {currentPlayer?.name} · {currentQuestion.tileName ?? "Studium"}
                </div>
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 20,
              background: `${dc.border}22`, color: dc.color,
            }}>
              {dc.label}
            </span>
          </div>

          {/* Otázka */}
          <div style={{ padding: "20px 20px 0" }}>
            <p style={{
              fontSize: 17, fontWeight: 600,
              color: "#e8e8e8", lineHeight: 1.5,
              marginBottom: 0,
            }}>
              {currentQuestion.question}
            </p>
          </div>

          {/* Nápověda */}
          <div style={{ padding: "12px 20px 0" }}>
            <AnimatePresence>
              {showHint ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background:   "rgba(255,255,255,0.04)",
                    border:       "1px solid #333",
                    borderRadius: 8,
                    padding:      "10px 14px",
                    fontSize:     13,
                    color:        "#888",
                    fontStyle:    "italic",
                  }}
                >
                  💡 {currentQuestion.hint}
                </motion.div>
              ) : (
                <motion.button
                  onClick={() => setShowHint(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background:   "transparent",
                    border:       "1px solid #333",
                    borderRadius: 8,
                    padding:      "7px 14px",
                    fontSize:     12,
                    color:        "#666",
                    cursor:       "pointer",
                    fontFamily:   "inherit",
                  }}
                >
                  Zobrazit nápovědu
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Odpověď */}
          <div style={{ padding: "16px 20px" }}>
            <AnimatePresence mode="wait">
              {!showAnswer ? (
                <motion.button
                  key="reveal"
                  onClick={handleRevealAnswer}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width:        "100%",
                    padding:      "13px",
                    background:   dc.border,
                    border:       "none",
                    borderRadius: 10,
                    color:        "#fff",
                    fontSize:     15,
                    fontWeight:   600,
                    cursor:       "pointer",
                    fontFamily:   "inherit",
                  }}
                >
                  Odhalit odpověď
                </motion.button>
              ) : (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={{
                    background:   "rgba(255,255,255,0.04)",
                    border:       `1px solid ${dc.border}55`,
                    borderRadius: 10,
                    padding:      "14px",
                    marginBottom: 14,
                  }}>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                      Správná odpověď:
                    </div>
                    <p style={{
                      fontSize: 14, color: "#ddd",
                      lineHeight: 1.55, margin: 0,
                    }}>
                      {currentQuestion.answer}
                    </p>
                    {currentQuestion.verseRef && (
                      <div style={{
                        marginTop: 8, fontSize: 11,
                        color: dc.color, fontWeight: 500,
                      }}>
                        📖 {currentQuestion.verseRef}
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 12, color: "#666", textAlign: "center", marginBottom: 10 }}>
                    {currentPlayer?.name} odpověděl/a správně?
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <motion.button
                      onClick={() => handleAnswer(true)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        flex: 1, padding: "12px",
                        background: "#0a2a1a",
                        border: "1.5px solid #1D9E75",
                        borderRadius: 10, color: "#9FE1CB",
                        fontSize: 14, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      ✓ Správně
                    </motion.button>
                    <motion.button
                      onClick={() => handleAnswer(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        flex: 1, padding: "12px",
                        background: "#2a0a0a",
                        border: "1.5px solid #E24B4A",
                        borderRadius: 10, color: "#F09595",
                        fontSize: 14, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      ✗ Špatně
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionModal;
