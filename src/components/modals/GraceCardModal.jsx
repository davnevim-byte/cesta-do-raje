// GraceCardModal - karta milosti pro negativni policko
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";

const GraceCardModal = () => {
  const showGraceCard   = useGameStore((s) => s.showGraceCard);
  const graceCards      = useGameStore((s) => s.graceCards);
  const useGraceCard    = useGameStore((s) => s.useGraceCard);
  const declineGraceCard = useGameStore((s) => s.declineGraceCard);
  const currentPlayer   = useGameStore((s) => s.players[s.currentPlayerIndex]);

  if (!showGraceCard) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="grace-overlay"
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
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 380,
            background: "linear-gradient(135deg, #0a1a0f 0%, #1a1205 100%)",
            border: "2px solid #d4ac0d",
            borderRadius: 20, padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 0 40px rgba(212,172,13,0.3)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 3, -3, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 48, marginBottom: 16 }}
          >
            🌿
          </motion.div>

          <div style={{ fontSize: 20, fontWeight: 700, color: "#d4ac0d", marginBottom: 8 }}>
            Karta milosti!
          </div>

          <div style={{ fontSize: 14, color: "#FAC775", marginBottom: 6 }}>
            {currentPlayer?.name} mas {graceCards} {graceCards === 1 ? "kartu" : "karty"} milosti
          </div>

          <div style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>
            Jehova ti zehna! Muzes pouzit kartu milosti a preskocit toto negativni policko — nebo se mu postavit.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <motion.button
              onClick={useGraceCard}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px",
                background: "linear-gradient(135deg, #1a3a0a, #0a2a05)",
                border: "1.5px solid #d4ac0d",
                borderRadius: 12, color: "#FAC775",
                fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 0 16px rgba(212,172,13,0.2)",
              }}
            >
              Pouzit kartu milosti ({graceCards}x)
            </motion.button>

            <motion.button
              onClick={declineGraceCard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "12px",
                background: "transparent",
                border: "1px solid #333",
                borderRadius: 12, color: "#555",
                fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Nepoužívat — splnit úkol
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GraceCardModal;
