// ============================================================
//  EndScreen — velký ceremoniál výhry
//  3D CSS srdce, fyzikální konfety, dramatický reveal titulů
// ============================================================

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { useSound } from "../../hooks/useSound";
import { getAvatarComponent, getAvatarColor } from "../board/AvatarSVG";
import { FruitBadge } from "../ui/FlashOverlay";
import CertificateModal from "../modals/CertificateModal";

// ── Fyzikální konfety ─────────────────────────────────────────

const ConfettiCanvas = ({ active }) => {
  const canvasRef = useRef(null);
  const pts       = useRef([]);
  const raf       = useRef(null);

  const COLORS = ["#1D9E75","#9FE1CB","#EF9F27","#FAC775",
    "#D4537E","#E74C3C","#378ADD","#85B7EB","#f5d76e","#fff"];

  const burst = useCallback((n = 80) => {
    const c = canvasRef.current;
    if (!c) return;
    const W = c.width / window.devicePixelRatio;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 5 + Math.random() * 11;
      pts.current.push({
        x: W * (0.2 + Math.random() * 0.6),
        y: -10,
        vx: Math.cos(a) * s * 0.5,
        vy: 1 + Math.random() * 6,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 9,
        sz: 5 + Math.random() * 10,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        rect: Math.random() > 0.5,
        life: 1,
      });
    }
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");

    const resize = () => {
      c.width  = c.offsetWidth  * window.devicePixelRatio;
      c.height = c.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const loop = () => {
      const W = c.offsetWidth, H = c.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      pts.current = pts.current.filter((p) => p.alpha > 0.01 && p.y < H + 20);
      pts.current.forEach((p) => {
        p.x  += p.vx; p.y += p.vy;
        p.vy += 0.2; p.vx *= 0.99;
        p.rot += p.rv;
        p.life -= 0.006;
        p.alpha = Math.max(0, p.life);
        ctx.save();
        ctx.globalAlpha = p.alpha;
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
      raf.current = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    if (!active) return;
    burst(100);
    const t1 = setTimeout(() => burst(70), 900);
    const t2 = setTimeout(() => burst(50), 1800);
    return () => [t1, t2].forEach(clearTimeout);
  }, [active]);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 150,
    }} />
  );
};

// ── CSS 3D Srdce ──────────────────────────────────────────────

const Heart3D = () => (
  <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto" }}>
    <motion.div
      animate={{ rotateY: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      style={{ width: "100%", height: "100%" }}
    >
      <svg viewBox="0 0 100 90" style={{
        width: "100%",
        filter: "drop-shadow(0 0 18px rgba(29,158,117,0.9)) drop-shadow(0 0 6px rgba(159,225,203,0.5))",
      }}>
        <defs>
          <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#9FE1CB"/>
            <stop offset="40%"  stopColor="#1D9E75"/>
            <stop offset="100%" stopColor="#085041"/>
          </linearGradient>
        </defs>
        <path
          d="M50 80 C50 80 5 50 5 25 C5 10 20 0 35 5 C42 8 50 15 50 15 C50 15 58 8 65 5 C80 0 95 10 95 25 C95 50 50 80 50 80Z"
          fill="url(#hg)"
        />
        <path d="M28 12 C34 10 44 14 48 20" stroke="rgba(255,255,255,0.4)"
          strokeWidth="3" fill="none" strokeLinecap="round"/>
        {[[20,35],[75,30],[50,55],[30,60],[70,50]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="2.5" fill="#FAC775" opacity="0.8"/>
        ))}
      </svg>
    </motion.div>
    <motion.div
      animate={{ scale:[1,1.4,1], opacity:[0.3,0.7,0.3] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        position:"absolute", bottom:-8, left:"50%",
        transform:"translateX(-50%)",
        width:70, height:16, borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(29,158,117,0.7) 0%,transparent 70%)",
        filter:"blur(5px)",
      }}
    />
  </div>
);

// ── Rank badge ────────────────────────────────────────────────
const RankBadge = ({ rank, size = 36 }) => {
  const medals = { 1: { bg: "#d4ac0d", text: "#fff", label: "1." },
                   2: { bg: "#9a9a9a", text: "#fff", label: "2." },
                   3: { bg: "#c87941", text: "#fff", label: "3." } };
  const m = medals[rank];
  if (!m) return (
    <div style={{ width: size, height: size, borderRadius: "50%",
      background: "rgba(255,255,255,0.06)", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, color: "#555", fontWeight: 700 }}>
      {rank}
    </div>
  );
  return (
    <motion.div
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: rank * 0.3 }}
      style={{ width: size, height: size, borderRadius: "50%",
        background: m.bg, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: size * 0.38, color: m.text,
        fontWeight: 800, boxShadow: `0 0 14px ${m.bg}88`, flexShrink: 0 }}>
      {m.label}
    </motion.div>
  );
};

// ── Karta hráče ───────────────────────────────────────────────
const PlayerCard = ({ player, rank, delay }) => {
  const [shown, setShown] = useState(false);
  const color   = getAvatarColor(player.avatarId);
  const AvatarC = getAvatarComponent(player.avatarId);
  const isWin   = player.circle === "inner";
  const isFirst = rank === 1;
  const td      = player.titleData;
  const total   = td?.totalScore ?? 0;

  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay * 1000 + 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "backOut" }}
      style={{
        background: isFirst
          ? `linear-gradient(135deg, ${color}22, ${color}08)`
          : isWin ? `${color}10` : "rgba(255,255,255,0.03)",
        border: `${isFirst ? 2 : isWin ? 1.5 : 1}px solid ${
          isFirst ? color : isWin ? color + "88" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16,
        padding: isFirst ? "16px 16px" : "12px 14px",
        display: "flex", alignItems: "center", gap: 12,
        position: "relative", overflow: "hidden",
        boxShadow: isFirst ? `0 0 28px ${color}33` : "none",
      }}
    >
      {/* Zlatý shimmer pro 1. místo */}
      {isFirst && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Rank badge */}
      <RankBadge rank={rank} size={isFirst ? 42 : 34} />

      {/* Avatar */}
      <motion.div
        animate={isFirst ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          border: `${isFirst ? 3 : 2}px solid ${isWin ? color : color + "55"}`,
          borderRadius: "50%", flexShrink: 0,
          boxShadow: isWin ? `0 0 14px ${color}66` : "none",
        }}
      >
        <AvatarC size={isFirst ? 52 : 44} />
      </motion.div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: isFirst ? 17 : 14, fontWeight: 700,
          color: isWin ? color : "#e8e8e8", marginBottom: 3,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {player.name}
          {isWin && <span style={{ fontSize: 14 }}>🌿</span>}
        </div>

        <div style={{ fontSize: 11, color: "#555", marginBottom: 5 }}>
          {player.circle === "inner"
            ? "Dosahl/a sboru"
            : `Policko ${player.position + 1}`}
        </div>

        {/* Titul */}
        <AnimatePresence>
          {shown && td && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "inline-block", fontSize: 10,
                padding: "2px 10px",
                background: `${color}20`,
                border: `1px solid ${color}44`,
                borderRadius: 10, color, fontWeight: 600,
                marginBottom: 5,
              }}
            >
              {td.prefix} · {td.title}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ovoce + skore */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {td?.topFruits?.filter(f => f.score > 0).slice(0, 3).map((f) => (
            <div key={f.key} style={{
              display: "flex", alignItems: "center", gap: 3,
              fontSize: 10, color: "#666",
            }}>
              <span style={{ fontSize: 13 }}>{f.emoji}</span>
              <span>{f.score}x</span>
            </div>
          ))}
          {total > 0 && (
            <div style={{
              marginLeft: "auto",
              fontSize: 11, fontWeight: 700,
              color: color + "cc",
              padding: "1px 8px",
              background: `${color}12`,
              borderRadius: 8,
            }}>
              {total} b.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Hlavní EndScreen ──────────────────────────────────────────

export const EndScreen = () => {
  const endResults  = useGameStore((s) => s.endResults);
  const restartGame = useGameStore((s) => s.restartGame);
  const goToLogin   = useGameStore((s) => s.goToLogin);
  const { sounds }  = useSound();
  const [phase, setPhase] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [showCerts, setShowCerts] = useState(false);

  useEffect(() => {
    if (!endResults) return;
    sounds.victory();
    const t0 = setTimeout(() => setShowWinner(true), 800);
    const t1 = setTimeout(() => setPhase(1), 2000);
    const t2 = setTimeout(() => setPhase(2), 4000);
    return () => [t0,t1,t2].forEach(clearTimeout);
  }, []);

  if (!endResults) return null;

  const { players, awards, reason } = endResults;
  const winners = players.filter((p) => p.circle === "inner");
  const sorted  = [...players].sort((a, b) => {
    if (a.circle==="inner" && b.circle!=="inner") return -1;
    if (b.circle==="inner" && a.circle!=="inner") return 1;
    return b.position - a.position;
  });

  return (
    <div style={{ minHeight:"100dvh", background:"#060810", overflowY:"auto", position:"relative" }}>
      <ConfettiCanvas active />

      {/* Záře */}
      <motion.div
        animate={{ opacity:[0.05,0.2,0.05] }}
        transition={{ duration:3, repeat:Infinity }}
        style={{
          position:"fixed", inset:0,
          background:"radial-gradient(ellipse at 50% 0%,rgba(29,158,117,0.2) 0%,transparent 60%)",
          pointerEvents:"none", zIndex:0,
        }}
      />

      <div style={{ maxWidth:520, margin:"0 auto", padding:"32px 16px 60px", position:"relative", zIndex:1 }}>

        {/* Srdce + nadpis */}
        <motion.div
          initial={{ opacity:0, scale:0.5 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.8, ease:"backOut" }}
          style={{ textAlign:"center", marginBottom:28 }}
        >
          <Heart3D />

          <motion.h1
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.4 }}
            style={{
              fontSize:28, fontWeight:700,
              color: winners.length > 0 ? "#9FE1CB" : "#FAC775",
              margin:"16px 0 6px", fontFamily:"Georgia,serif",
              textShadow:"0 0 30px rgba(159,225,203,0.4)",
            }}
          >
            {winners.length > 0
              ? winners.length===1 ? `${winners[0].name} dosáhl/a Ráje! 🌿` : "Ráje bylo dosaženo! 🌿"
              : reason==="timeout" ? "Čas vypršel!" : "Hra skončila!"}
          </motion.h1>

          <motion.p
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
            style={{ fontSize:13, color:"#0F6E56", margin:0 }}
          >
            {winners.length > 0 ? "Věrnost a vytrvalost přinesly ovoce." : "Každá cesta s Jehovou má svou hodnotu."}
          </motion.p>
        </motion.div>

        {/* Velký winner reveal */}
        <AnimatePresence>
          {showWinner && winners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "backOut" }}
              style={{
                textAlign: "center", marginBottom: 20,
                padding: "20px 16px",
                background: `linear-gradient(135deg, ${getAvatarColor(winners[0]?.avatarId)}18, transparent)`,
                border: `1.5px solid ${getAvatarColor(winners[0]?.avatarId)}44`,
                borderRadius: 18,
                boxShadow: `0 0 40px ${getAvatarColor(winners[0]?.avatarId)}22`,
              }}
            >
              {winners.length === 1 ? (
                <>
                  {/* Avatar viteze velky */}
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    style={{ display: "inline-block", marginBottom: 10 }}
                  >
                    {(() => {
                      const WinAvatar = getAvatarComponent(winners[0].avatarId);
                      const wColor = getAvatarColor(winners[0].avatarId);
                      return (
                        <div style={{
                          border: `4px solid ${wColor}`,
                          borderRadius: "50%",
                          boxShadow: `0 0 30px ${wColor}88`,
                          display: "inline-block",
                        }}>
                          <WinAvatar size={80} />
                        </div>
                      );
                    })()}
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      fontSize: 24, fontWeight: 800,
                      color: getAvatarColor(winners[0].avatarId),
                      fontFamily: "Georgia, serif",
                      textShadow: `0 0 20px ${getAvatarColor(winners[0].avatarId)}66`,
                      marginBottom: 4,
                    }}
                  >
                    {winners[0].name}
                  </motion.div>
                  <div style={{ fontSize: 13, color: "#9FE1CB", marginBottom: 6 }}>
                    Dosahl/a Raje!
                  </div>
                  {winners[0].titleData && (
                    <div style={{
                      fontSize: 11, color: getAvatarColor(winners[0].avatarId),
                      padding: "3px 14px",
                      background: `${getAvatarColor(winners[0].avatarId)}15`,
                      border: `1px solid ${getAvatarColor(winners[0].avatarId)}33`,
                      borderRadius: 20, display: "inline-block",
                    }}>
                      {winners[0].titleData.prefix} · {winners[0].titleData.title}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 18, fontWeight: 700, color: "#9FE1CB" }}>
                  {winners.map(w => w.name).join(" & ")} dosahli Raje!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hráčské karty */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
              {sorted.map((p, i) => (
                <PlayerCard key={p.id} player={p} rank={i+1} delay={i*0.14} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ceny */}
        <AnimatePresence>
          {phase >= 2 && awards?.length > 0 && (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:"#555", fontWeight:600, letterSpacing:1, textAlign:"center", marginBottom:12 }}>
                SPECIÁLNÍ CENY
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:8 }}>
                {awards.filter((a) => a.winner || a.winners?.length).map((a) => (
                  <motion.div key={a.id}
                    initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                    style={{
                      background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                      borderRadius:12, padding:12, textAlign:"center",
                    }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{a.emoji}</div>
                    <div style={{ fontSize:10, color:"#555", marginBottom:4 }}>{a.title}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#9FE1CB" }}>
                      {a.winners ? a.winners.join(", ")||"—" : a.winner||"—"}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duchovní citát */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              style={{
                textAlign:"center", padding:"18px 20px",
                background:"rgba(29,158,117,0.06)",
                border:"1px solid rgba(29,158,117,0.15)",
                borderRadius:14, marginBottom:24,
              }}>
              <div style={{ fontSize:13, color:"#5DCAA5", lineHeight:1.7, fontStyle:"italic", fontFamily:"Georgia,serif" }}>
                „Pravá Cesta do Ráje začíná každý den v osobním studiu Bible, modlitbě a věrné kazatelské službě."
              </div>
              <div style={{ fontSize:10, color:"#0F6E56", marginTop:8, letterSpacing:1 }}>
                jw.org · Galatským 6:9
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tlačítka */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.3 }}
              style={{ display:"flex", gap:10 }}>
              <motion.button onClick={restartGame}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                style={{
                  flex:1, padding:"14px",
                  background:"#1D9E75", border:"none",
                  borderRadius:12, color:"#fff",
                  fontSize:15, fontWeight:700,
                  cursor:"pointer", fontFamily:"Georgia,serif",
                }}>
                🔄 Nová hra
              </motion.button>
              <button onClick={goToLogin}
                style={{
                  padding:"14px 20px",
                  background:"transparent", border:"1px solid #333",
                  borderRadius:12, color:"#555",
                  fontSize:14, cursor:"pointer", fontFamily:"inherit",
                }}>
                Odhlasit
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certifikaty */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.8 }}
              style={{ marginTop:16 }}>
              <motion.button
                onClick={() => setShowCerts(true)}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                style={{
                  width:"100%", padding:"13px",
                  background:"rgba(212,172,13,0.1)",
                  border:"1.5px solid rgba(212,172,13,0.4)",
                  borderRadius:12, color:"#FAC775",
                  fontSize:14, fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit",
                }}>
                Certifikaty hracu ke stazeni
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Certificate modal */}
      {showCerts && (
        <CertificateModal
          players={sorted}
          onClose={() => setShowCerts(false)}
        />
      )}
    </div>
  );
};
