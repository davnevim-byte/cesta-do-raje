// ============================================================
//  GameScreen — hlavní herní obrazovka
// ============================================================

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import GameBoard3D from "../board/GameBoard3D";
import DiceRoller3D from "../board/DiceRoller3D";
import BoardPlayers from "../board/BoardPlayers";
import { Timer } from "../ui/Scoreboard";
import { FlashOverlay } from "../ui/FlashOverlay";
import InnerCircleTransition from "../ui/InnerCircleTransition";
import QuestionModal from "../modals/QuestionModal";
import WitnessingModal from "../modals/WitnessingModal";
import { TileModal } from "../modals/TileModal";
import WildCardModal from "../modals/WildCardModal";
import { useMusic } from "../../hooks/useMusic";
import { DisplaySizeControl } from "../ui/DisplaySizeControl";
import ServiceModal from "../modals/ServiceModal";
import CongregationModal from "../modals/CongregationModal";
import ActivityModal from "../modals/ActivityModal";
import GraceCardModal from "../modals/GraceCardModal";
import { useSound } from "../../hooks/useSound";

export const GameScreen = () => {
  const endGame    = useGameStore((s) => s.endGame);
  const difficulty = useGameStore((s) => s.difficulty);
  const players    = useGameStore((s) => s.players) ?? [];
  const curIdx     = useGameStore((s) => s.currentPlayerIndex);

  const graceCards  = useGameStore((s) => s.graceCards ?? 0);
  const deviceType  = useGameStore((s) => s.deviceType ?? "mobile");
  const isWide      = deviceType === "tablet" || deviceType === "tv";
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

  // helpers jako proměnné (ne komponenty) aby nedošlo k problémům s exportem
  const modalsJSX = (
    <>
      <FlashOverlay />
      <QuestionModal />
      <WitnessingModal />
      <TileModal />
      <WildCardModal />
      <ServiceModal />
      <CongregationModal />
      <ActivityModal />
      <GraceCardModal />
      <DisplaySizeControl />
      <AnimatePresence>
        {transition.show && transition.player && (
          <InnerCircleTransition
            key="inner-transition"
            player={transition.player}
            onDone={() => setTransition({ show: false, player: null })}
          />
        )}
      </AnimatePresence>
    </>
  );

  const endButtonJSX = (fontSize) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {graceCards > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "3px 8px",
          background: "rgba(212,172,13,0.15)",
          border: "1px solid rgba(212,172,13,0.3)",
          borderRadius: 10, fontSize: fontSize - 1, color: "#FAC775",
        }}>
          🌿 {graceCards}x
        </div>
      )}
      <button
        onClick={() => { if (window.confirm("Ukoncit hru?")) { stop(); endGame("manual"); } }}
        style={{
          padding: "5px 10px", background: "transparent",
          border: "1px solid #333", borderRadius: 8,
          color: "#555", fontSize: fontSize, cursor: "pointer",
          fontFamily: "inherit", minHeight: "auto",
        }}
      >X</button>
    </div>
  );

  // ════════════════════════════════════════════════════════════
  // WIDE LAYOUT — PC / Tablet / TV
  // Deska vlevo na plnou výšku, UI panel vpravo
  // ════════════════════════════════════════════════════════════
  if (isWide) {
    const panelW = deviceType === "tv" ? 320 : 280;
    const fontSize = deviceType === "tv" ? 15 : 13;

    return (
      <div style={{
        width: "100vw", height: "100dvh",
        display: "flex", flexDirection: "row",
        background: "#060810",
        userSelect: "none", WebkitUserSelect: "none",
        overflow: "hidden",
      }}>

        {/* DESKA — zabere zbytek šířky */}
        <div style={{
          flex: 1, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          <GameBoard3D />
        </div>

        {/* UI PANEL — pravá strana */}
        <div style={{
          width: panelW,
          height: "100dvh",
          background: "rgba(6,8,14,0.96)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column",
          flexShrink: 0,
          overflowY: "auto",
        }}>

          {/* Header */}
          <div style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: fontSize, fontWeight: 600, color: "#9FE1CB" }}>
                Cesta do Raje
              </div>
              <div style={{
                fontSize: fontSize - 3, color: "#0F6E56",
                background: "rgba(15,110,86,0.12)",
                padding: "1px 6px", borderRadius: 8, display: "inline-block", marginTop: 2,
              }}>
                {diffLabel}
              </div>
            </div>
            {endButtonJSX(fontSize - 1)}
          </div>

          {/* Timer */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex", justifyContent: "center",
          }}>
            <Timer />
          </div>

          {/* Hráči */}
          <div style={{
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            flex: "0 0 auto",
          }}>
            <BoardPlayers inline={true} />
          </div>

          {/* Kostka */}
          <div style={{ padding: "8px 16px", flex: 1 }}>
            <DiceRoller3D />
          </div>

        </div>

        {modalsJSX}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // MOBILE LAYOUT — původní svislý layout
  // ════════════════════════════════════════════════════════════
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
            Cesta do Raje
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
          {graceCards > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "3px 8px",
              background: "rgba(212,172,13,0.15)",
              border: "1px solid rgba(212,172,13,0.3)",
              borderRadius: 10, fontSize: 11, color: "#FAC775",
            }}>
              🌿 {graceCards}x
            </div>
          )}
          <Timer />
          <button
            onClick={() => { if (window.confirm("Ukoncit hru?")) { stop(); endGame("manual"); } }}
            style={{
              padding: "5px 10px", background: "transparent",
              border: "1px solid #333", borderRadius: 8,
              color: "#555", fontSize: 12, cursor: "pointer",
              fontFamily: "inherit", minHeight: "auto",
            }}
          >X</button>
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

      {modalsJSX}
    </div>
  );
};
