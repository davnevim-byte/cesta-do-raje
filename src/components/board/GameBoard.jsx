// ============================================================
//  GameBoard — herní deska
//  Klíčová oprava: figurky jsou HTML elementy nad SVG
//  → avatary se zobrazí správně na všech zařízeních
// ============================================================

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { OUTER_TILES, INNER_TILES } from "../../data/tiles";
import { getAvatarComponent, getAvatarColor } from "./AvatarSVG";
import DiceRoller3D from "./DiceRoller3D";
// ── Konstanty ─────────────────────────────────────────────────
const W = 700, H = 700, CX = 350, CY = 350;
const OUTER_R = 280, INNER_R = 165, PARADISE_R = 72;
const OUTER_TR = 20, INNER_TR = 17;

const tilePos = (i, total, r) => {
  const a = (i / total) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
};

const TC = {
  negative: { fill: "#1a0505", stroke: "#c0392b", glow: "#e74c3c" },
  doors:    { fill: "#1a1404", stroke: "#d4ac0d", glow: "#f5d76e" },
  start:    { fill: "#041a0c", stroke: "#1D9E75", glow: "#9FE1CB" },
  empty:    { fill: "#0a0a0f", stroke: "#1a1a2a", glow: null },
  entry:    { fill: "#1a1404", stroke: "#d4ac0d", glow: "#f5d76e" },
  study:    { fill: "#041808", stroke: "#27ae60", glow: "#9FE1CB" },
  prayer:   { fill: "#031408", stroke: "#1D9E75", glow: "#5DCAA5" },
  special:  { fill: "#040c1a", stroke: "#2980b9", glow: "#85B7EB" },
};

// ── Hvězdičky (SVG) ───────────────────────────────────────────
const Stars = () => {
  const stars = useMemo(() => Array.from({ length: 40 }, (_, i) => {
    const a = Math.random() * Math.PI * 2;
    const r = INNER_R + 14 + Math.random() * (OUTER_R - INNER_R - 20);
    return {
      id: i,
      x: CX + r * Math.cos(a),
      y: CY + r * Math.sin(a),
      s: 0.7 + Math.random() * 1.5,
      dur: 1.5 + Math.random() * 3,
      del: Math.random() * 4,
      col: i % 3 === 0 ? "#9FE1CB" : i % 3 === 1 ? "#FAC775" : "#888",
    };
  }), []);
  return (
    <g>
      {stars.map((s) => (
        <motion.circle key={s.id} cx={s.x} cy={s.y} r={s.s} fill={s.col}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0] }}
          transition={{ duration: s.dur, delay: s.del, repeat: Infinity }} />
      ))}
    </g>
  );
};

// ── Světlušky sboru (SVG) ─────────────────────────────────────
const InnerGlow = () => {
  const pts = useMemo(() => Array.from({ length: 16 }, (_, i) => {
    const a = Math.random() * Math.PI * 2;
    const r = 20 + Math.random() * (INNER_R - PARADISE_R - 28);
    return { id: i, x: CX + r * Math.cos(a), y: CY + r * Math.sin(a),
      dur: 2 + Math.random() * 3, del: Math.random() * 3 };
  }), []);
  return (
    <g>
      {pts.map((p) => (
        <motion.circle key={p.id} cx={p.x} cy={p.y} r={1.3} fill="#9FE1CB"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, delay: p.del, repeat: Infinity }} />
      ))}
    </g>
  );
};

// ── Ráj (SVG) ─────────────────────────────────────────────────
const ParadiseCenter = () => (
  <g>
    <motion.circle cx={CX} cy={CY} r={PARADISE_R + 14}
      fill="none" stroke="#1D9E75" strokeWidth="1.5"
      animate={{ opacity: [0.1, 0.35, 0.1] }}
      transition={{ duration: 3, repeat: Infinity }} />
    <circle cx={CX} cy={CY} r={PARADISE_R} fill="#04100a" stroke="#1D9E75" strokeWidth="2" />
    <rect x={CX - 2} y={CY + 12} width={4} height={28} fill="#5a3010" />
    <circle cx={CX} cy={CY + 6}  r={20} fill="#0a4010" />
    <circle cx={CX - 9} cy={CY + 10} r={13} fill="#1D9E75" />
    <circle cx={CX + 9} cy={CY + 8}  r={14} fill="#0d5018" />
    <circle cx={CX} cy={CY - 4}  r={17} fill="#145c20" />
    <path d={`M${CX-28},${CY+14} Q${CX-23},${CY+30} ${CX-18},${CY+42}`}
      stroke="#5DCAA5" strokeWidth="3" fill="none" opacity="0.5" />
    <motion.circle cx={CX} cy={CY - 44} r={11} fill="#f5d76e" opacity="0.35"
      animate={{ opacity: [0.25, 0.55, 0.25], r: [11, 13, 11] }}
      transition={{ duration: 2.5, repeat: Infinity }} />
    <text x={CX} y={CY + 54} textAnchor="middle"
      fill="#9FE1CB" fontSize="8.5" fontWeight="600"
      fontFamily="Georgia,serif" letterSpacing="1.5">RÁJ</text>
  </g>
);

// ── Políčko (SVG) ─────────────────────────────────────────────
const ICONS = { negative:"!", doors:"D", start:"▶", entry:"⛪", study:"✦", prayer:"✿", special:"★", empty:"" };

const Tile = ({ tile, x, y, r, isLanding, isMovingHere, onEnter, onLeave }) => {
  const c = TC[tile.type] ?? TC.empty;
  return (
    <g onPointerEnter={tile.type !== "empty" ? onEnter : undefined}
      onPointerLeave={tile.type !== "empty" ? onLeave : undefined}
      style={{ cursor: tile.type !== "empty" ? "pointer" : "default", touchAction: "none" }}>
      {/* Puls během pohybu — rychlý a výrazný */}
      {isMovingHere && (
        <motion.circle cx={x} cy={y} r={r + 6}
          fill="none" stroke={c.glow ?? c.stroke} strokeWidth="2"
          animate={{ r: [r + 4, r + 14, r + 4], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 0.35, repeat: Infinity }} />
      )}
      {/* Puls při přistání — pomalejší */}
      {isLanding && !isMovingHere && c.glow && (
        <motion.circle cx={x} cy={y} r={r + 10}
          fill="none" stroke={c.glow} strokeWidth="1.5"
          animate={{ r: [r + 7, r + 16, r + 7], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }} />
      )}
      {tile.type === "doors" && (
        <motion.circle cx={x} cy={y} r={r}
          fill="none" stroke="#d4ac0d" strokeWidth="1.5"
          animate={{ r: [r, r + 7, r], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity }} />
      )}
      <circle cx={x} cy={y} r={r} fill={c.fill} stroke={c.stroke} strokeWidth={1.2} />
      {tile.type !== "empty" && (
        <text x={x} y={y + 3.5} textAnchor="middle"
          fill={c.stroke} fontSize={tile.type === "doors" ? 10 : 8.5}
          fontFamily="system-ui" pointerEvents="none">
          {ICONS[tile.type] ?? "?"}
        </text>
      )}
    </g>
  );
};

// ── Záře hráče v SVG ─────────────────────────────────────────
// (jen kruhy záře a šipka — samotný avatar je HTML nad SVG)
const PlayerGlow = ({ x, y, color, isActive, isZoomed }) => (
  <g>
    {/* Stín */}
    <ellipse cx={x} cy={y + 20} rx={14} ry={4} fill="black" opacity={0.3} />
    {/* Záře pro aktivního */}
    {isActive && (
      <motion.circle cx={x} cy={y} r={22}
        fill="none" stroke={color} strokeWidth={2}
        animate={{ r: [19, 27, 19], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }} />
    )}
    {/* Zoom burst */}
    {isZoomed && (
      <motion.circle cx={x} cy={y} r={18}
        fill={color}
        initial={{ r: 18, opacity: 0.7 }}
        animate={{ r: 38, opacity: 0 }}
        transition={{ duration: 0.55 }} />
    )}
    {/* Šipka nad aktivním */}
    {isActive && (
      <motion.g animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}>
        <polygon
          points={`${x},${y - 30} ${x - 6},${y - 21} ${x + 6},${y - 21}`}
          fill={color} opacity={0.9} />
      </motion.g>
    )}
  </g>
);

// ── HTML Avatar nad SVG ───────────────────────────────────────
// Dostane souřadnice v px (po přepočtu ze SVG viewBox na skutečnou velikost)
const PlayerAvatar = ({ player, pxX, pxY, isActive, isZoomed, color }) => {
  const AvatarComp = getAvatarComponent(player.avatarId);

  // Plynulý pohyb přes spring
  const sx = useSpring(pxX, { stiffness: 90, damping: 16 });
  const sy = useSpring(pxY, { stiffness: 90, damping: 16 });
  useEffect(() => { sx.set(pxX); }, [pxX]);
  useEffect(() => { sy.set(pxY); }, [pxY]);

  const SIZE = isActive ? 40 : 32;

  return (
    <motion.div
      style={{
        position:    "absolute",
        top:         0, left: 0,
        x:           useTransform(sx, (v) => v - SIZE / 2),
        y:           useTransform(sy, (v) => v - SIZE / 2),
        width:       SIZE,
        height:      SIZE,
        pointerEvents: "none",
        zIndex:      isActive ? 20 : 10,
      }}
    >
      {/* Poskakování */}
      <motion.div
        animate={isActive ? { y: [0, -8, 0, -5, 0] } : { y: 0 }}
        transition={isActive ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Kruh s barvou hráče */}
        <div style={{
          width:        SIZE,
          height:       SIZE,
          borderRadius: "50%",
          border:       `${isActive ? 3 : 2}px solid ${color}`,
          overflow:     "hidden",
          background:   "#060810",
          boxShadow:    isActive ? `0 0 12px ${color}88` : "none",
          transition:   "box-shadow 0.3s",
        }}>
          <AvatarComp size={SIZE} />
        </div>
      </motion.div>

      {/* Jméno pod avatarem — jen pro aktivního */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position:   "absolute",
            top:        SIZE + 4,
            left:       "50%",
            transform:  "translateX(-50%)",
            fontSize:   9,
            fontWeight: 700,
            color,
            whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            fontFamily: "Inter,sans-serif",
          }}
        >
          {player.name?.slice(0, 8)}
        </motion.div>
      )}
    </motion.div>
  );
};

// ── Zoom kamera ───────────────────────────────────────────────
const useCamera = (players, idx, isMoving) => {
  const [cam, setCam] = useState({ scale: 1, tx: 0, ty: 0, tilt: 0 });
  useEffect(() => {
    const p = players[idx];
    if (!p) return;
    const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
    const r     = p.circle === "outer" ? OUTER_R : INNER_R;
    const pos   = tilePos(p.position, tiles.length, r);
    setCam({ scale: 1.28, tx: CX - pos.x, ty: CY - pos.y, tilt: 0 });
    const t = setTimeout(() => setCam({ scale: 1, tx: 0, ty: 0, tilt: 0 }), 1300);
    return () => clearTimeout(t);
  }, [idx]);

  // Při pohybu políčko po políčku — nakloň desku do 45°
  useEffect(() => {
    if (isMoving) {
      const p = players[idx];
      if (!p) return;
      const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
      const r     = p.circle === "outer" ? OUTER_R : INNER_R;
      const pos   = tilePos(p.position, tiles.length, r);
      setCam({ scale: 1.5, tx: CX - pos.x, ty: CY - pos.y, tilt: 32 });
    } else {
      setCam((prev) => ({ ...prev, tilt: 0 }));
    }
  }, [isMoving, players[idx]?.position]);

  return cam;
};

// ── Přepočet SVG souřadnic → px ──────────────────────────────
// SVG viewBox je 700×700. Skutečná velikost elementu je jiná.
// Přepočet: pxX = svgX * (renderedWidth / 700)
const useSvgScale = (svgRef) => {
  const [scale, setScale] = useState({ sx: 1, sy: 1, ox: 0, oy: 0 });

  useEffect(() => {
    const update = () => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const parent = svgRef.current.parentElement?.getBoundingClientRect();
      setScale({
        sx: rect.width  / W,
        sy: rect.height / H,
        ox: rect.left - (parent?.left ?? 0),
        oy: rect.top  - (parent?.top  ?? 0),
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const svgToPx = useCallback((svgX, svgY) => ({
    x: svgX * scale.sx + scale.ox,
    y: svgY * scale.sy + scale.oy,
  }), [scale]);

  return svgToPx;
};

// ── Hlavní komponenta ─────────────────────────────────────────
const GameBoard = () => {
  const players  = useGameStore((s) => s.players);
  const curIdx   = useGameStore((s) => s.currentPlayerIndex);
  const isMoving = useGameStore((s) => s.isMoving);

  const [hovered, setHovered] = useState(null);
  const [zoomed,  setZoomed]  = useState(null);
  const svgRef = useRef(null);

  const cam       = useCamera(players, curIdx, isMoving);
  const svgToPx   = useSvgScale(svgRef);

  useEffect(() => {
    setZoomed(curIdx);
    const t = setTimeout(() => setZoomed(null), 900);
    return () => clearTimeout(t);
  }, [curIdx]);

  const getPos = useCallback((player) => {
    if (!player) return { x: CX, y: CY };
    const tiles = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
    const r     = player.circle === "outer" ? OUTER_R    : INNER_R;
    return tilePos(player.position, tiles.length, r);
  }, []);

  const getAvatarPxPos = useCallback((player) => {
    const svgPos = getPos(player);
    const s   = cam.scale;
    const zoX = CX + cam.tx * (s - 1);
    const zoY = CY + cam.ty * (s - 1);
    const transformedX = zoX + (svgPos.x - CX) * s;
    const transformedY = zoY + (svgPos.y - CY) * s;
    return svgToPx(transformedX, transformedY);
  }, [getPos, cam, svgToPx]);

  return (
    <div style={{
      width: "100%", maxWidth: 560,
      margin: "0 auto",
      display: "flex", flexDirection: "column",
    }}>
      {/* Kontejner desky — perspective pro 3D naklopení */}
      <div style={{
        position:    "relative",
        width:       "100%",
        paddingBottom: "100%",
        perspective: "900px",
      }}>
        {/* 3D wrapper — naklopí se při pohybu */}
        <motion.div
          animate={{
            rotateX:    isMoving ? 28 : 0,
            scale:      isMoving ? 0.88 : 1,
            translateY: isMoving ? "4%" : "0%",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position:       "absolute", inset: 0,
            transformStyle: "preserve-3d",
            transformOrigin:"50% 65%",
          }}
        >
        {/* SVG deska */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            background: "#03030a",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {/* Kamera zoom */}
          <motion.g
            animate={{
              scale: cam.scale,
              x:     cam.tx * (cam.scale - 1),
              y:     cam.ty * (cam.scale - 1),
            }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            {/* Pozadí */}
            <circle cx={CX} cy={CY} r={360} fill="#06060e" />
            <circle cx={CX} cy={CY} r={OUTER_R + 35} fill="#08080f" />
            <circle cx={CX} cy={CY} r={OUTER_R} fill="none"
              stroke="#111120" strokeWidth={OUTER_TR * 2 + 6} />
            <circle cx={CX} cy={CY} r={INNER_R + 10} fill="#05100a" />
            <circle cx={CX} cy={CY} r={INNER_R} fill="none"
              stroke="#071508" strokeWidth={INNER_TR * 2 + 6} />
            <circle cx={CX} cy={CY} r={INNER_R + 10}
              fill="none" stroke="#1D9E75" strokeWidth="1"
              strokeDasharray="6 5" opacity="0.35" />

            <Stars />
            <InnerGlow />

            {/* Labely */}
            <text x={CX} y={52} textAnchor="middle"
              fill="#2a2a40" fontSize={9} letterSpacing={2.5}
              fontFamily="Georgia,serif">
              VNĚJŠÍ KRUH — ŽIVOT VE SVĚTĚ
            </text>
            <text x={CX} y={CY - INNER_R + 20} textAnchor="middle"
              fill="#0a4020" fontSize={8} letterSpacing={2}
              fontFamily="Georgia,serif">
              SBOR
            </text>

            {/* Políčka vnějšího kruhu */}
            {OUTER_TILES.map((tile, i) => {
              const pos     = tilePos(i, OUTER_TILES.length, OUTER_R);
              const curHere = players[curIdx]?.circle === "outer" && players[curIdx]?.position === i;
              return (
                <Tile key={tile.id} tile={tile} x={pos.x} y={pos.y} r={OUTER_TR}
                  isLanding={curHere}
                  isMovingHere={curHere && isMoving}
                  onEnter={() => setHovered(`outer-${i}`)}
                  onLeave={() => setHovered(null)} />
              );
            })}

            {/* Políčka vnitřního kruhu */}
            {INNER_TILES.map((tile, i) => {
              const pos     = tilePos(i, INNER_TILES.length, INNER_R);
              const curHere = players[curIdx]?.circle === "inner" && players[curIdx]?.position === i;
              return (
                <Tile key={tile.id} tile={tile} x={pos.x} y={pos.y} r={INNER_TR}
                  isLanding={curHere}
                  isMovingHere={curHere && isMoving}
                  onEnter={() => setHovered(`inner-${i}`)}
                  onLeave={() => setHovered(null)} />
              );
            })}

            {/* Ráj */}
            <ParadiseCenter />

            {/* Záře hráčů v SVG (kruhy, šipky) */}
            {players.map((player, i) => {
              const pos   = getPos(player);
              const color = getAvatarColor(player.avatarId);
              return (
                <PlayerGlow key={`glow-${player.id}`}
                  x={pos.x} y={pos.y}
                  color={color}
                  isActive={i === curIdx}
                  isZoomed={zoomed === i} />
              );
            })}
          </motion.g>
        </svg>

        {/* HTML avatary — absolutně nad SVG */}
        {players.map((player, i) => {
          const pxPos = getAvatarPxPos(player);
          const same  = players.filter((p) =>
            p.circle === player.circle && p.position === player.position
          );
          const sIdx   = same.findIndex((p) => p.id === player.id);
          const offsetA = (sIdx / Math.max(same.length, 1)) * Math.PI * 2;
          const offsetR = same.length > 1 ? 16 : 0;
          const color   = getAvatarColor(player.avatarId);

          return (
            <PlayerAvatar
              key={player.id}
              player={player}
              pxX={pxPos.x + offsetR * Math.cos(offsetA) * cam.scale}
              pxY={pxPos.y + offsetR * Math.sin(offsetA) * cam.scale}
              isActive={i === curIdx}
              isZoomed={zoomed === i}
              color={color}
            />
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {hovered && (() => {
            const [circle, idx] = hovered.split("-");
            const tile = circle === "outer" ? OUTER_TILES[+idx] : INNER_TILES[+idx];
            if (!tile || tile.type === "empty") return null;
            const c = TC[tile.type];
            return (
              <motion.div key={hovered}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", bottom: "5%", left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(3,3,10,0.97)",
                  border: `1px solid ${c?.stroke ?? "#444"}`,
                  borderRadius: 10, padding: "5px 16px",
                  fontSize: 12, fontWeight: 600, color: c?.stroke ?? "#ccc",
                  pointerEvents: "none", whiteSpace: "nowrap", zIndex: 30,
                }}>
                {tile.name}
              </motion.div>
            );
          })()}
        </AnimatePresence>
        </motion.div>{/* konec 3D wrapperu */}
      </div>

      {/* Legenda */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        gap: "5px 12px", justifyContent: "center",
        padding: "8px 0 4px",
      }}>
        {[
          { c: "#c0392b", l: "Negativní" },
          { c: "#d4ac0d", l: "Dveře" },
          { c: "#27ae60", l: "Studium/Modlitba" },
          { c: "#2980b9", l: "Speciální" },
        ].map((item) => (
          <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.c }} />
            <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>
              {item.l}
            </span>
          </div>
        ))}
      </div>

      <DiceRoller3D />
    </div>
  );
};

export default GameBoard;
