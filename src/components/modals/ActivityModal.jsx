// ActivityModal - policko Aktivita (4 styly: Pantomima / Popisovani / Malovani / Kviz)
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";

const TOPICS = [
  { type: "postava", name: "Noe",            hint: "Staval archu" },
  { type: "postava", name: "David",          hint: "Porazil Golias prakem" },
  { type: "postava", name: "Josef",          hint: "Mel pestrobarevny plast" },
  { type: "postava", name: "Jonas",          hint: "Polknut rybou" },
  { type: "postava", name: "Mojzis",         hint: "Rozdelil more" },
  { type: "postava", name: "Jezis",          hint: "Chodil po vode" },
  { type: "postava", name: "Salomoun",       hint: "Nejchytrejsi kral" },
  { type: "postava", name: "Ester",          hint: "Zachranila svuj lid" },
  { type: "postava", name: "Elias",          hint: "Odletel na ohnivem voze" },
  { type: "postava", name: "Rut",            hint: "Zustala verna Naomi" },
  { type: "postava", name: "Abraham",        hint: "Otec viry, opustil Ur" },
  { type: "postava", name: "Pavel",          hint: "Psal dopisy sboruum" },
  { type: "postava", name: "Petr",           hint: "Odrekl Jezise trikrat" },
  { type: "postava", name: "Maria",          hint: "Matka Jezise" },
  { type: "situace", name: "Krest",          hint: "Vstup do vody" },
  { type: "situace", name: "Modlitba",       hint: "Ruce k nebi" },
  { type: "situace", name: "Kazani u dveri", hint: "Klepe na dvere" },
  { type: "situace", name: "Budovani archy", hint: "Velka lod" },
  { type: "situace", name: "Daniel v lvi jame", hint: "Lvi kolem klidny" },
  { type: "situace", name: "Stvoreni sveta",    hint: "Svetlo tma zvirata" },
  { type: "situace", name: "Posledni vecere",   hint: "Chleb vino dvanact" },
  { type: "situace", name: "Zazrak s chleby",   hint: "Pet chlebu dva ryby" },
];

const STYLES = [
  { id: "pantomima",  name: "Pantomima",  color: "#7B3FA5", desc: "Bez slov jen pohybem" },
  { id: "popisovani", name: "Popisovani", color: "#378ADD", desc: "Slovne bez jmena" },
  { id: "malovani",   name: "Malovani",   color: "#D4537E", desc: "Nakresli na papir" },
  { id: "kviz",       name: "Kviz",       color: "#EF9F27", desc: "Odpovez na otazky" },
];

const QUIZ_QUESTIONS = [
  { q: "Kolik dnu trvalo stvoreni podle Bible?", a: "Sest dnu (sedmy den byl odpocinku)", options: ["Ctyr dny", "Sest dnu", "Deset dnu", "Jeden den"], correct: 1 },
  { q: "Jak se jmenoval prvni clovek?", a: "Adam", options: ["Noe", "Abraham", "Adam", "Mojzis"], correct: 2 },
  { q: "Kolik apostolu mel Jezis?", a: "Dvanact", options: ["Sedm", "Deset", "Dvanact", "Patnaact"], correct: 2 },
  { q: "Ve ktere knize je pribeh o Danielovi v lvi jame?", a: "Daniel", options: ["Daniel", "Izajas", "Jeremias", "Zacharias"], correct: 0 },
  { q: "Jak se jmenoval otec Abrahamov?", a: "Terach", options: ["Noe", "Terach", "Lot", "Izak"], correct: 1 },
  { q: "Kdo napsal vetsinu dopisu v Novem zakone?", a: "Pavel", options: ["Petr", "Jan", "Pavel", "Juda"], correct: 2 },
  { q: "Jaka je prvni kniha Bible?", a: "1. Mojzisova (Genesis)", options: ["Exodus", "Zalmista", "1. Mojzisova", "Jan"], correct: 2 },
  { q: "Kolik knih ma Bible celkem?", a: "66", options: ["52", "66", "73", "80"], correct: 1 },
  { q: "Kde se narodil Jezis?", a: "Betlem", options: ["Nazaret", "Jeruzalem", "Betlem", "Jericho"], correct: 2 },
  { q: "Jak se jmenuje posledni kniha Bible?", a: "Zjeveni", options: ["Judasuv", "Zjeveni", "Skutky", "Hebrejum"], correct: 1 },
  { q: "Ktery zalmista napsal nejvice zalmu?", a: "David", options: ["Salomoun", "Mojzis", "David", "Asaf"], correct: 2 },
  { q: "Jaky byl prvni zazrak Jezise?", a: "Promena vody ve vino v Kane", options: ["Uzdraveni slepeho", "Krmeni 5000", "Promena vody ve vino", "Vzkriseni Lazara"], correct: 2 },
];

const TIME = 60;
const QUIZ_TIME = 30;

const ActivityModal = () => {
  const showActivity   = useGameStore((s) => s.showActivity);
  const answerActivity = useGameStore((s) => s.answerActivity);
  const currentPlayer  = useGameStore((s) => s.players[s.currentPlayerIndex]);
  const { sounds }     = useSound();

  const [phase, setPhase]           = useState("eyes_closed");
  const [style, setStyle]           = useState(null);
  const [topic, setTopic]           = useState(null);
  const [timeLeft, setTimeLeft]     = useState(TIME);
  const [quizQ, setQuizQ]           = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (showActivity) {
      const s = STYLES[Math.floor(Math.random() * STYLES.length)];
      setStyle(s);
      if (s.id === "kviz") {
        setQuizQ(QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]);
        setTimeLeft(QUIZ_TIME);
      } else {
        setTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
        setTimeLeft(TIME);
      }
      setPhase("eyes_closed");
      setQuizAnswer(null);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showActivity]);

  const handleStart = () => {
    setPhase("play");
    const duration = style?.id === "kviz" ? QUIZ_TIME : TIME;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase("result"); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleQuizAnswer = (idx) => {
    if (quizAnswer !== null) return;
    clearInterval(timerRef.current);
    setQuizAnswer(idx);
    setPhase("result");
  };

  const handleResult = (success) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (success) sounds.witnessSuccess?.();
    answerActivity(success);
    setPhase("eyes_closed");
    setQuizAnswer(null);
  };

  if (!showActivity) return null;

  const styleColor = style?.color ?? "#7B3FA5";
  const urgent = timeLeft <= 10;
  const timerColor = urgent ? "#E24B4A" : timeLeft <= 20 ? "#EF9F27" : styleColor;
  const playerName = currentPlayer?.name ?? "Hrac";
  const isQuiz = style?.id === "kviz";

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
            width: "100%", maxWidth: 460, maxHeight: "90dvh",
            background: "#0f0a1a", border: `1.5px solid ${styleColor}`,
            borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column",
          }}
        >
          <div style={{
            background: `${styleColor}22`, padding: "14px 20px",
            borderBottom: `1px solid ${styleColor}44`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <div style={{ color: styleColor, fontSize: 15, fontWeight: 700 }}>Aktivita</div>
              <div style={{ color: "#aaa", fontSize: 12 }}>{style?.name} - {style?.desc}</div>
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

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>

            {/* FAZE 1: Ostatni zavreli oci - jen pro nekvizove styly */}
            {phase === "eyes_closed" && !isQuiz && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}
              >
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                  Pouze <strong style={{ color: styleColor }}>{playerName}</strong> se diva na obrazovku.
                  Ostatni hraci zavreli oci nebo se otocili.
                </div>
                <motion.button onClick={() => setPhase("reveal")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ padding: "14px 28px", background: styleColor, border: "none",
                    borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", boxShadow: `0 0 20px ${styleColor}60` }}
                >
                  Jsem pripraveny/a - ukazat tema
                </motion.button>
              </motion.div>
            )}

            {/* KVIZ: primo ukaz otazku vsem */}
            {phase === "eyes_closed" && isQuiz && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}
              >
                <div style={{ fontSize: 13, color: "#888" }}>
                  Vsichni hraci odpovidaji. Kdo odpovi spravne nejrychleji ziskava bod!
                </div>
                <div style={{
                  background: `${styleColor}15`, border: `2px solid ${styleColor}40`,
                  borderRadius: 14, padding: "18px 20px", fontSize: 16, fontWeight: 700,
                  color: "#fff", textAlign: "center", lineHeight: 1.5,
                }}>
                  {quizQ?.q}
                </div>
                <motion.button onClick={handleStart}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ padding: "14px 28px", background: styleColor, border: "none",
                    borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", boxShadow: `0 0 20px ${styleColor}60` }}
                >
                  START - {QUIZ_TIME}s
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 2: Zobraz tema */}
            {phase === "reveal" && !isQuiz && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}
              >
                <div style={{ fontSize: 11, color: "#666", fontWeight: 600, letterSpacing: 1 }}>
                  {topic?.type === "postava" ? "BIBLICKA POSTAVA" : "BIBLICKA SITUACE"}
                </div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  style={{ fontSize: 36, fontWeight: 900, color: "#fff",
                    background: `${styleColor}22`, border: `2px solid ${styleColor}`,
                    borderRadius: 16, padding: "20px 32px" }}
                >
                  {topic?.name}
                </motion.div>
                <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
                  Napoveda: {topic?.hint}
                </div>
                <div style={{ fontSize: 13, color: styleColor, fontWeight: 600,
                  padding: "10px 16px", background: `${styleColor}15`, borderRadius: 10 }}
                >
                  {style?.id === "pantomima" && `Predvadej ${topic?.name} pouze pohybem. Zadna slova!`}
                  {style?.id === "popisovani" && `Vysvetli ${topic?.name} slovy bez jmena.`}
                  {style?.id === "malovani" && `Nakresli ${topic?.name} bez slov a pismen.`}
                </div>
                <motion.button onClick={() => setPhase("hidden")}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "12px 24px", background: "#1a1a2a",
                    border: "1.5px solid #333", borderRadius: 12,
                    color: "#888", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit" }}
                >
                  Schovat - ostatni mohou otevrit oci
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 3: Schovat tema */}
            {phase === "hidden" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Ostatni mohou otevrit oci!
                </div>
                <div style={{ fontSize: 13, color: "#888" }}>
                  <strong style={{ color: styleColor }}>{playerName}</strong> zna tema.
                  Stisknete START az budete vsichni pripraveni.
                </div>
                <div style={{ fontSize: 12, color: "#555", padding: "8px 14px",
                  background: "rgba(255,255,255,0.04)", borderRadius: 8 }}
                >
                  Styl: <strong style={{ color: styleColor }}>{style?.name}</strong>
                </div>
                <motion.button onClick={handleStart}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ padding: "14px 32px", background: styleColor, border: "none",
                    borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", boxShadow: `0 0 20px ${styleColor}60` }}
                >
                  START - {TIME}s
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 4a: Hra probiha - nekviz */}
            {phase === "play" && !isQuiz && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}
              >
                <div style={{ fontSize: 13, color: "#666" }}>Cas bezi... ostatni hadaji!</div>
                <motion.button onClick={() => setPhase("result")}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  style={{ padding: "8px 18px", background: "transparent",
                    border: "1px solid #333", borderRadius: 10,
                    color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                >
                  Ukoncit drive
                </motion.button>
              </motion.div>
            )}

            {/* FAZE 4b: Kviz - odpovedi */}
            {phase === "play" && isQuiz && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {quizQ?.options.map((opt, idx) => (
                  <motion.button key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "13px 16px",
                      background: "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${styleColor}44`,
                      borderRadius: 10, color: "#ccc",
                      fontSize: 14, fontWeight: 500,
                      cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* FAZE 5: Vysledek */}
            {phase === "result" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {isQuiz ? (
                  <>
                    <div style={{
                      padding: "14px", borderRadius: 10, textAlign: "center",
                      background: quizAnswer === quizQ?.correct ? "rgba(29,158,117,0.15)" : "rgba(226,75,74,0.1)",
                      border: `1.5px solid ${quizAnswer === quizQ?.correct ? "#1D9E75" : "#E24B4A"}`,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700,
                        color: quizAnswer === quizQ?.correct ? "#9FE1CB" : "#F09595" }}
                      >
                        {quizAnswer === quizQ?.correct ? "Spravne!" : "Nespravne"}
                      </div>
                      <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                        Spravna odpoved: <strong style={{ color: "#9FE1CB" }}>{quizQ?.options[quizQ?.correct]}</strong>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <motion.button onClick={() => handleResult(quizAnswer === quizQ?.correct)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                        style={{ flex: 1, padding: "13px", background: "#0a2a1a",
                          border: "1.5px solid #1D9E75", borderRadius: 10,
                          color: "#9FE1CB", fontSize: 14, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit" }}
                      >
                        {quizAnswer === quizQ?.correct ? "Ziskat bod!" : "Pokracovat"}
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 13, color: "#888", textAlign: "center" }}>
                      Uhadli ostatni spravnou odpoved?
                    </div>
                    <div style={{ fontSize: 14, color: "#555", textAlign: "center" }}>
                      Bylo to: <strong style={{ color: styleColor }}>{topic?.name}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <motion.button onClick={() => handleResult(true)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                        style={{ flex: 1, padding: "13px", background: "#0a2a1a",
                          border: "1.5px solid #1D9E75", borderRadius: 10,
                          color: "#9FE1CB", fontSize: 14, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Uhadli!
                      </motion.button>
                      <motion.button onClick={() => handleResult(false)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                        style={{ flex: 1, padding: "13px", background: "#1a0a0a",
                          border: "1.5px solid #E24B4A", borderRadius: 10,
                          color: "#F09595", fontSize: 14, fontWeight: 600,
                          cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Neuhadli
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityModal;
