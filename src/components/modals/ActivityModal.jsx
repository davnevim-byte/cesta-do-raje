// ActivityModal - policko Aktivita
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const TOPICS = [
  { type: "postava", name: "Noe",        hint: "Staval archu" },
  { type: "postava", name: "David",      hint: "Porazil Golias prakem" },
  { type: "postava", name: "Josef",      hint: "Mel pestrobarevny plast" },
  { type: "postava", name: "Jonas",      hint: "Byl polknut velkou rybou" },
  { type: "postava", name: "Mojzis",     hint: "Rozdelil more" },
  { type: "postava", name: "Jezis",      hint: "Chodil po vode" },
  { type: "postava", name: "Salomoun",   hint: "Nejchytrejsi kral" },
  { type: "postava", name: "Ester",      hint: "Zachranila svuj lid" },
  { type: "postava", name: "Elias",      hint: "Odletel na ohnivem voze" },
  { type: "postava", name: "Rut",        hint: "Zustala verna Naomi" },
  { type: "situace", name: "Krest",            hint: "Vstup do vody" },
  { type: "situace", name: "Modlitba",          hint: "Sepjate ruce k nebi" },
  { type: "situace", name: "Kazani u dveri",    hint: "Klope na dvere s Bibli" },
  { type: "situace", name: "Budovani archy",    hint: "Tesani dreva velka lod" },
  { type: "situace", name: "Daniel v lvi jame", hint: "Obklopen lvy klidny" },
  { type: "situace", name: "Stvoreni sveta",    hint: "Svetlo tma zvirata clovek" },
  { type: "situace", name: "Posledni vecere",   hint: "Chleb vino stul dvanact" },
  { type: "situace", name: "Zazrak s chleby",   hint: "Pet chlebu dva ryby" },
];

const STYLES = [
  { id: "pantomima",  name: "Pantomima",  desc: "Bez slov jen pohybem",    color: "#7B3FA5" },
  { id: "popisovani", name: "Popisovani", desc: "Slovne bez jmena",         color: "#378ADD" },
  { id: "malovani",   name: "Malovani",   desc: "Nakresli ostatni hadaji",  color: "#D4537E" },
];

const TIME = 60;

const ActivityModal = () => {
  const showActivity   = useGameStore((s) => s.showActivity);
  const answerActivity = useGameStore((s) => s.answerActivity);
  const { sounds }     = useSound();

  const [phase, setPhase]       = useState("draw");
  const [style, setStyle]       = useState(null);
  const [topic, setTopic]       = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showActivity) {
      setStyle(STYLES[Math.floor(Math.random() * STYLES.length)]);
      setTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
      setPhase("draw");
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
    setPhase("draw");
  };

  if (!showActivity) return null;

  const styleColor = style?.color ?? "#7B3FA5";
  const urgent = timeLeft <= 15;
  const timerColor = urgent ? "#E24B4A" : timeLeft <= 30 ? "#EF9F27" : styleColor;

  return (
    <AnimatePresence>
      <motion.div
        key="activity-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 460, maxHeight: "90dvh",
            background: "#0f0a1a", border: `1.5px solid ${styleColor}`,
            borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
          }}
        >
          <div style={{
            background: `${styleColor}18`, padding: "14px 20px",
            borderBottom: `1px solid ${styleColor}33`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ color: styleColor, fontSize: 14, fontWeight: 700 }}>Aktivita</div>
              <div style={{ color: "#aaa", fontSize: 12 }}>{style?.name} - {style?.desc}</div>
            </div>
            {phase === "play" && (
              <motion.div
                animate={urgent ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ fontSize: 28, fontWeight: 700, color: timerColor, fontFamily: "monospace" }}
              >
                {timeLeft}
              </motion.div>
            )}
          </div>

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
            <div style={{
              background: `${styleColor}15`, border: `2px solid ${styleColor}40`,
              borderRadius: 14, padding: "20px", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 8, fontWeight: 600 }}>
                {topic?.type === "postava" ? "BIBLICKA POSTAVA" : "BIBLICKA SITUACE"}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                {topic?.name}
              </div>
              <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>
                Napoveda: {topic?.hint}
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${styleColor}30`,
              borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#ccc", lineHeight: 1.6,
            }}>
              {style?.id === "pantomima" && (
                <span><strong style={{ color: styleColor }}>Pantomima:</strong> Predvadej <strong>{topic?.name}</strong> pouze pohybem. Zadna slova. Ostatni hadaji!</span>
              )}
              {style?.id === "popisovani" && (
                <span><strong style={{ color: styleColor }}>Popisovani:</strong> Vysvetli <strong>{topic?.name}</strong> slovy bez jmena. Ostatni hadaji!</span>
              )}
              {style?.id === "malovani" && (
                <span><strong style={{ color: styleColor }}>Malovani:</strong> Nakresli <strong>{topic?.name}</strong> bez slov. Ostatni hadaji!</span>
              )}
            </div>

            {phase === "draw" && (
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  padding: "14px", background: styleColor, border: "none",
                  borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", boxShadow: `0 0 20px ${styleColor}60`,
                }}
              >
                START - {TIME}s
              </motion.button>
            )}

            {phase === "play" && (
              <div style={{ padding: "12px", background: "rgba(255,255,255,0.04)", borderRadius: 10, textAlign: "center", fontSize: 13, color: "#666" }}>
                Cas bezi... ostatni hadaji!
              </div>
            )}

            {(phase === "result" || phase === "play") && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {phase === "result" && (
                  <div style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
                    Uhadli ostatni hrace spravnou odpoved?
                  </div>
                )}
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
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityModal;
