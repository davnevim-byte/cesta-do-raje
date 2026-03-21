// ============================================================
//  useMusic — atmosférická hudba přes Web Audio API
//  Opravy: singleton bug, race condition při init,
//          isMuted respektován, spolehlivý cleanup
// ============================================================

import { useEffect, useRef, useCallback } from "react";
import { useGameStore } from "../store/gameStore";

// ── AudioContext — lazy singleton ────────────────────────────
// Poznámka: jeden AudioContext na celou aplikaci (browser limit)
let _audioCtx = null;

const getCtx = () => {
  if (_audioCtx && _audioCtx.state !== "closed") return _audioCtx;
  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    return null;
  }
  return _audioCtx;
};

const resumeCtx = async (ctx) => {
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch {}
  }
};

// ── Konfigurace smyček ────────────────────────────────────────
const OUTER_CONFIG = [
  // Temná, tajemná — vnější svět (nízké frekvence, nepravidelné LFO)
  { freq: 55,  type: "sine",     vol: 0.055, lfoRate: 0.07,  lfoDepth: 0.018 },
  { freq: 110, type: "sine",     vol: 0.038, lfoRate: 0.11,  lfoDepth: 0.014 },
  { freq: 82,  type: "triangle", vol: 0.028, lfoRate: 0.045, lfoDepth: 0.009 },
  { freq: 165, type: "sine",     vol: 0.022, lfoRate: 0.14,  lfoDepth: 0.007 },
  { freq: 220, type: "sine",     vol: 0.013, lfoRate: 0.065, lfoDepth: 0.005 },
];

const INNER_CONFIG = [
  // Teplá, harmonická — sbor (vyšší frekvence, klidné LFO)
  { freq: 261, type: "sine",     vol: 0.048, lfoRate: 0.09,  lfoDepth: 0.018 },
  { freq: 329, type: "sine",     vol: 0.038, lfoRate: 0.075, lfoDepth: 0.014 },
  { freq: 392, type: "sine",     vol: 0.032, lfoRate: 0.055, lfoDepth: 0.011 },
  { freq: 523, type: "sine",     vol: 0.022, lfoRate: 0.110, lfoDepth: 0.007 },
  { freq: 196, type: "triangle", vol: 0.028, lfoRate: 0.045, lfoDepth: 0.009 },
];

// ── Vytvoření smyčky ─────────────────────────────────────────
const createLoop = (ctx, masterGain, tones) => {
  const nodes = tones.map(({ freq, type, vol, lfoRate, lfoDepth }) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo  = ctx.createOscillator();
    const lfoG = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    // LFO moduluje hlasitost
    lfo.type = "sine";
    lfo.frequency.value = lfoRate;
    lfoG.gain.value = lfoDepth;

    lfo.connect(lfoG);
    lfoG.connect(gain.gain);
    osc.connect(gain);
    gain.connect(masterGain);

    // Start tiše — fade in řídí switchToZone
    gain.gain.setValueAtTime(0, ctx.currentTime);

    osc.start();
    lfo.start();

    return { osc, gain, lfo, targetVol: vol };
  });

  return {
    fadeIn(duration = 2.5) {
      const now = ctx.currentTime;
      nodes.forEach(({ gain, targetVol }) => {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(targetVol, now + duration);
      });
    },
    fadeOut(duration = 2.5) {
      const now = ctx.currentTime;
      nodes.forEach(({ gain }) => {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + duration);
      });
    },
    stop() {
      nodes.forEach(({ osc, lfo }) => {
        try { osc.stop(); } catch {}
        try { lfo.stop(); } catch {}
      });
    },
  };
};

// ── Načtení audio souboru ────────────────────────────────────
const audioCache = {};

const loadAudio = async (ctx, url) => {
  if (audioCache[url]) return audioCache[url];
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const buf = await resp.arrayBuffer();
    const decoded = await ctx.decodeAudioData(buf);
    audioCache[url] = decoded;
    return decoded;
  } catch {
    return null;
  }
};

const createAmbientSource = (ctx, buffer, gainNode) => {
  if (!buffer) return null;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.connect(gainNode);
  src.start(0);
  return src;
};

// ── Hook ─────────────────────────────────────────────────────
export const useMusic = () => {
  const isMuted = useGameStore((s) => s.isMuted ?? false);

  const masterRef  = useRef(null);
  const outerLoop  = useRef(null);
  const innerLoop  = useRef(null);
  const currentZone = useRef(null);
  const initialized = useRef(false);
  const stoppedRef  = useRef(false);
  // Ambient MP3 vrstvy
  const ambientGainRef   = useRef(null);
  const ambientSourceRef = useRef(null);
  const ambientZone      = useRef(null);

  // ── Inicializace ─────────────────────────────────────────
  const init = useCallback(async () => {
    if (initialized.current || stoppedRef.current) return;

    const ctx = getCtx();
    if (!ctx) return;

    await resumeCtx(ctx);

    // Master gain — celková hlasitost
    const master = ctx.createGain();
    master.gain.setValueAtTime(isMuted ? 0 : 0.75, ctx.currentTime);
    master.connect(ctx.destination);
    masterRef.current = master;

    // Ambient gain — pro MP3 vrstvy (ptáci, vodopád)
    const ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    ambientGain.connect(master);
    ambientGainRef.current = ambientGain;

    // Vytvoř obě smyčky — startují tiše
    outerLoop.current = createLoop(ctx, master, OUTER_CONFIG);
    innerLoop.current = createLoop(ctx, master, INNER_CONFIG);

    initialized.current = true;
  }, [isMuted]);

  // ── Přepnutí zóny ────────────────────────────────────────
  const switchToZone = useCallback(async (zone) => {
    if (stoppedRef.current) return;
    if (currentZone.current === zone && initialized.current) return;

    if (!initialized.current) {
      await init();
    }

    const ctx = getCtx();
    if (!ctx || !outerLoop.current || !innerLoop.current) return;
    await resumeCtx(ctx);

    currentZone.current = zone;

    if (zone === "outer") {
      outerLoop.current.fadeIn(3);
      innerLoop.current.fadeOut(2.5);
    } else if (zone === "inner") {
      innerLoop.current.fadeIn(3);
      outerLoop.current.fadeOut(2.5);
    }

    // Ambient MP3 - nacti a prehraj spravny soubor
    if (ambientGainRef.current && ambientZone.current !== zone) {
      ambientZone.current = zone;
      const ambientFile = zone === "outer"
        ? "/cesta-do-raje/sounds/ambient-outer.mp3"
        : "/cesta-do-raje/sounds/ambient-inner.mp3";

      // Fade out stary ambient
      const ag = ambientGainRef.current;
      const now = ctx.currentTime;
      ag.gain.cancelScheduledValues(now);
      ag.gain.setValueAtTime(ag.gain.value, now);
      ag.gain.linearRampToValueAtTime(0, now + 2);

      // Zastav stary source
      try { ambientSourceRef.current?.stop(); } catch {}
      ambientSourceRef.current = null;

      // Nacti a spust novy
      setTimeout(async () => {
        if (stoppedRef.current) return;
        const buffer = await loadAudio(ctx, ambientFile);
        if (!buffer || stoppedRef.current) return;
        const src = createAmbientSource(ctx, buffer, ag);
        ambientSourceRef.current = src;
        // Fade in
        const now2 = ctx.currentTime;
        ag.gain.cancelScheduledValues(now2);
        ag.gain.setValueAtTime(0, now2);
        ag.gain.linearRampToValueAtTime(0.55, now2 + 3);
      }, 2200);
    }
  }, [init]);

  // ── Zastavení ────────────────────────────────────────────
  const stop = useCallback(() => {
    if (!initialized.current) return;
    stoppedRef.current = true;

    outerLoop.current?.fadeOut(1.2);
    innerLoop.current?.fadeOut(1.2);

    // Fade out ambient
    if (ambientGainRef.current) {
      const ctx2 = getCtx();
      if (ctx2) {
        ambientGainRef.current.gain.linearRampToValueAtTime(0, ctx2.currentTime + 1.2);
      }
    }
    setTimeout(() => {
      try { ambientSourceRef.current?.stop(); } catch {}
      ambientSourceRef.current = null;
    }, 1400);

    // Zastavíme oscilátory po fade-outu
    setTimeout(() => {
      outerLoop.current?.stop();
      innerLoop.current?.stop();
      try {
        masterRef.current?.disconnect();
      } catch {}
      masterRef.current  = null;
      outerLoop.current  = null;
      innerLoop.current  = null;
      currentZone.current = null;
      initialized.current = false;
      stoppedRef.current  = false;
    }, 1400);
  }, []);

  // ── Reakce na změnu isMuted ───────────────────────────────
  useEffect(() => {
    if (!masterRef.current || !initialized.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    masterRef.current.gain.linearRampToValueAtTime(
      isMuted ? 0 : 0.75,
      ctx.currentTime + 0.4
    );
  }, [isMuted]);

  // ── Cleanup při unmount ───────────────────────────────────
  useEffect(() => {
    return () => { stop(); };
  }, []);

  return { init, switchToZone, stop };
};
