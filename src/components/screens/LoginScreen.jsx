// ============================================================
//  LoginScreen — přihlašovací obrazovka
//  Animované SVG pozadí: cesta, krajina, hvězdy, světlo
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSaveGame } from "../../hooks/useSaveGame";

// ─── Animovaná krajina ──────────────────────────────────────

const AnimatedLandscape = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Hvězdy
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random() * 0.65,
      r: 0.5 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8,
    }));

    // Oblaka
    const clouds = Array.from({ length: 5 }, (_, i) => ({
      x: i * 0.22 + Math.random() * 0.1,
      y: 0.12 + Math.random() * 0.18,
      w: 0.18 + Math.random() * 0.14,
      h: 0.04 + Math.random() * 0.04,
      speed: 0.00004 + Math.random() * 0.00003,
      alpha: 0.06 + Math.random() * 0.08,
    }));

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      t += 0.008;

      // Pozadí — noční obloha přecházející do úsvitu
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      sky.addColorStop(0,   "#02020a");
      sky.addColorStop(0.4, "#04060f");
      sky.addColorStop(0.7, "#060c18");
      sky.addColorStop(1,   "#0a1a10");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Světlo na obzoru — úsvit
      const horizY = H * 0.58;
      const glow = ctx.createRadialGradient(W * 0.5, horizY, 0, W * 0.5, horizY, W * 0.6);
      glow.addColorStop(0,   "rgba(29,158,117,0.22)");
      glow.addColorStop(0.3, "rgba(29,158,117,0.08)");
      glow.addColorStop(0.6, "rgba(245,215,110,0.04)");
      glow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Sluníčko / světlo na obzoru
      const sunPulse = 0.95 + Math.sin(t * 0.4) * 0.05;
      const sunG = ctx.createRadialGradient(W*0.5, horizY, 0, W*0.5, horizY, W*0.18*sunPulse);
      sunG.addColorStop(0,   "rgba(245,215,110,0.55)");
      sunG.addColorStop(0.25,"rgba(245,215,110,0.15)");
      sunG.addColorStop(0.6, "rgba(29,158,117,0.06)");
      sunG.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = sunG;
      ctx.fillRect(0, 0, W, H);

      // Hvězdy
      stars.forEach((s) => {
        const brightness = 0.4 + 0.6 * Math.sin(s.phase + t * s.speed);
        // Hvězdy v horní části, postupně mizí u horizontu
        const fadeY = Math.max(0, 1 - s.y / 0.6);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${brightness * fadeY * 0.9})`;
        ctx.fill();
      });

      // Oblaka
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > 1.2) c.x = -0.2;
        ctx.beginPath();
        ctx.ellipse(c.x * W, c.y * H, c.w * W, c.h * H, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,180,220,${c.alpha})`;
        ctx.fill();
      });

      // Hory v pozadí
      const drawMountain = (pts, col) => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        pts.forEach(([px, py]) => ctx.lineTo(px * W, py * H));
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
      };

      // Vzdálené hory
      drawMountain([
        [0,0.75],[0.08,0.58],[0.18,0.72],[0.28,0.54],[0.38,0.68],
        [0.48,0.50],[0.58,0.64],[0.68,0.52],[0.78,0.62],[0.88,0.56],[1,0.70],
      ], "#060d14");

      // Bližší kopce
      drawMountain([
        [0,0.82],[0.12,0.68],[0.25,0.78],[0.38,0.64],[0.5,0.74],
        [0.62,0.66],[0.75,0.76],[0.88,0.68],[1,0.78],
      ], "#07120a");

      // Stromy vlevo
      const drawTree = (x, y, h, col) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - h*0.4, y + h);
        ctx.lineTo(x + h*0.4, y + h);
        ctx.closePath();
        ctx.fillStyle = col;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, y + h*0.3);
        ctx.lineTo(x - h*0.5, y + h*1.1);
        ctx.lineTo(x + h*0.5, y + h*1.1);
        ctx.closePath();
        ctx.fill();
      };

      const treeCol1 = "#051008";
      const treeCol2 = "#041208";
      // Levé stromy
      [[0.04,0.62,0.14],[0.09,0.66,0.11],[0.15,0.60,0.16],[0.21,0.67,0.10]].forEach(([x,y,h]) =>
        drawTree(x*W, y*H, h*H, treeCol1));
      // Pravé stromy
      [[0.79,0.63,0.13],[0.85,0.58,0.16],[0.91,0.65,0.11],[0.96,0.61,0.14]].forEach(([x,y,h]) =>
        drawTree(x*W, y*H, h*H, treeCol2));

      // Travnatá plocha
      const grass = ctx.createLinearGradient(0, H*0.75, 0, H);
      grass.addColorStop(0, "#061408");
      grass.addColorStop(1, "#040e06");
      ctx.fillStyle = grass;
      ctx.fillRect(0, H*0.74, W, H*0.26);

      // Cesta — perspektivní pruh vedoucí ke světlu
      const roadW = 0.18;
      const roadX = 0.5;
      ctx.beginPath();
      ctx.moveTo((roadX - roadW*0.08) * W, horizY);
      ctx.lineTo((roadX + roadW*0.08) * W, horizY);
      ctx.lineTo((roadX + roadW*0.5)  * W, H);
      ctx.lineTo((roadX - roadW*0.5)  * W, H);
      ctx.closePath();
      const road = ctx.createLinearGradient(0, horizY, 0, H);
      road.addColorStop(0, "rgba(245,215,110,0.35)");
      road.addColorStop(0.3,"rgba(100,160,80,0.15)");
      road.addColorStop(1,  "rgba(50,100,50,0.25)");
      ctx.fillStyle = road;
      ctx.fill();

      // Čárkovaná středová linie cesty
      const dashCount = 8;
      for (let i = 0; i < dashCount; i++) {
        const prog = i / dashCount;
        const nextProg = (i + 0.5) / dashCount;
        const cx1 = roadX * W;
        const cy1 = horizY + (H - horizY) * prog;
        const cy2 = horizY + (H - horizY) * nextProg;
        const hw1 = roadW * 0.02 * W * (0.1 + prog * 0.9);
        const hw2 = roadW * 0.02 * W * (0.1 + nextProg * 0.9);
        ctx.beginPath();
        ctx.moveTo(cx1 - hw1, cy1);
        ctx.lineTo(cx1 + hw1, cy1);
        ctx.lineTo(cx1 + hw2, cy2);
        ctx.lineTo(cx1 - hw2, cy2);
        ctx.closePath();
        ctx.fillStyle = `rgba(245,215,110,${0.15 + prog * 0.2})`;
        ctx.fill();
      }

      // Světlusky v trávě
      if (Math.random() < 0.02) {
        stars.push({
          x: 0.2 + Math.random() * 0.6,
          y: 0.75 + Math.random() * 0.2,
          r: 1 + Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random(),
        });
        if (stars.length > 140) stars.shift();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        display: "block",
      }}
    />
  );
};

// ─── Plovoucí částice ────────────────────────────────────────

const FloatingParticle = ({ delay, x }) => (
  <motion.div
    initial={{ y: "100vh", opacity: 0, x: `${x}vw` }}
    animate={{ y: "-20px", opacity: [0, 0.8, 0.8, 0] }}
    transition={{ duration: 6 + Math.random() * 4, delay, repeat: Infinity, ease: "easeOut" }}
    style={{
      position: "absolute", bottom: 0,
      width: 3 + Math.random() * 3,
      height: 3 + Math.random() * 3,
      borderRadius: "50%",
      background: Math.random() > 0.5 ? "#9FE1CB" : "#FAC775",
      pointerEvents: "none",
    }}
  />
);

// ─── Hlavní LoginScreen ──────────────────────────────────────

export const LoginScreen = () => {
  const checkPassword = useGameStore((s) => s.checkPassword);
  const { hasSavedGame, savedAtFormatted, getSavedPlayerNames } = useSaveGame();

  const [input,  setInput]  = useState("");
  const [error,  setError]  = useState("");
  const [shake,  setShake]  = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = checkPassword(input);
    if (!ok) {
      setError("Heslo je nesprávné.");
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setInput("");
    }
  };

  const savedNames = getSavedPlayerNames();
  const particles  = Array.from({ length: 18 }, (_, i) => ({
    delay: i * 0.7,
    x: 5 + Math.random() * 90,
  }));

  return (
    <div style={{
      position:   "relative",
      minHeight:  "100dvh",
      overflow:   "hidden",
      display:    "flex",
      alignItems: "center",
      justifyContent: "center",
      padding:    "24px 16px",
    }}>
      {/* Živé pozadí */}
      <AnimatedLandscape />

      {/* Plovoucí světlusky */}
      {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* Tmavý vignette overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }} />

      {/* Obsah */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 24 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{
          position:      "relative",
          zIndex:        10,
          width:         "100%",
          maxWidth:      360,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           24,
        }}
      >
        {/* Logo + název */}
        <div style={{ textAlign: "center" }}>
          <motion.div
            animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: 64, marginBottom: 10, lineHeight: 1 }}
          >
            🌿
          </motion.div>
          <h1 style={{
            fontSize:      32,
            fontWeight:    700,
            color:         "#9FE1CB",
            margin:        0,
            letterSpacing: 1,
            fontFamily:    "Georgia, serif",
            textShadow:    "0 0 40px rgba(29,158,117,0.5)",
          }}>
            Cesta do Ráje
          </h1>
          <p style={{
            fontSize:   13,
            color:      "#5DCAA5",
            margin:     "6px 0 0",
            letterSpacing: 2,
            fontFamily: "Georgia, serif",
          }}>
            BIBLICKÁ DESKOVÁ HRA
          </p>
        </div>

        {/* Uložená hra */}
        <AnimatePresence>
          {hasSavedGame && savedNames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                width:        "100%",
                background:   "rgba(239,159,39,0.1)",
                border:       "1px solid rgba(239,159,39,0.3)",
                borderRadius: 12,
                padding:      "12px 16px",
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: 10, color: "#854F0B", marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>
                ULOŽENÁ HRA · {savedAtFormatted}
              </div>
              <div style={{ fontSize: 13, color: "#FAC775" }}>
                {savedNames.join(", ")}
              </div>
              <div style={{ fontSize: 11, color: "#633806", marginTop: 3 }}>
                Tvůj postup bude obnoven automaticky.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulář hesla */}
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{
            width:         "100%",
            display:       "flex",
            flexDirection: "column",
            gap:           12,
          }}
        >
          <div style={{
            background:     "rgba(5,10,8,0.75)",
            border:         `1.5px solid ${error ? "#E24B4A" : "rgba(29,158,117,0.4)"}`,
            borderRadius:   14,
            padding:        "2px 4px",
            display:        "flex",
            alignItems:     "center",
            backdropFilter: "blur(12px)",
            transition:     "border-color 0.2s",
          }}>
            <span style={{ fontSize: 20, padding: "0 8px" }}>🔑</span>
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(""); }}
              placeholder="Zadejte heslo..."
              autoFocus
              style={{
                flex:       1,
                padding:    "14px 8px",
                background: "transparent",
                border:     "none",
                color:      "#e8e8e8",
                fontSize:   16,
                fontFamily: "inherit",
                outline:    "none",
              }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontSize: 12, color: "#E24B4A", textAlign: "center" }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding:        "15px",
              background:     "rgba(29,158,117,0.85)",
              border:         "1.5px solid #1D9E75",
              borderRadius:   14,
              color:          "#fff",
              fontSize:       16,
              fontWeight:     700,
              cursor:         "pointer",
              fontFamily:     "Georgia, serif",
              letterSpacing:  1,
              backdropFilter: "blur(8px)",
              transition:     "background 0.2s",
            }}
          >
            Vstoupit na cestu →
          </motion.button>
        </motion.form>

        {/* Odkaz na jw.org */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          style={{
            fontSize:   11,
            color:      "#9FE1CB",
            textAlign:  "center",
            letterSpacing: 1,
          }}
        >
          jw.org · Galatským 5:22–23
        </motion.p>
      </motion.div>
    </div>
  );
};
