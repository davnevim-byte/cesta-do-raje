// ============================================================
//  BoardPlayers — avatary hráčů pod 3D deskou
//  Emoce čte přímo z gameStore — nepotřebuje props
//  Zobrazuje: avatar, jméno, zóna, top ovoce, aktivní stav
// ============================================================

import { motion } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { getAvatarComponent, getAvatarColor } from "../board/AvatarSVG";
import { getTopFruits, getTotalFruitScore } from "../../data/fruitOfSpirit";

// ── Emoce z gameStore ─────────────────────────────────────────
const usePlayerEmotion = (playerIndex) => {
  const curIdx          = useGameStore((s) => s.currentPlayerIndex);
  const isMoving        = useGameStore((s) => s.isMoving);
  const showTileAction  = useGameStore((s) => s.showTileAction);
  const currentTileAction = useGameStore((s) => s.currentTileAction);
  const showWitnessing  = useGameStore((s) => s.showWitnessing);

  const isCurrentPlayer = playerIndex === curIdx;
  if (isCurrentPlayer && isMoving)         return "jump";
  if (showWitnessing && !isCurrentPlayer)  return "lean";
  if (showTileAction && currentTileAction && !isCurrentPlayer) {
    const type = currentTileAction.tile?.type;
    if (type === "negative")                             return "shake";
    if (type === "study" || type === "prayer")           return "cheer";
  }
  return "idle";
};

// ── Animace dle emoce ─────────────────────────────────────────
const EMOTION_ANIMS = {
  jump:  { y: [0, -10, 0, -6, 0], transition: { duration: 0.5, repeat: Infinity } },
  shake: { x: [0, -6, 6, -6, 6, -3, 3, 0], transition: { duration: 0.45 } },
  cheer: { y: [0, -8, 0, -5, 0], scale: [1, 1.14, 1, 1.08, 1], transition: { duration: 0.65, repeat: Infinity } },
  lean:  { rotate: -8, transition: { duration: 0.4 } },
  idle:  {},
};

// ── Chip jednoho hráče ────────────────────────────────────────
const PlayerChip = ({ player, index }) => {
  const curIdx  = useGameStore((s) => s.currentPlayerIndex);
  const isActive = index === curIdx;

  const color   = getAvatarColor(player.avatarId);
  const AvatarC = getAvatarComponent(player.avatarId);
  const total   = getTotalFruitScore(player.fruitScore ?? {});
  const top     = getTopFruits(player.fruitScore ?? {}, 1)[0];
  const emotion = usePlayerEmotion(index);

  const emoAnim = EMOTION_ANIMS[emotion] ?? EMOTION_ANIMS.idle;
  const { transition: emoTransition, ...emoAnimate } = emoAnim;

  const avatarSize = isActive ? 44 : 34;

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>

      {/* Šipka "na tahu" NAD celým chipem */}
      {isActive && (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position:  "absolute",
            top:       -14,
            fontSize:  11,
            color,
            lineHeight: 1,
          }}
        >▼</motion.div>
      )}

      {/* Pulzující ring aktivního hráče */}
      {isActive && (
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.1, repeat: Infinity }}
          style={{
            position:     "absolute",
            top:          0,
            width:        avatarSize + 6,
            height:       avatarSize + 6,
            borderRadius: "50%",
            border:       `2px solid ${color}`,
            pointerEvents:"none",
            marginTop:    -3,
          }}
        />
      )}

      {/* Avatar + emoce animace */}
      <motion.div
        animate={emoAnimate}
        transition={emoTransition}
        style={{
          width:        avatarSize,
          height:       avatarSize,
          borderRadius: "50%",
          border:       `${isActive ? 3 : 2}px solid ${isActive ? color : color + "55"}`,
          overflow:     "hidden",
          flexShrink:   0,
          background:   "#04040a",
          boxShadow:    isActive
            ? `0 0 16px ${color}99, 0 0 4px ${color}44`
            : "none",
          transition:   "width 0.3s, height 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <AvatarC size={avatarSize} />
      </motion.div>

      {/* Jméno */}
      <div style={{
        fontSize:     isActive ? 9.5 : 8,
        fontWeight:   isActive ? 700 : 400,
        color:        isActive ? color : "#4a4a5a",
        maxWidth:     52,
        textOverflow: "ellipsis",
        overflow:     "hidden",
        whiteSpace:   "nowrap",
        transition:   "all 0.3s",
        letterSpacing: isActive ? 0.3 : 0,
      }}>
        {player.name}
      </div>

      {/* Zóna + top ovoce na jednom řádku */}
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{
          fontSize: 8,
          color:    player.circle === "inner" ? "#1D9E75" : "#2a2a3a",
        }}>
          {player.circle === "inner" ? "⛪" : "🌍"}
        </span>
        {top && total > 0 && (
          <span
            style={{ fontSize: 9 }}
            title={`${top.label}: ${top.score}×`}
          >
            {top.emoji}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Hlavní komponenta ─────────────────────────────────────────
const BoardPlayers = () => {
  const players = useGameStore((s) => s.players) ?? [];

  if (!players.length) return null;

  return (
    <div style={{
      display:        "flex",
      flexWrap:       "wrap",
      justifyContent: "center",
      alignItems:     "flex-end",
      gap:            "10px 14px",
      padding:        "14px 12px 8px",
      borderTop:      "1px solid rgba(255,255,255,0.05)",
      background:     "rgba(3,3,10,0.6)",
    }}>
      {players.map((player, i) => (
        <PlayerChip
          key={player.id}
          player={player}
          index={i}
        />
      ))}
    </div>
  );
};

export default BoardPlayers;
