// ActivityModal - policko Aktivita
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const TOPICS = [
  { type: "postava", name: "Noe",            hint: "Staval archu" },
  { type: "postava", name: "David",          hint: "Porazil Golias" },
  { type: "postava", name: "Josef",          hint: "Pestrobarevny plast" },
  { type: "postava", name: "Jonas",          hint: "Polknut rybou" },
  { type: "postava", name: "Mojzis",         hint: "Rozdelil more" },
  { type: "postava", name: "Jezis",          hint: "Chodil po vode" },
  { type: "postava", name: "Salomoun",       hint: "Nejchytrejsi kral" },
  { type: "postava", name: "Ester",          hint: "Zachranila svuj lid" },
  { type: "postava", name: "Elias",          hint: "Odletel na ohnivem voze" },
  { type: "postava", name: "Rut",            hint: "Zustala verna Naomi" },
  { type: "situace", name: "Krest",          hint: "Vstup do vody" },
  { type: "situace", name: "Modlitba",       hint: "Ruce k nebi" },
  { type: "situace", name: "Kazani u dveri", hint: "Klope na dvere" },
  { type: "situace", name: "Budovani archy", hint: "Velka lod" },
  { type: "situace", name: "Daniel v lvi jame", hint: "Lvi kolem klidny" },
  { type: "situace", name: "Stvoreni sveta",    hint: "Svetlo tma zvirata" },
  { type: "situace", name: "Posledni vecere",   hint: "Chleb vino dvanact" },
  { type: "situace", name: "Zazrak s chleby",   hint: "Pet chlebu dva ryby" },
];

const STYLES = [
  { id: "pantomima",  name: "Pantomima",  color: "#7B3FA5", instrukce: "Predvadej JMENO pouze pohybem a gesty. Zadna slova ani zvuky!" },
  { id: "popisovani", name: "Popisovani", color: "#378ADD", instrukce: "Vysvetli JMENO slovy. Nesmi zaznit jmeno postavy ani situace!" },
  { id: "malovani",   name: "Malovani",   color: "#D4537E", instrukce: "Nakresli JMENO na papir. Bez slov a pismen!" },
];

const TIME = 60;

// Faze: eyes_closed -> reveal -> hidden -> play -> result
const ActivityModal = () => {
  const showActivity   = useGameStore((s) => s.showActivity);
  const answerActivity = useGameStore((s) => s.answerActivity);
  const currentPlayer  = useGameStore((s) => s.players[s.currentPlayerIndex]);
  const { sounds }     = useSound();

  const [phase, setPhase]       = useState("eyes_closed");
  const [style, setStyle]       = useState(null);
  const [topic, setTopic]       = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showActivity) {
      setStyle(STYLES[Math.floor(Math.random() * STYLES.length)]);
      setTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
      setPhase("eyes_closed");
      setTimeLeft(TIME);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showActivity]);

  const handleStart = () => {
    setPhase("play");
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase("result"); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleResult = (success) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (success) sounds.witnessSuccess?.();
    answerActivity(success);
    setPhase("eyes_closed");
  };

  if (!showActivity) return null;

  const styleColor = style?.color ?? "#7B3FA5";
  const urgent = timeLeft <= 15;
  const timerColor = urgent ? "#E24B4A" : timeLeft <= 30 ? "#EF9F27" : styleColor;
  const playerName = currentPlayer?.name ?? "Hrac";

  const instrText = style ? style.instrukce.replace("JMENO", topic?.name ?? "") : "";

  return (
    <AnimatePresence>
      <motion.div
        key="activity-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 420, maxHeight: "90dvh",
            background: "#0f0a1a", border: `1.5px solid ${styleColor}`,
            borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{
            background: `${styleColor}22`, padding: "14px 20px",
            borderBottom: `1px solid ${styleColor}44`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ color: styleColor, fontSize: 15, fontWeight: 700 }}>Aktivita</div>
              <div style={{ color: "#aaa", fontSize: 12 }}>{style?.name}</div>
            </div>
            {phase === "play" && (
              <motion.div
                animate={urgent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ fontSize: 32, fontWeight: 700, color: timerColor, fontFamily: "monospace" }}
              >
                {timeLeft}
              </motion.div>
            )}
          </div>

          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

            {/* FAZE 1: Ostatni zavreli oci */}
            {phase === "eyes_closed" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}
              >
                <div style={{ fontSize: 48 }}>
                  {phase === "eyes_closed" ? String.fromCodePoint(0x1F440) : ""}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Ostatni zavreli oci!
                </div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                  Pouze <strong style={{ color: styleColor }}>{playerName}</strong> se diva na obrazovku.
                  Ostatni hraci zavreli oci nebo se otocili.
                </div>
                <motion.button
                  onClick={() => setPhase("reveal")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    padding: "14px 28px", background: styleColor, border: "none",
                    borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: `0 0 20px ${styleColor}60`,
                  }}
                >
                  Jsem pripraveny/a - ukazat tema
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 2: Tema je videt - jen hrac na tahu */}
            {phase === "reveal" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}
              >
                <div style={{ fontSize: 11, color: "#666", fontWeight: 600, letterSpacing: 1 }}>
                  {topic?.type === "postava" ? "BIBLICKA POSTAVA" : "BIBLICKA SITUACE"}
                </div>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  style={{
                    fontSize: 36, fontWeight: 900, color: "#fff",
                    background: `${styleColor}22`, border: `2px solid ${styleColor}`,
                    borderRadius: 16, padding: "20px 32px",
                  }}
                >
                  {topic?.name}
                </motion.div>
                <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
                  Napoveda: {topic?.hint}
                </div>
                <div style={{
                  fontSize: 13, color: styleColor, fontWeight: 600,
                  padding: "10px 16px", background: `${styleColor}15`,
                  borderRadius: 10, lineHeight: 1.6,
                }}>
                  {instrText}
                </div>
                <motion.button
                  onClick={() => setPhase("hidden")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "12px 24px", background: "#1a1a2a",
                    border: "1.5px solid #333", borderRadius: 12,
                    color: "#888", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Schovat - ostatni mohou otevrit oci
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 3: Tema skryto - cekani na start */}
            {phase === "hidden" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}
              >
                <div style={{ fontSize: 48 }}>
                  {String.fromCodePoint(0x1F440)}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Ostatni mohou otevrit oci!
                </div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                  <strong style={{ color: styleColor }}>{playerName}</strong> zna tema.
                  Stisknete START az budete vsichni pripraveni.
                </div>
                <div style={{
                  fontSize: 13, color: "#666",
                  padding: "10px 16px", background: "rgba(255,255,255,0.04)",
                  borderRadius: 10,
                }}>
                  Styl: <strong style={{ color: styleColor }}>{style?.name}</strong>
                </div>
                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    padding: "14px 32px", background: styleColor, border: "none",
                    borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    boxShadow: `0 0 20px ${styleColor}60`,
                  }}
                >
                  START - {TIME}s
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 4: Hra probiha */}
            {phase === "play" && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>Cas bezi... ostatni hadaji!</div>
                <motion.button
                  onClick={() => setPhase("result")}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "10px 20px", background: "transparent",
                    border: "1px solid #333", borderRadius: 10,
                    color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Ukoncit drive
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 5: Vysledek */}
            {(phase === "result") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div style={{ fontSize: 13, color: "#888", textAlign: "center", marginBottom: 4 }}>
                  Uhadli ostatni spravnou odpoved?
                </div>
                <div style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 8 }}>
                  Bylo to: <strong style={{ color: styleColor }}>{topic?.name}</strong>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <motion.button
                    onClick={() => handleResult(true)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    style={{
                      flex: 1, padding: "13px", background: "#0a2a1a",
                      border: "1.5px solid #1D9E75", borderRadius: 10,
                      color: "#9FE1CB", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Uhadli!
                  </motion.button>
                  <motion.button
                    onClick={() => handleResult(false)}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    style={{
                      flex: 1, padding: "13px", background: "#1a0a0a",
                      border: "1.5px solid #E24B4A", borderRadius: 10,
                      color: "#F09595", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    Neuhadli
                  </motion.button>
                </div>
              </motion.div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityModal;
