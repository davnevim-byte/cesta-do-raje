// ============================================================
//  GameScreen — hlavní herní obrazovka
// ============================================================

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import GameBoard3D from "../board/GameBoard3D";
import BoardPlayers from "../board/BoardPlayers";
import { Timer } from "../ui/Scoreboard";
import { FlashOverlay } from "../ui/FlashOverlay";
import InnerCircleTransition from "../ui/InnerCircleTransition";
import QuestionModal from "../modals/QuestionModal";
import WitnessingModal from "../modals/WitnessingModal";
import { TileModal } from "../modals/TileModal";
import WildCardModal from "../modals/WildCardModal";
import { useMusic } from "../../hooks/useMusic";
import { useSound } from "../../hooks/useSound";

export const GameScreen = () => {
  const endGame    = useGameStore((s) => s.endGame);
  const difficulty = useGameStore((s) => s.difficulty);
  const players    = useGameStore((s) => s.players) ?? [];
  const curIdx     = useGameStore((s) => s.currentPlayerIndex);

  const { switchToZone, init, stop } = useMusic();
  const { sounds } = useSound();

  // Přechod do sboru
  const [transition, setTransition] = useState({ show: false, player: null });

  // Prevstate pro detekci circle změny
  const prevCircles = useRef({});
  const musicInited = useRef(false);

  const diffLabel = { EASY: "Snadná", MEDIUM: "Střední", HARD: "Těžká" }[difficulty] ?? difficulty;

  // ── Inicializace hudby při prvním dotyku ─────────────────
  useEffect(() => {
    const handleFirst = () => {
      if (musicInited.current) return;
      musicInited.current = true;
      init();
      const p = players[curIdx];
      switchToZone(p?.circle === "inner" ? "inner" : "outer");
    };
    window.addEventListener("pointerdown", handleFirst, { once: true });
    return () => window.removeEventListener("pointerdown", handleFirst);
  }, []);

  // ── Přepínání hudby dle zóny ─────────────────────────────
  useEffect(() => {
    if (!musicInited.current) return;
    const p = players[curIdx];
    if (!p) return;
    switchToZone(p.circle === "inner" ? "inner" : "outer");
  }, [curIdx, players]);

  // ── Inicializace prevCircles při prvním renderu ───────────
  // Zajišťuje že existující hráči ve sboru nevyvolají false trigger
  useEffect(() => {
    players.forEach((p) => {
      if (prevCircles.current[p.id] === undefined) {
        prevCircles.current[p.id] = p.circle;
      }
    });
  }, []); // jen jednou při mountu

  // ── Detekce přechodu outer → inner ───────────────────────
  useEffect(() => {
    players.forEach((p) => {
      const prev = prevCircles.current[p.id];
      if (prev === "outer" && p.circle === "inner") {
        sounds.innerCircle();
        setTransition({ show: true, player: p });
      }
      prevCircles.current[p.id] = p.circle;
    });
  }, [players]);

  // ── Cleanup hudby při odchodu ─────────────────────────────
  useEffect(() => () => stop(), []);

  return (
    <div style={{
      minHeight:        "100dvh",
      background:       "#060810",
      display:          "flex",
      flexDirection:    "column",
      userSelect:       "none",
      WebkitUserSelect: "none",
    }}>

      {/* TOP BAR */}
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        padding:        "8px 14px",
        borderBottom:   "1px solid rgba(255,255,255,0.05)",
        background:     "#06080e",
        position:       "sticky",
        top:            0,
        zIndex:         50,
        flexShrink:     0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🌿</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#9FE1CB" }}>
            Cesta do Ráje
          </span>
          <span style={{
            fontSize: 10, color: "#0F6E56",
            background: "rgba(15,110,86,0.12)",
            padding: "2px 7px", borderRadius: 10,
          }}>
            {diffLabel}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Timer />
          <button
            onClick={() => {
              if (window.confirm("Ukončit hru?")) { stop(); endGame("manual"); }
            }}
            style={{
              padding: "5px 10px", background: "transparent",
              border: "1px solid #333", borderRadius: 8,
              color: "#555", fontSize: 12, cursor: "pointer",
              fontFamily: "inherit", minHeight: "auto",
            }}
          >✕</button>
        </div>
      </div>

      {/* HERNÍ DESKA */}
      <div style={{
        flex: 1, display: "flex",
        alignItems: "center", justifyContent: "center",
        padding: "8px", minWidth: 0, overflowY: "auto",
      }}>
        <GameBoard3D />
      </div>

      {/* AVATARY HRÁČŮ */}
      <BoardPlayers />

      {/* MODALY */}
      <FlashOverlay />
      <QuestionModal />
      <WitnessingModal />
      <TileModal />
      <WildCardModal />

      {/* PŘECHOD DO SBORU */}
      <AnimatePresence>
        {transition.show && transition.player && (
          <InnerCircleTransition
            key="inner-transition"
            player={transition.player}
            onDone={() => setTransition({ show: false, player: null })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
