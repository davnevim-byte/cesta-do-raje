// BonusRoundModal - bonus kolo kdyz vsichni projdou Startem
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const BONUS_QUESTIONS = [
  { q: "Kdo byl prvni clovek?", a: "Adam" },
  { q: "Jak se jmenuji prvni zena?", a: "Eva" },
  { q: "Kolik apostolu mel Jezis?", a: "Dvanact" },
  { q: "Ve ktere rece byl pokrten Jezis?", a: "Jordan" },
  { q: "Kdo napsal knihu Zjevenou?", a: "Jan" },
  { q: "Jak se jmenoval otec viry?", a: "Abraham" },
  { q: "Kde se narodil Jezis?", a: "Betlem" },
  { q: "Jaka je prvni kniha Bible?", a: "1 Mojzisova" },
  { q: "Kolik knih ma Bible?", a: "Sesdesatsest" },
  { q: "Kdo napsal zaltare?", a: "David" },
];

const BonusRoundModal = () => {
  const showBonusRound  = useGameStore((s) => s.showBonusRound);
  const closeBonusRound = useGameStore((s) => s.closeBonusRound);
  const players         = useGameStore((s) => s.players) ?? [];
  const { sounds }      = useSound();

  if (!showBonusRound) return null;

  const q = BONUS_QUESTIONS[Math.floor(Math.random() * BONUS_QUESTIONS.length)];

  const handleClose = () => {
    sounds.witnessSuccess?.();
    closeBonusRound();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="bonus-overlay"
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
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.45, ease: "backOut" }}
          style={{
            width: "100%", maxWidth: 420,
            background: "linear-gradient(135deg, #0a1a10, #0f2a08)",
            border: "2px solid #d4ac0d",
            borderRadius: 20, padding: "28px 24px",
            textAlign: "center",
            boxShadow: "0 0 50px rgba(212,172,13,0.3)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 5, -5, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: 52, marginBottom: 12 }}
          >
            *
          </motion.div>

          <div style={{ fontSize: 22, fontWeight: 800, color: "#d4ac0d", marginBottom: 6 }}>
            BONUS KOLO!
          </div>

          <div style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
            Vsichni hrace jiz prosli Startem!
            Cas na bonus kolo - kdo odpovi nejrychleji?
          </div>

          <div style={{
            background: "rgba(212,172,13,0.1)",
            border: "1.5px solid rgba(212,172,13,0.3)",
            borderRadius: 14, padding: "18px 20px", marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 8, fontWeight: 600 }}>
              BIBLICKA OTAZKA - kdo odpovi nejrychleji?
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.5 }}>
              {q.q}
            </div>
          </div>

          <div style={{
            background: "rgba(29,158,117,0.1)",
            border: "1px solid rgba(29,158,117,0.2)",
            borderRadius: 10, padding: "10px 16px", marginBottom: 20,
            fontSize: 13, color: "#5DCAA5",
          }}>
            Spravna odpoved: <strong style={{ color: "#9FE1CB" }}>{q.a}</strong>
          </div>

          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>
            Vitez ziskava bonusovy posun o 3 policka vpred!
          </div>

          <motion.button
            onClick={handleClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "13px 28px",
              background: "#d4ac0d",
              border: "none", borderRadius: 12,
              color: "#0a0a05", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Pokracovat ve hre
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BonusRoundModal;
