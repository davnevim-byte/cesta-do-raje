// ============================================================
//  App.jsx — kořenová komponenta
// ============================================================

import { useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "./store/gameStore";
import { LoginScreen } from "./components/screens/LoginScreen";
import { SetupScreen } from "./components/screens/SetupScreen";
import { GameScreen }  from "./components/screens/GameScreen";
import { EndScreen }   from "./components/screens/EndScreen";

// Fallback při načítání 3D scény
const Loading3D = () => (
  <div style={{
    minHeight: "100dvh", background: "#060810",
    display: "flex", alignItems: "center",
    justifyContent: "center", flexDirection: "column", gap: 16,
  }}>
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ fontSize: 48 }}
    >🌿</motion.div>
    <p style={{ color: "#1D9E75", fontSize: 13, letterSpacing: 2 }}>
      NAČÍTÁM SVĚT...
    </p>
  </div>
);

// Onboarding — průvodce pravidly
const OnboardingScreen = () => {
  const finishOnboarding = useGameStore((s) => s.finishOnboarding);
  const steps = [
    { emoji: "🌍", title: "Vnější kruh — svět",  desc: "Startuj ve světě plném pokušení. Vyhni se negativním políčkům a hledej Dveře." },
    { emoji: "🚪", title: "Dveře — svědectví",   desc: "Přistáš-li na Dveřích, zahraješ scénář svědectví. Úspěch = vstup do sboru!" },
    { emoji: "🏘️", title: "Vnitřní kruh — sbor", desc: "Ve sboru se duchově rosteš přes studium, modlitbu a shromáždění. Cílem je Ráj." },
    { emoji: "🍇", title: "Ovoce ducha",         desc: "Za každou dobrou akci získáváš ovoce ducha. Na konci dostaneš unikátní titul!" },
    { emoji: "🎲", title: "Divoké karty",        desc: "Během hry mohou přijít překvapivé divoké karty — připrav se na nečekané!" },
  ];

  const [step, setStep] = useState(0);
  const isLast  = step === steps.length - 1;
  const current = steps[step];

  return (
    <div style={{
      minHeight: "100dvh", background: "#060810",
      display: "flex", alignItems: "center",
      justifyContent: "center", padding: "24px",
    }}>
      <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ fontSize: 56, marginBottom: 16 }}>{current.emoji}</div>
            <h2 style={{ color: "#9FE1CB", fontSize: 22, fontWeight: 600, margin: "0 0 12px" }}>
              {current.title}
            </h2>
            <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6, margin: "0 0 32px" }}>
              {current.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? "#1D9E75" : "#222",
              transition: "all 0.2s",
            }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{
                padding: "12px 20px", background: "transparent",
                border: "1px solid #333", borderRadius: 10,
                color: "#666", fontSize: 14, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >← Zpět</button>
          )}
          <motion.button
            onClick={() => isLast ? finishOnboarding() : setStep((s) => s + 1)}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{
              flex: 1, padding: "12px",
              background: "#1D9E75", border: "none",
              borderRadius: 10, color: "#fff",
              fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {isLast ? "Začínáme! 🎮" : "Dále →"}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Přechodová animace
const Screen = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Root app
function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);

  return (
    <Suspense fallback={<Loading3D />}>
      <AnimatePresence mode="wait">
        {gamePhase === "login" && (
          <Screen key="login"><LoginScreen /></Screen>
        )}
        {gamePhase === "setup" && (
          <Screen key="setup"><SetupScreen /></Screen>
        )}
        {gamePhase === "onboarding" && (
          <Screen key="onboarding"><OnboardingScreen /></Screen>
        )}
        {gamePhase === "playing" && (
          <Screen key="playing"><GameScreen /></Screen>
        )}
        {gamePhase === "ended" && (
          <Screen key="ended"><EndScreen /></Screen>
        )}
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
