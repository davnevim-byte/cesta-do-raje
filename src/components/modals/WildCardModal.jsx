// ============================================================
//  WildCardModal — divoká karta
//  Dramatický "whoosh" efekt, barevné kategorie
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";
import { WILD_CARD_TYPES } from "../../data/wildCards";

const WildCardModal = () => {
  const showWildCard     = useGameStore((s) => s.showWildCard);
  const currentWildCard  = useGameStore((s) => s.currentWildCard);
  const dismissWildCard  = useGameStore((s) => s.dismissWildCard);
  const { sounds }       = useSound();

  const [choice, setChoice] = useState(null);

  const handleDismiss = (c = null) => {
    sounds.nextTurn();
    dismissWildCard(c ? { choice: c } : null);
    setChoice(null);
  };

  if (!showWildCard || !currentWildCard) return null;

  const card    = currentWildCard;
  const typeInfo = WILD_CARD_TYPES[card.type] ?? WILD_CARD_TYPES.group;
  const hasChoice = card.action?.type === "choiceBonus";

  return (
    <AnimatePresence>
      <motion.div
        key="wildcard-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.9)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          zIndex: 100, padding: "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, rotate: -6, scale: 0.78 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 4, scale: 0.88 }}
          transition={{ duration: 0.38, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: "100%", maxWidth: 420,
            background: "#0d0d10",
            border: `2px solid ${typeInfo.color}`,
            borderRadius: 18, overflow: "hidden",
          }}
        >
          {/* Barevný header */}
          <div style={{
            background: `${typeInfo.color}18`,
            padding: "16px 20px",
            borderBottom: `1px solid ${typeInfo.color}33`,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <motion.span
              style={{ fontSize: 32 }}
              animate={{ rotate: [0, 10, -10, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {card.emoji}
            </motion.span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10, fontWeight: 600,
                color: typeInfo.color, letterSpacing: 1, marginBottom: 3,
              }}>
                DIVOKÁ KARTA · {typeInfo.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#e8e8e8" }}>
                {card.title}
              </div>
            </div>
            {/* Dekorativní "karta" ikonka */}
            <div style={{
              width: 36, height: 48,
              background: `${typeInfo.color}22`,
              border: `1px solid ${typeInfo.color}44`,
              borderRadius: 6,
              display: "flex", alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>
              {card.emoji}
            </div>
          </div>

          <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Popis */}
            <p style={{
              fontSize: 15, color: "#ddd",
              lineHeight: 1.6, margin: 0,
            }}>
              {card.description}
            </p>

            {/* Biblický odkaz */}
            {card.verse && (
              <div style={{
                fontSize: 11, color: typeInfo.color,
                padding: "7px 12px",
                background: `${typeInfo.color}10`,
                borderRadius: 8,
                borderLeft: `3px solid ${typeInfo.color}`,
              }}>
                📖 {card.verse}
              </div>
            )}

            {/* Choice karty — dvě možnosti */}
            {hasChoice ? (
              <div style={{ display: "flex", gap: 10 }}>
                <motion.button
                  onClick={() => handleDismiss("A")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1, padding: "12px",
                    background: "rgba(29,158,117,0.1)",
                    border: "1.5px solid #1D9E75",
                    borderRadius: 10, color: "#9FE1CB",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Možnost A
                </motion.button>
                <motion.button
                  onClick={() => handleDismiss("B")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1, padding: "12px",
                    background: "rgba(239,159,39,0.1)",
                    border: "1.5px solid #EF9F27",
                    borderRadius: 10, color: "#FAC775",
                    fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Možnost B
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => handleDismiss()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%", padding: "13px",
                  background: typeInfo.color,
                  border: "none", borderRadius: 10,
                  color: "#fff", fontSize: 15, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Splněno — pokračovat
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WildCardModal;
