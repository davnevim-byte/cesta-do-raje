// ============================================================
//  useSound — zvuky hry
//  Všechny zvuky jsou generovány přes Web Audio API
//  — žádné externí soubory nejsou potřeba
//  Hráč může zvuky vypnout
// ============================================================

import { useRef, useCallback, useEffect } from "react";
import { useGameStore } from "../store/gameStore";

// ─────────────────────────────────────────────
//  WEB AUDIO CONTEXT
// ─────────────────────────────────────────────

let audioCtx = null;

const getAudioCtx = () => {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
};

// ─────────────────────────────────────────────
//  GENERÁTORY ZVUKŮ
//  Každý zvuk = sekvence oscilátorů + gain
// ─────────────────────────────────────────────

const playTone = (ctx, freq, type, startTime, duration, gainValue = 0.3) => {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type      = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(gainValue, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
};

// ─────────────────────────────────────────────
//  ZVUKOVÉ EFEKTY
// ─────────────────────────────────────────────

const SOUNDS = {

  // Kostka se hází — krátké rychlé tikání
  dice: (ctx) => {
    const now = ctx.currentTime;
    [0, 0.06, 0.12, 0.18, 0.24].forEach((offset) => {
      playTone(ctx, 200 + Math.random() * 300, "square", now + offset, 0.04, 0.15);
    });
  },

  // Pohyb hráče — veselé "pop" pro každý krok
  move: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 440, "sine", now,        0.08, 0.2);
    playTone(ctx, 550, "sine", now + 0.08, 0.08, 0.15);
  },

  // Přistání na políčku — neutrální "ding"
  land: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 660, "sine", now, 0.3, 0.25);
  },

  // Správná odpověď — radostná fanfára
  correct: (ctx) => {
    const now = ctx.currentTime;
    [
      [523, 0.00],
      [659, 0.12],
      [784, 0.24],
      [1047, 0.36],
    ].forEach(([freq, offset]) => {
      playTone(ctx, freq, "sine", now + offset, 0.18, 0.3);
    });
  },

  // Špatná odpověď — smutné klesání
  wrong: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 330, "sawtooth", now,        0.2,  0.2);
    playTone(ctx, 220, "sawtooth", now + 0.22, 0.3,  0.2);
    playTone(ctx, 165, "sawtooth", now + 0.54, 0.25, 0.2);
  },

  // Dveře — mystické otevření
  doors: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 220, "sine", now,        0.4, 0.15);
    playTone(ctx, 330, "sine", now + 0.15, 0.4, 0.15);
    playTone(ctx, 440, "sine", now + 0.30, 0.5, 0.2);
    playTone(ctx, 550, "sine", now + 0.50, 0.4, 0.2);
  },

  // Přesun do sboru — triumfální akord
  innerCircle: (ctx) => {
    const now = ctx.currentTime;
    [261, 329, 392, 523].forEach((freq, i) => {
      playTone(ctx, freq, "sine", now + i * 0.1, 0.6, 0.25);
    });
  },

  // Negativní políčko — temné bzučení
  negative: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 100, "sawtooth", now,        0.15, 0.3);
    playTone(ctx, 80,  "sawtooth", now + 0.18, 0.2,  0.25);
  },

  // Divoká karta — překvapivý "whoosh"
  wildCard: (ctx) => {
    const now = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.41);
  },

  // Svědectví úspěch — slavnostní zvuk
  witnessSuccess: (ctx) => {
    const now = ctx.currentTime;
    [
      [523, 0.00, 0.2],
      [659, 0.15, 0.2],
      [784, 0.30, 0.2],
      [659, 0.45, 0.15],
      [784, 0.55, 0.4],
    ].forEach(([freq, offset, dur]) => {
      playTone(ctx, freq, "sine", now + offset, dur, 0.3);
    });
  },

  // Svědectví neúspěch — neutrální zakončení
  witnessFail: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 330, "triangle", now,        0.25, 0.2);
    playTone(ctx, 294, "triangle", now + 0.28, 0.3,  0.2);
  },

  // Přechod na dalšího hráče — jemné "next"
  nextTurn: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 440, "sine", now,        0.1, 0.15);
    playTone(ctx, 494, "sine", now + 0.12, 0.12, 0.12);
  },

  // Timer urgentní — tikání
  timerUrgent: (ctx) => {
    const now = ctx.currentTime;
    playTone(ctx, 880, "square", now, 0.08, 0.15);
  },

  // Výhra — velká oslava
  victory: (ctx) => {
    const now = ctx.currentTime;
    const melody = [
      [523, 0.00, 0.15],
      [659, 0.16, 0.15],
      [784, 0.32, 0.15],
      [1047, 0.48, 0.3],
      [784, 0.70, 0.15],
      [880, 0.86, 0.15],
      [1047, 1.02, 0.5],
    ];
    melody.forEach(([freq, offset, dur]) => {
      playTone(ctx, freq, "sine", now + offset, dur, 0.3);
    });
  },

  // Konec hry (timeout) — finální akordy
  gameEnd: (ctx) => {
    const now = ctx.currentTime;
    [523, 659, 784].forEach((freq, i) => {
      playTone(ctx, freq, "sine", now + i * 0.15, 0.8, 0.2);
    });
  },
};

// ─────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────

export const useSound = () => {
  const isMuted = useGameStore((s) => s.isMuted ?? false);
  const setMuted = useGameStore((s) => s.setMuted ?? (() => {}));

  const play = useCallback(
    (soundName) => {
      if (isMuted) return;
      const ctx = getAudioCtx();
      if (!ctx) return;

      // Probudit AudioContext pokud je suspendovaný (autoplay policy)
      if (ctx.state === "suspended") {
        ctx.resume().then(() => {
          SOUNDS[soundName]?.(ctx);
        });
        return;
      }

      SOUNDS[soundName]?.(ctx);
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setMuted?.(!isMuted);
  }, [isMuted, setMuted]);

  return {
    play,
    isMuted,
    toggleMute,
    // Zkrácené metody pro přehlednost
    sounds: {
      dice:           () => play("dice"),
      move:           () => play("move"),
      land:           () => play("land"),
      correct:        () => play("correct"),
      wrong:          () => play("wrong"),
      doors:          () => play("doors"),
      innerCircle:    () => play("innerCircle"),
      negative:       () => play("negative"),
      wildCard:       () => play("wildCard"),
      witnessSuccess: () => play("witnessSuccess"),
      witnessFail:    () => play("witnessFail"),
      nextTurn:       () => play("nextTurn"),
      timerUrgent:    () => play("timerUrgent"),
      victory:        () => play("victory"),
      gameEnd:        () => play("gameEnd"),
    },
  };
};

// ─── Haptická odezva (mobil) ─────────────────────────────────
export const useHaptics = () => {
  const vibrate = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };
  return {
    tap:     () => vibrate(30),
    dice:    () => vibrate([40, 20, 40]),
    land:    () => vibrate(60),
    correct: () => vibrate([50, 30, 80]),
    wrong:   () => vibrate([100, 50, 100]),
    victory: () => vibrate([80, 40, 80, 40, 200]),
  };
};
