// ============================================================
//  BoardTile — políčko na desce
//  Opraveno: touch události pro mobil (onPointerEnter/Leave)
// ============================================================

import { motion } from "framer-motion";

const ICONS = {
  negative: "!",
  doors:    "D",
  start:    "S",
  empty:    "",
  entry:    "E",
  study:    "B",
  prayer:   "M",
  special:  "+",
};

const BoardTile = ({
  tile, x, y, color, radius,
  isActive, hasPlayer, isHovered,
  onHover, onHoverEnd, index, circle,
}) => {
  const isInteresting = tile.type !== "empty";
  const r      = isActive ? radius + 3 : isHovered ? radius + 2 : radius;
  const strokeW = isActive ? 2.5 : isHovered ? 2 : 1.5;

  return (
    <motion.g
      // Pointer events fungují na touch i mouse
      onPointerEnter={isInteresting ? onHover : undefined}
      onPointerLeave={isInteresting ? onHoverEnd : undefined}
      style={{ cursor: isInteresting ? "pointer" : "default", touchAction: "none" }}
    >
      {/* Záře aktivního políčka */}
      {isActive && (
        <motion.circle
          cx={x} cy={y} r={radius + 10}
          fill="none"
          stroke={color.stroke}
          strokeWidth={1}
          opacity={0.4}
          animate={{ r: [radius + 8, radius + 16, radius + 8], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Hlavní políčko */}
      <motion.circle
        cx={x} cy={y} r={r}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={strokeW}
        animate={{ r }}
        transition={{ duration: 0.2 }}
      />

      {/* Pulzující efekt pro dveře */}
      {tile.type === "doors" && (
        <motion.circle
          cx={x} cy={y} r={radius}
          fill="none"
          stroke="#EF9F27"
          strokeWidth={1}
          animate={{ opacity: [0.6, 0, 0.6], r: [radius, radius + 8, radius] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Speciální efekt pro vstup */}
      {tile.type === "entry" && (
        <motion.circle
          cx={x} cy={y} r={radius + 2}
          fill="none"
          stroke="#EF9F27"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      )}

      {/* Ikona políčka */}
      {tile.type !== "empty" && (
        <text
          x={x} y={y + 4}
          textAnchor="middle"
          fill={color.stroke}
          fontSize={tile.type === "doors" ? 13 : 11}
          fontWeight={500}
          fontFamily="Inter, sans-serif"
          pointerEvents="none"
        >
          {ICONS[tile.type] ?? "?"}
        </text>
      )}

      {/* Tečka pro hráče */}
      {hasPlayer && !isActive && (
        <circle cx={x} cy={y} r={2} fill={color.stroke} opacity={0.6} />
      )}
    </motion.g>
  );
};

export default BoardTile;
