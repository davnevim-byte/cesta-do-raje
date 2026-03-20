// ============================================================
//  useGameLogic — herní logika nad store
//  Pomocné funkce které komponenty potřebují
//  ale nepatří přímo do store
// ============================================================

import { useCallback } from "react";
import { useGameStore, selectCurrentPlayer, selectPlayers, AVATARS } from "../store/gameStore";
import { OUTER_TILES, INNER_TILES } from "../data/tiles";
import { FRUITS, getTopFruits, getTotalFruitScore } from "../data/fruitOfSpirit";

// ─────────────────────────────────────────────
//  HLAVNÍ HOOK
// ─────────────────────────────────────────────

export const useGameLogic = () => {
  const store = useGameStore();

  // ── Aktuální hráč ────────────────────────
  const currentPlayer = useGameStore(selectCurrentPlayer);
  const players       = useGameStore(selectPlayers);

  // ── Je na tahu hráč X? ───────────────────
  const isCurrentPlayer = useCallback(
    (playerIndex) => playerIndex === store.currentPlayerIndex,
    [store.currentPlayerIndex]
  );

  // ── Políčko hráče ────────────────────────
  const getPlayerTile = useCallback(
    (player) => {
      if (!player) return null;
      const tiles = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
      return tiles[player.position % tiles.length] ?? null;
    },
    []
  );

  // ── Avatar hráče ─────────────────────────
  const getPlayerAvatar = useCallback(
    (player) => AVATARS.find((a) => a.id === player?.avatarId) ?? AVATARS[0],
    []
  );

  // ── Pozice hráče na desce (0–1 pro SVG) ──
  const getPlayerAngle = useCallback(
    (player) => {
      if (!player) return 0;
      const tiles  = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
      const total  = tiles.length;
      return (player.position / total) * 360; // stupně
    },
    []
  );

  // ── Může hodit kostkou? ───────────────────
  const canRoll = useCallback(
    () =>
      store.gamePhase === "playing" &&
      store.diceRoll === null &&
      !store.isModalOpen() &&
      !store.isRolling,
    [store]
  );

  // ── Může potvrdit pohyb? ──────────────────
  const canConfirmMove = useCallback(
    () => store.diceRoll !== null && !store.isRolling && !store.isModalOpen(),
    [store]
  );

  // ── Formátovaný čas ──────────────────────
  const formattedTime = store.getFormattedTime();

  // ── Urgentní čas (poslední 2 minuty) ─────
  const isTimeUrgent = store.timeRemaining <= 120;

  // ── Hráč má přeskočit tah? ───────────────
  const willSkipTurn = currentPlayer?.skipTurnsRemaining > 0;

  // ── Hráči ve vnitřním kruhu ───────────────
  const innerPlayers = players.filter((p) => p.circle === "inner");

  // ── Hráči ve vnějším kruhu ────────────────
  const outerPlayers = players.filter((p) => p.circle === "outer");

  // ── Pořadí hráčů (dle pozice + kruhu) ────
  const playerRanking = [...players].sort((a, b) => {
    if (a.circle === "inner" && b.circle !== "inner") return -1;
    if (b.circle === "inner" && a.circle !== "inner") return 1;
    return b.position - a.position;
  });

  // ── Top ovoce pro hráče ───────────────────
  const getPlayerTopFruits = useCallback(
    (player, count = 2) => {
      if (!player?.fruitScore) return [];
      return getTopFruits(player.fruitScore, count);
    },
    []
  );

  // ── Celkové skóre ovoce ───────────────────
  const getPlayerFruitTotal = useCallback(
    (player) => {
      if (!player?.fruitScore) return 0;
      return getTotalFruitScore(player.fruitScore);
    },
    []
  );

  // ── Barva políčka ─────────────────────────
  const getTileColor = useCallback((tileType) => {
    const map = {
      negative: "#E24B4A",
      positive: "#1D9E75",
      special:  "#378ADD",
      doors:    "#EF9F27",
      entry:    "#EF9F27",
      study:    "#1D9E75",
      prayer:   "#0F6E56",
      start:    "#9FE1CB",
      empty:    "#444441",
    };
    return map[tileType] ?? "#888780";
  }, []);

  // ── Pozice políčka na desce (x, y) ────────
  const getTileXY = useCallback((index, total, radius, cx, cy) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }, []);

  return {
    // Store akce
    rollDice:          store.rollDice,
    confirmMove:       store.confirmMove,
    answerQuestion:    store.answerQuestion,
    answerWitnessing:  store.answerWitnessing,
    dismissTileAction: store.dismissTileAction,
    dismissWildCard:   store.dismissWildCard,
    endGame:           store.endGame,
    restartGame:       store.restartGame,
    pauseTimer:        store.pauseTimer,
    resumeTimer:       store.resumeTimer,

    // Stav
    gamePhase:       store.gamePhase,
    currentPlayer,
    players,
    currentPlayerIndex: store.currentPlayerIndex,
    diceRoll:        store.diceRoll,
    isRolling:       store.isRolling,
    difficulty:      store.difficulty,
    timeRemaining:   store.timeRemaining,
    formattedTime,
    isTimeUrgent,
    willSkipTurn,
    turnLog:         store.turnLog,

    // Modaly
    showQuestion:    store.showQuestion,
    showWitnessing:  store.showWitnessing,
    showTileAction:  store.showTileAction,
    showWildCard:    store.showWildCard,
    currentQuestion:    store.currentQuestion,
    currentWitnessing:  store.currentWitnessing,
    currentTileAction:  store.currentTileAction,
    currentWildCard:    store.currentWildCard,
    witnessingTime:     store.witnessingTimeRemaining,

    // Výsledky
    endResults: store.endResults,

    // Pomocné
    innerPlayers,
    outerPlayers,
    playerRanking,
    isCurrentPlayer,
    getPlayerTile,
    getPlayerAvatar,
    getPlayerAngle,
    canRoll,
    canConfirmMove,
    getPlayerTopFruits,
    getPlayerFruitTotal,
    getTileColor,
    getTileXY,
  };
};
