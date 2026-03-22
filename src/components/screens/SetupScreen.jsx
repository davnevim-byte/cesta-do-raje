// ============================================================
//  SetupScreen — nastavení hry
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore, AVATARS } from "../../store/gameStore";
import { AVATAR_CONFIGS, getAvatarComponent } from "../board/AvatarSVG";
import AvatarPicker from "../board/AvatarPicker";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 10;

export const SetupScreen = () => {
  const startGame = useGameStore((s) => s.startGame);

  const [playerCount, setPlayerCount] = useState(3);
  const [names,       setNames]       = useState(Array(10).fill(""));
  const [avatars,     setAvatars]     = useState(AVATARS.map((a) => a.id));
  const [difficulty,  setDifficulty]  = useState("EASY");
  const [timer,       setTimer]       = useState(60);
  const [step,        setStep]        = useState(0); // 0 = zařízení, 1 = hráči, 2 = nastavení
  const [deviceType,  setDeviceType]  = useState(null);
  const [quickMode,   setQuickMode]   = useState(false);
  const [loading,     setLoading]     = useState(false);

  const setDeviceTypeStore = useGameStore((s) => s.setDeviceType);
  const setQuickModeStore  = useGameStore((s) => s.setQuickMode);

  const handleStart = () => {
    setLoading(true);
    const validNames = names.slice(0, playerCount);
    setDeviceTypeStore(deviceType ?? "mobile");
    // Kratka pauza aby loading screen byl videt
    setTimeout(() => {
      startGame(playerCount, validNames, avatars.slice(0, playerCount), difficulty, quickMode ? 20 : timer, quickMode);
    }, 800);
  };

  const difficultyOptions = [
    { key: "EASY",   label: "Snadná",  color: "#1D9E75", desc: "Pro rodiny a začátečníky" },
    { key: "MEDIUM", label: "Střední", color: "#EF9F27", desc: "Dobrá znalost Bible" },
    { key: "HARD",   label: "Těžká",   color: "#E24B4A", desc: "Pro pokročilé studenty" },
  ];

  const timerOptions = [30, 45, 60, 90, 120];
  const gameModeOptions = [
    { key: false, label: "Klasická hra", desc: "Plná deska, všechna políčka", emoji: "🎯" },
    { key: true,  label: "Rychlá hra",  desc: "Pro děti — kratší trasa, jednodušší", emoji: "⚡" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060810",
      padding: "24px 16px",
      overflowY: "auto",
    }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: 28 }}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>🎮</div>
          <h2 style={{ color: "#9FE1CB", fontSize: 22, fontWeight: 600, margin: 0 }}>
            Nastavení hry
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: "#666", marginBottom: 4 }}>
                  Na jakém zařízení hrajete?
                </div>
                <div style={{ fontSize: 12, color: "#444" }}>
                  Podle toho se přizpůsobí rozložení hry
                </div>
              </div>

              {[
                { id: "mobile",  emoji: "📱", label: "Telefon",       desc: "Svislý layout, kompaktní" },
                { id: "tablet",  emoji: "💻", label: "PC / Tablet",   desc: "Boční panel, větší deska" },
                { id: "tv",      emoji: "📺", label: "TV / Projektor",desc: "Maximální velikost, velké UI" },
              ].map((device) => (
                <motion.button
                  key={device.id}
                  onClick={() => { setDeviceType(device.id); setDeviceTypeStore(device.id); setStep(1); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "18px 20px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", width: "100%",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.border = "1px solid rgba(29,158,117,0.4)"}
                  onMouseLeave={(e) => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"}
                >
                  <span style={{ fontSize: 32 }}>{device.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#9FE1CB", marginBottom: 2 }}>
                      {device.label}
                    </div>
                    <div style={{ fontSize: 12, color: "#555" }}>{device.desc}</div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Počet hráčů */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "16px",
              }}>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                  Počet hráčů
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={() => setPlayerCount((n) => Math.max(MIN_PLAYERS, n - 1))}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid #333", color: "#aaa",
                      fontSize: 18, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >−</button>
                  <span style={{
                    fontSize: 28, fontWeight: 700,
                    color: "#9FE1CB", minWidth: 40,
                    textAlign: "center",
                  }}>
                    {playerCount}
                  </span>
                  <button
                    onClick={() => setPlayerCount((n) => Math.min(MAX_PLAYERS, n + 1))}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid #333", color: "#aaa",
                      fontSize: 18, cursor: "pointer", fontFamily: "inherit",
                    }}
                  >+</button>
                  <span style={{ fontSize: 12, color: "#444" }}>hráčů (2–10)</span>
                </div>
              </div>

              {/* Jména hráčů */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "16px",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <div style={{ fontSize: 13, color: "#666" }}>Jména hráčů</div>
                {Array.from({ length: playerCount }).map((_, i) => {
                  return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flexShrink: 0, position: "relative" }}>
                      <AvatarPicker
                        value={avatars[i] ?? AVATAR_CONFIGS[i % AVATAR_CONFIGS.length].id}
                        onChange={(id) => {
                          const a = [...avatars];
                          a[i] = id;
                          setAvatars(a);
                        }}
                        playerName={names[i] || `Hráč ${i + 1}`}
                      />
                    </div>
                    <input
                      value={names[i]}
                      onChange={(e) => {
                        const n = [...names];
                        n[i] = e.target.value;
                        setNames(n);
                      }}
                      placeholder={`Hráč ${i + 1}`}
                      style={{
                        flex: 1, padding: "10px 12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid #222",
                        borderRadius: 8, color: "#e8e8e8",
                        fontSize: 16, fontFamily: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>
                  );
                })}
              </div>

              <motion.button
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: "14px", background: "#1D9E75",
                  border: "none", borderRadius: 12, color: "#fff",
                  fontSize: 15, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Dále — nastavení hry →
              </motion.button>
            </motion.div>

          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Rychla vs klasicka hra */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "16px",
              }}>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                  Typ hry
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {gameModeOptions.map((m) => (
                    <motion.button
                      key={String(m.key)}
                      onClick={() => setQuickMode(m.key)}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        flex: 1, padding: "12px 8px",
                        background: quickMode === m.key ? "rgba(29,158,117,0.15)" : "transparent",
                        border: `1.5px solid ${quickMode === m.key ? "#1D9E75" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 10, cursor: "pointer",
                        fontFamily: "inherit", textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 4 }}>{m.emoji}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: quickMode === m.key ? "#9FE1CB" : "#666" }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>
                        {m.desc}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

            {/* Obtížnost */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "16px",
              }}>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                  Obtížnost otázek
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {difficultyOptions.map((opt) => (
                    <div
                      key={opt.key}
                      onClick={() => setDifficulty(opt.key)}
                      style={{
                        padding: "12px 14px",
                        background: difficulty === opt.key ? `${opt.color}18` : "transparent",
                        border: `1.5px solid ${difficulty === opt.key ? opt.color : "#222"}`,
                        borderRadius: 10, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 12,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: 12, height: 12, borderRadius: "50%",
                        background: opt.color, flexShrink: 0,
                      }} />
                      <div>
                        <div style={{
                          fontSize: 13, fontWeight: difficulty === opt.key ? 600 : 400,
                          color: difficulty === opt.key ? opt.color : "#aaa",
                        }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: 11, color: "#555" }}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Časovač */}
              <div style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "16px",
              }}>
                <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
                  Délka hry
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {timerOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimer(t)}
                      style={{
                        padding: "8px 16px",
                        background: timer === t ? "#1D9E75" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${timer === t ? "#1D9E75" : "#222"}`,
                        borderRadius: 8, cursor: "pointer",
                        color: timer === t ? "#fff" : "#888",
                        fontSize: 13, fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                    >
                      {t} min
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 8 }}>
                  {timer <= 45 ? "Krátká hra" : timer <= 60 ? "Normální hra" : "Epická hra"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: "14px 20px",
                    background: "transparent",
                    border: "1px solid #333",
                    borderRadius: 12, color: "#666",
                    fontSize: 14, cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ← Zpět
                </button>
                <motion.button
                  onClick={handleStart}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1, padding: "14px",
                    background: "#1D9E75", border: "none",
                    borderRadius: 12, color: "#fff",
                    fontSize: 15, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  🎮 Spustit hru!
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
