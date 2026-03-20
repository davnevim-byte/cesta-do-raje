// ============================================================
//  TileModal — instrukce políčka
//  Fullscreen atmosférický moment při přistání
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";
import { TILE_COLORS } from "../../data/tiles";
import { getTileIllustration } from "../board/TileIllustration";

const TYPE_CONFIG = {
  negative: {
    emoji:   "⚠️",
    title:   "Negativní výzva",
    bg:      "#0d0505",
    accent:  "#E24B4A",
    btnText: "Splněno — pokračovat",
    btnBg:   "#1D9E75",
    skipText:"Přeskočit (trest)",
    skipBg:  "#2a0a0a",
    skipColor:"#E24B4A",
  },
  special: {
    emoji:   "✨",
    title:   "Speciální akce",
    bg:      "#050a18",
    accent:  "#378ADD",
    btnText: "Splněno — pokračovat",
    btnBg:   "#1D9E75",
    skipText: null,
    skipBg:  null,
    skipColor: null,
  },
  study: {
    emoji:   "📖",
    title:   "Studium Bible",
    bg:      "#050f08",
    accent:  "#1D9E75",
    btnText: "Pokračovat",
    btnBg:   "#1D9E75",
    skipText: null,
    skipBg:  null,
    skipColor: null,
  },
  prayer: {
    emoji:   "🙏",
    title:   "Modlitba",
    bg:      "#040d08",
    accent:  "#0F6E56",
    btnText: "Pokračovat",
    btnBg:   "#0F6E56",
    skipText: null,
    skipBg:  null,
    skipColor: null,
  },
  entry: {
    emoji:   "⛪",
    title:   "Vstup do sboru",
    bg:      "#0d0a03",
    accent:  "#EF9F27",
    btnText: "Vstoupit — pokračovat",
    btnBg:   "#EF9F27",
    skipText: null,
    skipBg:  null,
    skipColor: null,
  },
  start: {
    emoji:   "🏁",
    title:   "Start",
    bg:      "#050f08",
    accent:  "#1D9E75",
    btnText: "Pokračovat",
    btnBg:   "#1D9E75",
    skipText: null,
    skipBg:  null,
    skipColor: null,
  },
};

export const TileModal = () => {
  const showTileAction    = useGameStore((s) => s.showTileAction);
  const currentTileAction = useGameStore((s) => s.currentTileAction);
  const dismissTileAction = useGameStore((s) => s.dismissTileAction);
  const currentPlayer     = useGameStore((s) => s.players[s.currentPlayerIndex]);
  const { sounds }        = useSound();

  if (!showTileAction || !currentTileAction) return null;

  const { tile, instruction } = currentTileAction;
  const cfg = TYPE_CONFIG[tile.type] ?? TYPE_CONFIG.special;
  const isNegative = tile.type === "negative";

  const handleComplete = () => {
    sounds.correct();
    dismissTileAction(true);
  };

  const handleSkip = () => {
    sounds.wrong();
    dismissTileAction(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="tile-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isNegative ? 0.4 : 0.25 }}
        style={{
          position: "fixed", inset: 0,
          background: isNegative ? "rgba(0,0,0,0.94)" : "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          zIndex: 100, padding: "16px",
        }}
      >
        {/* Záblesk barvy pro negativní */}
        {isNegative && (
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute", inset: 0,
              background: cfg.accent,
              pointerEvents: "none",
            }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: isNegative ? 1.08 : 0.9, y: isNegative ? 0 : 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 460,
            maxHeight: "90dvh",
            display: "flex", flexDirection: "column",
            background: cfg.bg,
            border: `1.5px solid ${cfg.accent}`,
            borderRadius: 16, overflow: "hidden",
          }}
        >
          {/* Accent linka nahoře */}
          <div style={{ height: 3, background: cfg.accent }} />

          <div style={{ padding: "20px", overflowY: "auto", WebkitOverflowScrolling: "touch", flex: 1 }}>
            {/* Ilustrace políčka */}
            {(() => {
              const IllComp = getTileIllustration(tile.name, tile.type);
              return IllComp ? (
                <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden" }}>
                  <IllComp size={340} />
                </div>
              ) : null;
            })()}

            {/* Hlavička */}
            <div style={{
              display: "flex", alignItems: "center",
              gap: 12, marginBottom: 16,
            }}>
              <motion.span
                style={{ fontSize: 28 }}
                animate={isNegative ? { rotate: [-5, 5, -5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {cfg.emoji}
              </motion.span>
              <div>
                <div style={{ fontSize: 12, color: cfg.accent, fontWeight: 600 }}>
                  {cfg.title}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#e8e8e8" }}>
                  {tile.name}
                </div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 12, color: "#555" }}>
                {currentPlayer?.name}
              </div>
            </div>

            {/* Instrukce */}
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${cfg.accent}33`,
              borderRadius: 12, padding: "16px",
              marginBottom: 16,
            }}>
              <p style={{
                fontSize: 15, color: "#ddd",
                lineHeight: 1.6, margin: 0,
                fontWeight: isNegative ? 500 : 400,
              }}>
                {instruction}
              </p>
            </div>

            {/* Penalizace info */}
            {isNegative && tile.penalty && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: "rgba(226,75,74,0.08)",
                  border: "1px solid rgba(226,75,74,0.25)",
                  borderRadius: 8, padding: "8px 12px",
                  fontSize: 12, color: "#F09595",
                  marginBottom: 16,
                }}
              >
                ⚡ Trest při nesplnění: {tile.penalty.description}
              </motion.div>
            )}

            {/* Odměna */}
            {tile.reward && (
              <div style={{
                background: "rgba(29,158,117,0.08)",
                border: "1px solid rgba(29,158,117,0.2)",
                borderRadius: 8, padding: "8px 12px",
                fontSize: 12, color: "#9FE1CB",
                marginBottom: 16,
              }}>
                🌟 Odměna za splnění: {tile.reward.description}
              </div>
            )}

            {/* Tlačítka */}
            <div style={{ display: "flex", gap: 10 }}>
              <motion.button
                onClick={handleComplete}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: "13px",
                  background: cfg.btnBg,
                  border: "none", borderRadius: 10,
                  color: "#fff", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {cfg.btnText}
              </motion.button>
              {isNegative && cfg.skipText && (
                <motion.button
                  onClick={handleSkip}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "13px 16px",
                    background: cfg.skipBg,
                    border: `1px solid ${cfg.accent}`,
                    borderRadius: 10,
                    color: cfg.skipColor,
                    fontSize: 12, fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {cfg.skipText}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
