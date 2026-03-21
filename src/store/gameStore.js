// ============================================================
//  HERNÍ STAV — Cesta do Ráje
//  Zustand store — centrální stav celé hry
//
//  Fáze hry:
//    "login"     → zadání hesla
//    "setup"     → nastavení hráčů, obtížnosti, času
//    "onboarding"→ průvodce pravidly (první hra)
//    "playing"   → hlavní hra
//    "ended"     → konec hry + ceremoniál
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { OUTER_TILES, INNER_TILES, getTileAtPosition, getRandomInstruction } from "../data/tiles";
import { getRandomQuestion } from "../data/questions";
import { getRandomScenario, fillScenarioNames } from "../data/scenarios";
import { getRandomWildCard, fillWildCardNames, WILD_CARD_TRIGGER_CHANCE } from "../data/wildCards";
import { createInitialFruitScore, addFruit, evaluateAllPlayers, calculateEndAwards } from "../data/fruitOfSpirit";

// ─────────────────────────────────────────────
//  KONSTANTY
// ─────────────────────────────────────────────

const PASSWORD         = "raj2025";   // heslo pro vstup do hry
const MIN_PLAYERS      = 2;
const MAX_PLAYERS      = 10;
const DEFAULT_TIMER    = 60;          // minut
const DEFAULT_DIFFICULTY = "EASY";

// Avatary
export const AVATARS = [
  { id: "AVATAR01", url: "/images/avatars/avatar01.png", colorClass: "bg-teal-500" },
  { id: "AVATAR02", url: "/images/avatars/avatar02.png", colorClass: "bg-indigo-500" },
  { id: "AVATAR03", url: "/images/avatars/avatar03.png", colorClass: "bg-rose-500" },
  { id: "AVATAR04", url: "/images/avatars/avatar04.png", colorClass: "bg-amber-500" },
  { id: "AVATAR05", url: "/images/avatars/avatar05.png", colorClass: "bg-emerald-500" },
  { id: "AVATAR06", url: "/images/avatars/avatar06.png", colorClass: "bg-violet-500" },
  { id: "AVATAR07", url: "/images/avatars/avatar07.png", colorClass: "bg-cyan-500" },
  { id: "AVATAR08", url: "/images/avatars/avatar08.png", colorClass: "bg-fuchsia-500" },
  { id: "AVATAR09", url: "/images/avatars/avatar09.png", colorClass: "bg-lime-500" },
  { id: "AVATAR10", url: "/images/avatars/avatar10.png", colorClass: "bg-orange-500" },
  { id: "AVATAR11", url: "/images/avatars/avatar11.png", colorClass: "bg-sky-500" },
  { id: "AVATAR12", url: "/images/avatars/avatar12.png", colorClass: "bg-pink-500" },
];

// ─────────────────────────────────────────────
//  POMOCNÉ FUNKCE — pohyb na desce
// ─────────────────────────────────────────────

const calculateNewPosition = (player, steps) => {
  const tiles = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
  const newPos = (player.position + steps) % tiles.length;
  const passedStart = player.circle === "outer" && newPos < player.position;
  return { newPos, passedStart, tile: tiles[newPos] };
};

const selectRandomOtherPlayer = (players, currentIndex) => {
  const others = players
    .map((p, i) => ({ ...p, index: i }))
    .filter((_, i) => i !== currentIndex);
  if (others.length === 0) return players[currentIndex];
  return others[Math.floor(Math.random() * others.length)];
};

// ─────────────────────────────────────────────
//  POČÁTEČNÍ STAV
// ─────────────────────────────────────────────

const initialState = {
  // Fáze
  gamePhase: "login",

  // Hráči
  players: [],
  currentPlayerIndex: 0,

  // Nastavení
  difficulty:    DEFAULT_DIFFICULTY,
  timerMinutes:  DEFAULT_TIMER,
  timeRemaining: DEFAULT_TIMER * 60,
  isTimerRunning: false,

  // Kostka
  diceRoll: null,
  diceType: "virtual",
  isRolling: false,

  // Animace pohybu políčko po políčku
  isMoving:    false,  // figurka se právě pohybuje
  movingStep:  0,      // aktuální krok animace (0 = hotovo)
  movingTotal: 0,      // celkový počet kroků

  // Aktivní modaly
  showQuestion:    false,
  showWitnessing:  false,
  showTileAction:  false,
  showWildCard:    false,
  showOnboarding:  false,

  // Obsah modalů
  currentQuestion:   null,   // { question, answer, verseRef, hint, type }
  currentWitnessing: null,   // vyplněný scénář (fillScenarioNames)
  currentTileAction: null,   // { tile, instruction, type }
  currentWildCard:   null,   // vyplněná divoká karta (fillWildCardNames)

  // Svědectví timer
  witnessingTimeRemaining: null,

  // Konec hry
  endResults: null,   // evaluateAllPlayers + calculateEndAwards

  // Historie tahů (pro animace a log)
  turnLog: [],

  // Zda byla hra někdy spuštěna (pro onboarding)
  hasPlayedBefore: false,

  // Zvuk — zachovává se přes restarty
  isMuted: false,
};

// ─────────────────────────────────────────────
//  ZUSTAND STORE
// ─────────────────────────────────────────────

let timerInterval       = null;
let witnessingInterval  = null;

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      setMuted: (val) => set({ isMuted: val }),

      // ─────────────────────────────
      //  LOGIN
      // ─────────────────────────────

      checkPassword: (input) => {
        if (input.trim() === PASSWORD) {
          set({ gamePhase: "setup" });
          return true;
        }
        return false;
      },

      // ─────────────────────────────
      //  SETUP
      // ─────────────────────────────

      setDifficulty: (difficulty) => set({ difficulty }),

      setTimerMinutes: (minutes) =>
        set({ timerMinutes: minutes, timeRemaining: minutes * 60 }),

      // ─────────────────────────────
      //  START HRY
      // ─────────────────────────────

      startGame: (playerCount, names, avatarIds, difficulty, timerMinutes) => {
        clearInterval(timerInterval);
        clearInterval(witnessingInterval);

        const players = Array(playerCount)
          .fill(null)
          .map((_, i) => ({
            id:                   `player_${i}`,
            name:                 names[i]?.trim() || `Hráč ${i + 1}`,
            avatarId:             avatarIds[i] || AVATARS[i % AVATARS.length].id,
            colorClass:           AVATARS[i % AVATARS.length].colorClass,
            position:             0,
            circle:               "outer",
            skipNextTurn:         false,
            skipTurnsRemaining:   0,
            hasEnteredInner:      false,
            doorsVisitedThisRound: false,
            fruitScore:           createInitialFruitScore(),
            bonusRollNextTurn:    false,
            turnCount:            0,
          }));

        const showOnboarding = !get().hasPlayedBefore;

        set({
          ...initialState,
          gamePhase:     showOnboarding ? "onboarding" : "playing",
          players,
          currentPlayerIndex: 0,
          difficulty,
          timerMinutes,
          timeRemaining: timerMinutes * 60,
          isTimerRunning: !showOnboarding,
          showOnboarding,
          hasPlayedBefore: true,
          turnLog: [],
        });

        if (!showOnboarding) {
          get()._startTimer();
        }
      },

      finishOnboarding: () => {
        set({ gamePhase: "playing", showOnboarding: false });
        get()._startTimer();
      },

      // ─────────────────────────────
      //  TIMER
      // ─────────────────────────────

      _startTimer: () => {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
          const { timeRemaining, gamePhase } = get();
          if (gamePhase !== "playing") {
            clearInterval(timerInterval);
            return;
          }
          if (timeRemaining <= 1) {
            clearInterval(timerInterval);
            get().endGame("timeout");
          } else {
            set({ timeRemaining: timeRemaining - 1 });
          }
        }, 1000);
      },

      pauseTimer: () => {
        clearInterval(timerInterval);
        set({ isTimerRunning: false });
      },

      resumeTimer: () => {
        set({ isTimerRunning: true });
        get()._startTimer();
      },

      // ─────────────────────────────
      //  HOZENÍ KOSTKOU
      // ─────────────────────────────

      rollDice: () => {
        const { diceRoll, players, currentPlayerIndex } = get();
        if (diceRoll !== null) return; // už hodil

        const value = Math.floor(Math.random() * 6) + 1;
        set({ diceRoll: value, isRolling: true });

        setTimeout(() => {
          set({ isRolling: false });
        }, 600);
      },

      rollDiceWithValue: (value) => {
        const { diceRoll } = get();
        if (diceRoll !== null) return;
        set({ diceRoll: value, isRolling: false });
      },

      setDiceType: (type) => {
        set({ diceType: type });
      },

      confirmMove: () => {
        const state = get();
        const { diceRoll, players, currentPlayerIndex, difficulty } = state;
        if (diceRoll === null) return;

        const player = players[currentPlayerIndex];

        // Přeskočení tahu
        if (player.skipTurnsRemaining > 0) {
          const updated = [...players];
          updated[currentPlayerIndex] = {
            ...player,
            skipTurnsRemaining: player.skipTurnsRemaining - 1,
            skipNextTurn: player.skipTurnsRemaining - 1 > 0,
          };
          set({ players: updated, diceRoll: null });
          get()._nextPlayer();
          return;
        }

        // Bonus roll
        const rolls = player.bonusRollNextTurn
          ? diceRoll + (Math.floor(Math.random() * 6) + 1)
          : diceRoll;

        // Spustit animaci pohybu políčko po políčku
        set({ diceRoll: null, isMoving: true, movingTotal: rolls, movingStep: 0 });
        get()._stepMove(currentPlayerIndex, rolls, 0);
      },

      // ── Animace pohybu — jeden krok ──────────────────────────
      _stepMove: (playerIndex, totalSteps, stepsDone) => {
        if (stepsDone >= totalSteps) {
          // Všechny kroky hotovy — zpracovat políčko
          set({ isMoving: false, movingStep: 0, movingTotal: 0 });
          const { players } = get();
          const player = players[playerIndex];
          const tiles  = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
          const tile   = tiles[player.position % tiles.length];

          // Aktualizuj turnCount po dokončení pohybu
          const updated = [...players];
          updated[playerIndex] = {
            ...player,
            turnCount: player.turnCount + 1,
          };
          set({ players: updated });

          // Log a reakce na políčko
          get()._logTurn(player.name, tile?.name ?? "?", totalSteps);
          get()._handleTileLanding(tile, playerIndex);

          // Divoká karta — až po zpracování políčka
          if (!get().showQuestion && !get().showWitnessing && !get().showTileAction) {
            if (Math.random() < WILD_CARD_TRIGGER_CHANCE) {
              setTimeout(() => get()._triggerWildCard(), 400);
            }
          }
          return;
        }

        // Jeden krok vpřed
        const { players } = get();
        const player = players[playerIndex];
        const tiles  = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
        const newPos = (player.position + 1) % tiles.length;

        // Prošel hráč startem? (jen ve vnějším kruhu)
        const passedStart = player.circle === "outer" && newPos === 0 && player.position !== 0;

        const updated = [...players];
        updated[playerIndex] = {
          ...player,
          position:             newPos,
          bonusRollNextTurn:    stepsDone + 1 >= totalSteps ? false : player.bonusRollNextTurn,
          // Resetuj doorsVisitedThisRound pokud prošel startem
          doorsVisitedThisRound: passedStart ? false : player.doorsVisitedThisRound,
        };

        set({
          players:    updated,
          movingStep: stepsDone + 1,
        });

        // Zpomalení posledního kroku — dramatická pauza před přistáním
        const isLastStep = stepsDone + 1 >= totalSteps;
        const isPreLast  = stepsDone + 1 === totalSteps - 1;
        const delay = isLastStep ? 550 : isPreLast ? 300 : 200;

        setTimeout(() => {
          get()._stepMove(playerIndex, totalSteps, stepsDone + 1);
        }, delay);
      },

      // ─────────────────────────────
      //  LOGIKA POLÍČKA
      // ─────────────────────────────

      _handleTileLanding: (tile, playerIndex) => {
        const { players, difficulty } = get();
        const player  = players[playerIndex];
        const target  = selectRandomOtherPlayer(players, playerIndex);

        switch (tile.type) {

          // Studium / Modlitba → biblická otázka
          case "study":
          case "prayer": {
            const q = getRandomQuestion(difficulty);
            set({
              showQuestion: true,
              currentQuestion: {
                ...q,
                tileType: tile.type,
                tileName: tile.name,
                tileImage: tile.image,
              },
            });
            break;
          }

          // Dveře → svědectví scénář
          case "doors": {
            if (player.doorsVisitedThisRound) {
              // Už dveře tento kruh byl — jen instrukce
              get()._showTileInstruction(tile, playerIndex);
              break;
            }
            const raw      = getRandomScenario();
            const scenario = fillScenarioNames(raw, player.name, target.name);
            const WITNESSING_TIME = 180;
            clearInterval(witnessingInterval);

            set({
              showWitnessing: true,
              currentWitnessing: scenario,
              witnessingTimeRemaining: WITNESSING_TIME,
            });

            witnessingInterval = setInterval(() => {
              const { witnessingTimeRemaining } = get();
              if (witnessingTimeRemaining === null || witnessingTimeRemaining <= 0) {
                clearInterval(witnessingInterval);
                get().answerWitnessing(false);
              } else {
                set({ witnessingTimeRemaining: witnessingTimeRemaining - 1 });
              }
            }, 1000);

            const updated = [...get().players];
            updated[playerIndex] = {
              ...updated[playerIndex],
              doorsVisitedThisRound: true,
            };
            set({ players: updated });
            break;
          }

          // Negativní políčko
          case "negative": {
            get()._showTileInstruction(tile, playerIndex);
            break;
          }

          // Speciální políčko (shromáždění, služba, komentáře...)
          case "special": {
            get()._showTileInstruction(tile, playerIndex);
            break;
          }

          // Vstup do sboru
          case "entry": {
            const updated = [...get().players];
            updated[playerIndex] = {
              ...updated[playerIndex],
              fruitScore: addFruit(
                updated[playerIndex].fruitScore,
                "radost",
                1
              ),
            };
            set({ players: updated });
            get()._showTileInstruction(tile, playerIndex);
            break;
          }

          // Start
          case "start": {
            get()._showTileInstruction(tile, playerIndex);
            break;
          }

          // Prázdné políčko → jen přechod na dalšího
          case "empty":
          default: {
            setTimeout(() => get()._nextPlayer(), 800);
            break;
          }
        }
      },

      _showTileInstruction: (tile, playerIndex) => {
        const instruction = getRandomInstruction(tile);
        if (!instruction) {
          setTimeout(() => get()._nextPlayer(), 800);
          return;
        }
        set({
          showTileAction: true,
          currentTileAction: {
            tile,
            instruction,
            type: tile.type,
          },
        });
      },

      // ─────────────────────────────
      //  ODPOVĚDI NA OTÁZKY
      // ─────────────────────────────

      answerQuestion: (correct) => {
        const { players, currentPlayerIndex, currentQuestion } = get();
        const player  = players[currentPlayerIndex];
        const updated = [...players];

        if (correct) {
          // Správná odpověď → ovoce VÍRA + případný posun
          updated[currentPlayerIndex] = {
            ...player,
            fruitScore: addFruit(player.fruitScore, "víra", 1),
          };

          // Pokud je hráč ve vnitřním kruhu a odpoví špatně → ven
          // (zde správně → nic se nestane se pozicí)
        } else {
          // Špatná odpověď ve vnitřním kruhu → zpět do vnějšího
          if (player.circle === "inner") {
            updated[currentPlayerIndex] = {
              ...player,
              circle:   "outer",
              position: 0,
            };
          }
        }

        set({
          players:         updated,
          showQuestion:    false,
          currentQuestion: null,
        });

        get()._nextPlayer();
      },

      answerWitnessing: (success) => {
        clearInterval(witnessingInterval);
        const { players, currentPlayerIndex } = get();
        const player  = players[currentPlayerIndex];
        const updated = [...players];

        if (success) {
          // Úspěch → přesun do vnitřního kruhu + ovoce LÁSKA
          updated[currentPlayerIndex] = {
            ...player,
            circle:          "inner",
            position:        0,
            hasEnteredInner: true,
            fruitScore:      addFruit(
              addFruit(player.fruitScore, "láska", 2),
              "laskavost", 1
            ),
          };
        } else {
          // Neúspěch → přeskočení tahu + ovoce TRPĚLIVOST
          updated[currentPlayerIndex] = {
            ...player,
            skipNextTurn:       true,
            skipTurnsRemaining: 1,
            fruitScore:         addFruit(player.fruitScore, "trpělivost", 1),
          };
        }

        set({
          players:           updated,
          showWitnessing:    false,
          currentWitnessing: null,
          witnessingTimeRemaining: null,
        });

        get()._nextPlayer();
      },

      dismissTileAction: (completed) => {
        const { players, currentPlayerIndex, currentTileAction } = get();
        const player  = players[currentPlayerIndex];
        const updated = [...players];

        if (completed && currentTileAction?.tile?.fruit) {
          updated[currentPlayerIndex] = {
            ...player,
            fruitScore: addFruit(player.fruitScore, currentTileAction.tile.fruit, 1),
          };
        }

        // Penalizace negativních políček
        if (currentTileAction?.tile?.penalty && !completed) {
          const pen = currentTileAction.tile.penalty;
          if (pen.type === "skip") {
            updated[currentPlayerIndex] = {
              ...updated[currentPlayerIndex],
              skipNextTurn:       true,
              skipTurnsRemaining: pen.turns || 1,
            };
          } else if (pen.type === "moveBack") {
            const tiles   = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
            const newPos  = Math.max(0, player.position - (pen.spaces || 1));
            updated[currentPlayerIndex] = {
              ...updated[currentPlayerIndex],
              position: newPos,
            };
          } else if (pen.type === "moveToStart") {
            updated[currentPlayerIndex] = {
              ...updated[currentPlayerIndex],
              position: 0,
            };
          }
        }

        // Odměna speciálních políček
        if (completed && currentTileAction?.tile?.reward) {
          const rew = currentTileAction.tile.reward;
          if (rew.type === "moveForward") {
            const tiles  = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
            const newPos = (player.position + (rew.spaces || 1)) % tiles.length;
            updated[currentPlayerIndex] = {
              ...updated[currentPlayerIndex],
              position: newPos,
            };
          }
        }

        set({
          players:           updated,
          showTileAction:    false,
          currentTileAction: null,
        });

        get()._nextPlayer();
      },

      // ─────────────────────────────
      //  DIVOKÉ KARTY
      // ─────────────────────────────

      _triggerWildCard: () => {
        const { players, currentPlayerIndex } = get();
        const player = players[currentPlayerIndex];
        const target = selectRandomOtherPlayer(players, currentPlayerIndex);
        const raw    = getRandomWildCard();
        const card   = fillWildCardNames(raw, player.name, target.name);

        set({ showWildCard: true, currentWildCard: { ...card, targetPlayerIndex: target.index ?? 0 } });
      },

      dismissWildCard: (choiceData) => {
        const { players, currentPlayerIndex, currentWildCard } = get();
        if (!currentWildCard) {
          set({ showWildCard: false, currentWildCard: null });
          return;
        }

        const updated  = [...players];
        const action   = currentWildCard.action;
        const ci       = currentPlayerIndex;
        const ti       = currentWildCard.targetPlayerIndex ?? 0;

        // Zpracování základních efektů divoké karty
        if (action) {
          switch (action.type) {
            case "allMoveForward": {
              updated.forEach((_, i) => {
                const p     = updated[i];
                const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
                updated[i]  = { ...p, position: (p.position + action.spaces) % tiles.length };
              });
              break;
            }
            case "moveForward": {
              const idx  = action.target === "targetPlayer" ? ti : ci;
              const p    = updated[idx];
              const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
              updated[idx] = { ...p, position: (p.position + action.spaces) % tiles.length };
              if (action.fruit) {
                updated[ci] = { ...updated[ci], fruitScore: addFruit(updated[ci].fruitScore, action.fruit, 1) };
              }
              break;
            }
            case "bonusRoll": {
              updated[ci] = { ...updated[ci], bonusRollNextTurn: true };
              break;
            }
            case "allInnerMoveForward": {
              updated.forEach((p, i) => {
                if (p.circle === "inner") {
                  updated[i] = { ...p, position: (p.position + action.spaces) % INNER_TILES.length };
                }
              });
              break;
            }
            case "choiceBonus": {
              // choiceData.choice === "A" nebo "B"
              const opt = choiceData?.choice === "B" ? action.optionB : action.optionA;
              const idx  = opt.target === "targetPlayer" ? ti : ci;
              const p    = updated[idx];
              const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
              updated[idx] = { ...p, position: (p.position + opt.spaces) % tiles.length };
              if (opt.bonusFruit) {
                updated[opt.bonusTarget === "targetPlayer" ? ti : ci] = {
                  ...updated[opt.bonusTarget === "targetPlayer" ? ti : ci],
                  fruitScore: addFruit(
                    updated[opt.bonusTarget === "targetPlayer" ? ti : ci].fruitScore,
                    opt.bonusFruit, 1
                  ),
                };
              }
              break;
            }
            case "faithTest": {
              const p    = updated[ci];
              const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
              updated[ci] = {
                ...p,
                position:         Math.max(0, p.position - action.penalty.spaces),
                bonusRollNextTurn: action.reward.bonusRollNextTurn,
                fruitScore:        addFruit(p.fruitScore, action.reward.fruit, 1),
              };
              break;
            }
            default:
              break;
          }
        }

        set({ players: updated, showWildCard: false, currentWildCard: null });
      },

      // ─────────────────────────────
      //  DALŠÍ HRÁČ
      // ─────────────────────────────

      _nextPlayer: () => {
        const { players, currentPlayerIndex } = get();
        const next = (currentPlayerIndex + 1) % players.length;
        set({ currentPlayerIndex: next, diceRoll: null });
      },

      // ─────────────────────────────
      //  LOG TAHŮ
      // ─────────────────────────────

      _logTurn: (playerName, tileName, roll) => {
        const { turnLog } = get();
        const entry = {
          id:         Date.now(),
          playerName,
          tileName,
          roll,
          timestamp:  new Date().toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }),
        };
        set({ turnLog: [entry, ...turnLog].slice(0, 50) }); // max 50 záznamů
      },

      // ─────────────────────────────
      //  KONEC HRY
      // ─────────────────────────────

      endGame: (reason = "manual") => {
        clearInterval(timerInterval);
        clearInterval(witnessingInterval);

        const { players } = get();
        const evaluated   = evaluateAllPlayers(players);
        const awards      = calculateEndAwards(players);

        set({
          gamePhase:   "ended",
          endResults:  { players: evaluated, awards, reason },
          showQuestion:    false,
          showWitnessing:  false,
          showTileAction:  false,
          showWildCard:    false,
          isTimerRunning:  false,
        });
      },

      // ─────────────────────────────
      //  RESTART / NOVÁ HRA
      // ─────────────────────────────

      restartGame: () => {
        clearInterval(timerInterval);
        clearInterval(witnessingInterval);
        const { isMuted } = get();
        set({ ...initialState, gamePhase: "setup", hasPlayedBefore: true, isMuted });
      },

      goToLogin: () => {
        clearInterval(timerInterval);
        clearInterval(witnessingInterval);
        const { isMuted } = get();
        set({ ...initialState, isMuted });
      },

      // ─────────────────────────────
      //  GETTERY (selektory)
      // ─────────────────────────────

      getCurrentPlayer: () => {
        const { players, currentPlayerIndex } = get();
        return players[currentPlayerIndex] ?? null;
      },

      getPlayerTile: (playerIndex) => {
        const { players } = get();
        const p = players[playerIndex];
        if (!p) return null;
        return getTileAtPosition(p.circle, p.position);
      },

      getFormattedTime: () => {
        const { timeRemaining } = get();
        const m = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
        const s = (timeRemaining % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
      },

      isModalOpen: () => {
        const { showQuestion, showWitnessing, showTileAction, showWildCard, showOnboarding } = get();
        return showQuestion || showWitnessing || showTileAction || showWildCard || showOnboarding;
      },
    }),

    // ─────────────────────────────
    //  PERSIST — uložení stavu
    // ─────────────────────────────
    {
      name:    "cesta-do-raje-game",
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        players: Array.isArray(persisted?.players) ? persisted.players : [],
        turnLog: Array.isArray(persisted?.turnLog) ? persisted.turnLog : [],
      }),
      partialize: (state) => ({
        // Uložíme jen to co chceme zachovat při obnovení stránky
        hasPlayedBefore: state.hasPlayedBefore,
        isMuted:         state.isMuted,
        gamePhase:       state.gamePhase === "playing" ? "playing" : "login",
        players:         state.gamePhase === "playing" ? state.players : [],
        currentPlayerIndex: state.currentPlayerIndex,
        difficulty:      state.difficulty,
        timerMinutes:    state.timerMinutes,
        timeRemaining:   state.timeRemaining,
        turnLog:         state.turnLog,
      }),
    }
  )
);

// ─────────────────────────────────────────────
//  SELEKTORY — pro přehlednost v komponentách
// ─────────────────────────────────────────────

export const selectCurrentPlayer   = (s) => (s.players ?? [])[s.currentPlayerIndex];
export const selectPlayers         = (s) => s.players ?? [];
export const selectGamePhase       = (s) => s.gamePhase;
export const selectDifficulty      = (s) => s.difficulty;
export const selectTimeRemaining   = (s) => s.timeRemaining;
export const selectDiceRoll        = (s) => s.diceRoll;
export const selectIsRolling       = (s) => s.isRolling;
export const selectIsMoving        = (s) => s.isMoving;
export const selectMovingStep      = (s) => s.movingStep;
export const selectMovingTotal     = (s) => s.movingTotal;
export const selectShowQuestion    = (s) => s.showQuestion;
export const selectShowWitnessing  = (s) => s.showWitnessing;
export const selectShowTileAction  = (s) => s.showTileAction;
export const selectShowWildCard    = (s) => s.showWildCard;
export const selectCurrentQuestion = (s) => s.currentQuestion;
export const selectCurrentWitnessing = (s) => s.currentWitnessing;
export const selectCurrentTileAction = (s) => s.currentTileAction;
export const selectCurrentWildCard = (s) => s.currentWildCard;
export const selectEndResults      = (s) => s.endResults;
export const selectTurnLog         = (s) => s.turnLog;
export const selectWitnessingTime  = (s) => s.witnessingTimeRemaining;
