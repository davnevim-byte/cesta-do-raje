// ============================================================
//  InnerCircleTransition — velký přechod svět → sbor
//  Opravy: canvas resize bug, player null guard,
//          spolehlivý fade-out přes AnimatePresence
// ============================================================

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAvatarComponent, getAvatarColor } from "../board/AvatarSVG";

// ── Zlaté konfety ─────────────────────────────────────────────
const GoldConfetti = () => {
  const canvasRef = useRef(null);
  const ptsRef    = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    // Nastavení rozměrů — jen jednou při mountu, ne při každém resize
    // (fixní velikost = žádný scale akumulační bug)
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const W = c.offsetWidth || window.innerWidth;
      const H = c.offsetHeight || window.innerHeight;
      c.width  = W * dpr;
      c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // setTransform místo scale — nesmí se akumulovat
    };
    setSize();

    const W = c.offsetWidth || window.innerWidth;
    const H = c.offsetHeight || window.innerHeight;

    // Burst konfet ze středu obrazovky
    const COLORS = ["#f5d76e","#FAC775","#EF9F27","#9FE1CB","#ffffff","#1D9E75","#5DCAA5"];
    for (let i = 0; i < 130; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 5 + Math.random() * 13;
      ptsRef.current.push({
        x: W * 0.5, y: H * 0.45,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 3,
        rot: Math.random() * 360,
        rv:  (Math.random() - 0.5) * 9,
        sz:  4 + Math.random() * 9,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        rect: Math.random() > 0.45,
        life: 1,
      });
    }

    const loop = () => {
      const W = c.offsetWidth || window.innerWidth;
      const H = c.offsetHeight || window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      ptsRef.current = ptsRef.current.filter((p) => p.life > 0.015 && p.y < H + 20);
      ptsRef.current.forEach((p) => {
        p.x   += p.vx;
        p.y   += p.vy;
        p.vy  += 0.22;
        p.vx  *= 0.99;
        p.rot += p.rv;
        p.life -= 0.011;

        ctx.save();
        ctx.globalAlpha = Math.min(p.life, 1);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.col;
        if (p.rect) {
          ctx.fillRect(-p.sz / 2, -p.sz / 4, p.sz, p.sz / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.sz / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ptsRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
      }}
    />
  );
};

// ── Zlaté paprsky ze středu ───────────────────────────────────
const LightBeams = () => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid slice"
  >
    {Array.from({ length: 16 }, (_, i) => {
      const a  = (i / 12) * Math.PI * 2;
      const x1 = 200 + 185 * Math.cos(a);
      const y1 = 200 + 185 * Math.sin(a);
      return (
        <motion.line
          key={i}
          x1={x1} y1={y1} x2={200} y2={200}
          stroke="#f5d76e"
          strokeWidth={2.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0] }}
          transition={{ duration: 1.4, delay: i * 0.06, ease: "easeOut" }}
        />
      );
    })}
    <motion.circle
      cx={200} cy={200} r={20}
      fill="none" stroke="#f5d76e" strokeWidth={2.5}
      animate={{ r: [20, 95, 65], opacity: [0, 0.8, 0.3] }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    />
  </svg>
);

// ── Hlavní komponenta ─────────────────────────────────────────
const InnerCircleTransition = ({ player, onDone }) => {
  const [visible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Guard — player může být null
  const color   = player ? getAvatarColor(player.avatarId)   : "#1D9E75";
  const AvatarC = player ? getAvatarComponent(player.avatarId) : null;

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 500);
    const t2 = setTimeout(() => setVisible(false), 4500);
    const t3 = setTimeout(() => onDone?.(), 5200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="inner-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position:       "fixed",
            inset:          0,
            zIndex:         500,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            background:     "rgba(3,12,8,0.97)",
            overflow:       "hidden",
          }}
        >
          {/* Světelná exploze */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 4.5, 3.0], opacity: [0, 0.75, 0.35] }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              position:     "absolute",
              width:        320, height: 320,
              borderRadius: "50%",
              background:   "radial-gradient(circle, rgba(245,215,110,0.7) 0%, rgba(29,158,117,0.35) 40%, rgba(159,225,203,0.1) 65%, transparent 75%)",
              pointerEvents:"none",
            }}
          />

          {/* Pulsujici zlaty kruh */}
          <motion.div
            animate={{ scale: [0, 1.5, 2.5], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.0, ease: "easeOut", delay: 0.3 }}
            style={{
              position: "absolute",
              width: 200, height: 200,
              borderRadius: "50%",
              border: "3px solid #f5d76e",
              pointerEvents: "none",
            }}
          />
          <motion.div
            animate={{ scale: [0, 1.8, 3.2], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.4, ease: "easeOut", delay: 0.5 }}
            style={{
              position: "absolute",
              width: 200, height: 200,
              borderRadius: "50%",
              border: "2px solid #9FE1CB",
              pointerEvents: "none",
            }}
          />
          <LightBeams />
          <GoldConfetti />

          {/* Obsah — avatar + text */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                key="content"
                initial={{ scale: 0.3, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.55, ease: "backOut" }}
                style={{
                  position:      "relative",
                  zIndex:        10,
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "center",
                  gap:           14,
                  textAlign:     "center",
                  padding:       "0 24px",
                }}
              >
                {/* Avatar */}
                {AvatarC && (
                  <motion.div
                    animate={{ rotate: [0, -6, 6, -3, 3, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position:     "relative",
                      width:        100, height: 100,
                      borderRadius: "50%",
                      border:       `5px solid ${color}`,
                      overflow:     "hidden",
                      boxShadow:    `0 0 50px ${color}aa, 0 0 90px rgba(245,215,110,0.4), 0 0 20px rgba(245,215,110,0.6)`,
                    }}
                  >
                    <AvatarC size={100} />

                    {/* Hvězda nad avatarem */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ delay: 0.2, duration: 0.45, ease: "backOut" }}
                      style={{
                        position: "absolute", top: -18, left: "50%",
                        transform: "translateX(-50%)",
                        fontSize: 28, pointerEvents: "none",
                      }}
                    >✨</motion.div>
                  </motion.div>
                )}

                {/* Jméno */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                >
                  <div style={{
                    fontSize: 26, fontWeight: 700,
                    color: "#f5d76e", fontFamily: "Georgia, serif",
                    textShadow: "0 0 28px rgba(245,215,110,0.6)",
                    marginBottom: 6,
                  }}>
                    {player?.name ?? "Hráč"}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.45, ease: "backOut" }}
                    style={{
                      fontSize: 16, fontWeight: 600,
                      color: "#9FE1CB", fontFamily: "Georgia, serif",
                      letterSpacing: 1.5, marginBottom: 10,
                    }}
                  >
                    VSTOUPIL/A DO SBORU 🌿
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ fontSize: 13, color: "#5DCAA5", fontStyle: "italic", maxWidth: 270 }}
                  >
                    "Nezapomeňte na laskavost vůči cizím — tak totiž někteří nevědomky pohostili anděly"
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    style={{ fontSize: 10, color: "#0F6E56", marginTop: 4, letterSpacing: 1 }}
                  >
                    Hebrejum 13:1-2 · jw.org
                  </motion.div>
                </motion.div>

                {/* Odznak */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 0.45, ease: "backOut" }}
                  style={{
                    padding: "9px 22px",
                    background: "rgba(245,215,110,0.14)",
                    border: "2px solid #f5d76e",
                    borderRadius: 30,
                    fontSize: 13, fontWeight: 700,
                    color: "#f5d76e", letterSpacing: 1,
                  }}
                >
                  🌿 NOVÝ ČLEN SBORU
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InnerCircleTransition;
