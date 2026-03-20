// ============================================================
//  GameBoard3D — celá herní deska v Three.js / React Three Fiber
//  Pohled z 45° · 3D políčka · filmová kamera · atmosféra
// ============================================================

import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Text, Billboard, Sparkles, Stars, useTexture,
} from "@react-three/drei";
import * as THREE from "three";

import { useGameStore } from "../../store/gameStore";
import { OUTER_TILES, INNER_TILES } from "../../data/tiles";
import { getAvatarColor } from "./AvatarSVG";
import DiceRoller3D from "./DiceRoller3D";
import { useDisplaySize } from "../../hooks/useDisplaySize";
import PostProcessing from "./PostProcessing";

// ─── Konstanty ────────────────────────────────────────────────
const OUTER_R   = 5.2;
const INNER_R   = 3.0;
const TILE_H    = 0.18;  // výška dlaždice
const BOARD_Y   = 0;     // Y pozice desky

const PLAYER_COLORS = [
  "#1D9E75","#EF9F27","#D4537E","#378ADD",
  "#7F77DD","#E24B4A","#9FE1CB","#FAC775",
  "#85B7EB","#ED93B1",
];

// Barvy políček
const TILE_COLORS = {
  negative: { top: "#2a0505", emissive: "#c0392b", emissiveInt: 0.2,  height: 0.14, rim: "#8b1a1a" },
  doors:    { top: "#2a1e04", emissive: "#d4ac0d", emissiveInt: 0.35, height: 0.22, rim: "#b8960c" },
  start:    { top: "#062a14", emissive: "#1D9E75", emissiveInt: 0.28, height: 0.20, rim: "#0f6e56" },
  empty:    { top: "#0d0d14", emissive: "#333344", emissiveInt: 0.02, height: 0.10, rim: "#1a1a2a" },
  entry:    { top: "#2a1e04", emissive: "#EF9F27", emissiveInt: 0.40, height: 0.26, rim: "#c47f0a" },
  study:    { top: "#062014", emissive: "#27ae60", emissiveInt: 0.22, height: 0.18, rim: "#1a7a40" },
  prayer:   { top: "#041408", emissive: "#1D9E75", emissiveInt: 0.20, height: 0.16, rim: "#0a5a3a" },
  special:  { top: "#060a1e", emissive: "#2980b9", emissiveInt: 0.25, height: 0.18, rim: "#1a5a8a" },
};

// Mapování typů políček na textury
const TILE_TEXTURES = {
  negative: "/cesta-do-raje/tiles/tile_negative.jpg",
  doors:    "/cesta-do-raje/tiles/tile_doors.jpg",
  start:    "/cesta-do-raje/tiles/tile_start.jpg",
  entry:    "/cesta-do-raje/tiles/tile_entry.jpg",
  study:    "/cesta-do-raje/tiles/tile_study.jpg",
  prayer:   "/cesta-do-raje/tiles/tile_prayer.jpg",
  special:  "/cesta-do-raje/tiles/tile_special.jpg",
};

// Čitelnější ikony — emoji jako text na billboardu
const TILE_LABELS = {
  negative: "!", doors: "⛪", start: "▶", entry: "⛪",
  study: "📖", prayer: "🙏", special: "★", empty: "",
};

// Název políčka pro tooltip — z dat tiles.js je to tile.name
const TILE_SEGMENTS = 6; // hexagon

// ─── Pozice políček ───────────────────────────────────────────
const getTilePos3D = (i, total, radius) => {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return [
    radius * Math.cos(angle),
    BOARD_Y,
    radius * Math.sin(angle),
  ];
};

// ─── Jedno políčko — hexagonální dlaždice ────────────────────
const Tile3D = ({ tile, position, isActive, isMovingHere }) => {
  const groupRef = useRef();
  const rimRef   = useRef();
  const lightRef = useRef();
  const col      = TILE_COLORS[tile.type] ?? TILE_COLORS.empty;
  const isEmpty  = tile.type === "empty";
  const h        = col.height;
  const texturePath = TILE_TEXTURES[tile.type] ?? null;
  // useTexture musí být volán vždy (React hook pravidla) - použij fallback
  const texture = useTexture(
    texturePath || "/cesta-do-raje/tiles/tile_special.jpg"
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    if (isMovingHere) {
      // Políčko poskočí při přistání — rychlý bounce
      groupRef.current.position.y = Math.abs(Math.sin(t * 10)) * 0.15;
      if (lightRef.current) lightRef.current.intensity = 2.5 + Math.sin(t * 12) * 0.8;
    } else if (isActive && !isEmpty) {
      // Jemné zvednutí — hráč zde stojí
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.025;
      if (lightRef.current) lightRef.current.intensity = 0.9 + Math.sin(t * 2) * 0.3;
    } else {
      groupRef.current.position.y = 0;
      if (lightRef.current) lightRef.current.intensity = 0;
    }

    // Dveře — pulsující lem
    if (rimRef.current && tile.type === "doors") {
      rimRef.current.material.emissiveIntensity = 0.6 + Math.sin(t * 3) * 0.4;
    }
    // Entry — rotující lem
    if (rimRef.current && tile.type === "entry") {
      rimRef.current.rotation.y = t * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position}>

      {/* Záře světla — jen pro aktivní */}
      {!isEmpty && (
        <pointLight
          ref={lightRef}
          position={[0, 0.6, 0]}
          color={col.emissive}
          intensity={0}
          distance={1.8}
          decay={2}
        />
      )}

      {/* Hlavní tělo — hexagon */}
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.37, 0.37, h, TILE_SEGMENTS]} />
        <meshStandardMaterial
          color={col.top}
          emissive={col.emissive}
          emissiveIntensity={
            isMovingHere ? col.emissiveInt * 4
            : isActive   ? col.emissiveInt * 2
            :              col.emissiveInt
          }
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {/* Textura obrázku na vrchu políčka */}
      {!isEmpty && texturePath && (
        <mesh position={[0, h + 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.65, 0.65]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={isMovingHere ? 1.0 : isActive ? 0.95 : 0.85}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Spodní lem — barevný pruh */}
      <mesh ref={rimRef} position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.39, 0.39, 0.06, TILE_SEGMENTS]} />
        <meshStandardMaterial
          color={col.rim}
          emissive={col.emissive}
          emissiveIntensity={isEmpty ? 0 : 0.4}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Horní lem — jemný highlight */}
      {!isEmpty && (
        <mesh position={[0, h + 0.015, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.03, TILE_SEGMENTS]} />
          <meshStandardMaterial
            color={col.emissive}
            emissive={col.emissive}
            emissiveIntensity={isMovingHere ? 1.5 : 0.6}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      )}

      {/* Název políčka — čitelný billboard */}
      {!isEmpty && (
        <Billboard follow lockX={false} lockY={true} lockZ={false}>
          <Text
            position={[0, h + 0.28, 0]}
            fontSize={0.145}
            color={col.emissive}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.018}
            outlineColor="#000000"
            maxWidth={1.2}
          >
            {tile.name}
          </Text>
        </Billboard>
      )}

    </group>
  );
};

// ─── Kruhová deska pod políčky ────────────────────────────────
const BoardBase = () => (
  <group>
    {/* Vnější disk */}
    <mesh position={[0, -0.12, 0]}>
      <cylinderGeometry args={[OUTER_R + 0.6, OUTER_R + 0.6, 0.12, 64]} />
      <meshStandardMaterial color="#080810" roughness={0.9} metalness={0.05} />
    </mesh>

    {/* Vnitřní disk — sbor */}
    <mesh position={[0, -0.06, 0]}>
      <cylinderGeometry args={[INNER_R + 0.5, INNER_R + 0.5, 0.1, 64]} />
      <meshStandardMaterial
        color="#051008"
        emissive="#1D9E75"
        emissiveIntensity={0.04}
        roughness={0.8}
      />
    </mesh>

    {/* Ráj — střed */}
    <mesh position={[0, -0.03, 0]}>
      <cylinderGeometry args={[1.3, 1.3, 0.08, 32]} />
      <meshStandardMaterial
        color="#041a0c"
        emissive="#1D9E75"
        emissiveIntensity={0.3}
        roughness={0.6}
      />
    </mesh>

    {/* Dělicí prstenec — zlatý */}
    <mesh position={[0, -0.05, 0]}>
      <torusGeometry args={[INNER_R + 0.45, 0.04, 8, 64]} />
      <meshStandardMaterial
        color="#d4ac0d"
        emissive="#d4ac0d"
        emissiveIntensity={0.4}
      />
    </mesh>
  </group>
);

// ─── Ráj — střed s stromem ────────────────────────────────────
const ParadiseCenter = () => {
  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group>
      {/* Světlo ráje */}
      <pointLight position={[0, 3, 0]} color="#9FE1CB" intensity={2} distance={4} />
      <pointLight position={[0, 1, 0]} color="#f5d76e" intensity={0.5} distance={2} />

      {/* Rotující skupina — strom */}
      <group ref={groupRef}>
        {/* Kmen */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#5a3010" roughness={0.9} />
        </mesh>
        {/* Koruny stromů */}
        {[[0, 1.2, 0, 0.5], [0.15, 0.95, 0.1, 0.38], [-0.1, 1.0, 0.1, 0.35], [0, 1.5, 0, 0.35]].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[r, 8, 8]} />
            <meshStandardMaterial
              color={i === 0 ? "#0a4010" : "#1D9E75"}
              emissive="#1D9E75"
              emissiveIntensity={0.15}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* Sparkles — světlušky v ráji */}
      <Sparkles
        count={30}
        scale={[2.5, 2, 2.5]}
        size={2}
        speed={0.3}
        color="#9FE1CB"
        position={[0, 0.5, 0]}
      />

      {/* Text RÁJ */}
      <Billboard>
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.32}
          color="#9FE1CB"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#041a0c"
        >
          RÁJ
        </Text>
      </Billboard>
    </group>
  );
};

// ─── 3D figurka hráče ─────────────────────────────────────────
// Anatomie: základna → tělo → ramena → krk → hlava → výraz
// Emoce: idle dýchání, skok při pohybu, třes při negativním,
//         radost při vstupu do sboru, naklon při svědectví
const PlayerFigurine = ({
  player, targetPos, isActive, index,
  spotIdx, totalAtSpot, emotion,
}) => {
  const color    = PLAYER_COLORS[index % PLAYER_COLORS.length];
  const initials = player.name?.slice(0, 2).toUpperCase() ?? "??";

  // Offset při více hráčích na stejném políčku
  const oAngle  = (spotIdx / Math.max(totalAtSpot, 1)) * Math.PI * 2;
  const oR      = totalAtSpot > 1 ? 0.28 : 0;
  const finalPos = [
    targetPos[0] + oR * Math.cos(oAngle),
    targetPos[1],
    targetPos[2] + oR * Math.sin(oAngle),
  ];

  // Refs pro animace
  const groupRef = useRef();
  const rootRef  = useRef();
  const bodyRef  = useRef();
  const headRef  = useRef();
  const glowRef  = useRef();
  const lArmRef  = useRef();
  const rArmRef  = useRef();

  // Cílová pozice jako Vector3
  const targetVec = useRef(new THREE.Vector3(...finalPos));

  useFrame((state) => {
    // Aktualizuj cíl
    targetVec.current.set(...finalPos);

    // Plynulý pohyb — lerp místo react-spring
    if (groupRef.current) {
      groupRef.current.position.lerp(targetVec.current, 0.12);
    }

    if (!bodyRef.current || !headRef.current) return;
    const t = state.clock.elapsedTime + index * 0.7;

    // ── Základní Y pozice celého těla ──
    let baseY = 0.05;

    if (emotion === "jump") {
      baseY = Math.abs(Math.sin(t * 8)) * 0.32;
    } else if (emotion === "shake") {
      if (rootRef.current) {
        rootRef.current.rotation.z = Math.sin(t * 18) * 0.15;
      }
    } else if (emotion === "cheer") {
      baseY = Math.abs(Math.sin(t * 5)) * 0.22;
      if (lArmRef.current) lArmRef.current.rotation.z = -0.8 + Math.sin(t * 5) * 0.4;
      if (rArmRef.current) rArmRef.current.rotation.z =  0.8 - Math.sin(t * 5) * 0.4;
    } else if (emotion === "lean") {
      if (rootRef.current) rootRef.current.rotation.x = 0.2;
    } else {
      baseY = Math.sin(t * 1.1) * 0.025;
      if (rootRef.current) {
        rootRef.current.rotation.z = Math.sin(t * 0.7) * 0.02;
        rootRef.current.rotation.x = 0;
      }
      if (lArmRef.current) lArmRef.current.rotation.z = -0.25 + Math.sin(t * 1.1) * 0.05;
      if (rArmRef.current) rArmRef.current.rotation.z =  0.25 - Math.sin(t * 1.1) * 0.05;
    }

    bodyRef.current.position.y = baseY;

    headRef.current.rotation.y = Math.sin(t * 0.6) * 0.08;
    headRef.current.rotation.x = Math.sin(t * 0.4) * 0.04;

    if (glowRef.current) {
      glowRef.current.intensity = isActive
        ? 1.2 + Math.sin(t * 2.5) * 0.4
        : 0.15 + Math.sin(t * 1.2) * 0.08;
    }
  });

  const emissiveInt = isActive ? 0.45 : 0.12;
  const darkColor   = color;

  return (
    <group ref={groupRef} position={finalPos}>
      {/* Záře pod figurkou */}
      <pointLight
        ref={glowRef}
        position={[0, 0.15, 0]}
        color={color}
        intensity={isActive ? 1.2 : 0.15}
        distance={1.6}
      />

      {/* Kruhový stín na desce */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[isActive ? 0.28 : 0.22, 20]} />
        <meshBasicMaterial color="black" transparent opacity={isActive ? 0.5 : 0.3} />
      </mesh>

      {/* Celé tělo — animovaná skupina */}
      <group ref={rootRef}>
        <group ref={bodyRef} position={[0, 0.05, 0]}>

          {/* Základna / boty */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.15, 0.12, 10]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>

          {/* Nohy */}
          <mesh position={[-0.07, 0.22, 0]}>
            <cylinderGeometry args={[0.055, 0.065, 0.26, 8]} />
            <meshStandardMaterial color={darkColor} roughness={0.65} metalness={0.05}
              emissive={color} emissiveIntensity={emissiveInt * 0.5} />
          </mesh>
          <mesh position={[0.07, 0.22, 0]}>
            <cylinderGeometry args={[0.055, 0.065, 0.26, 8]} />
            <meshStandardMaterial color={darkColor} roughness={0.65} metalness={0.05}
              emissive={color} emissiveIntensity={emissiveInt * 0.5} />
          </mesh>

          {/* Trup */}
          <mesh position={[0, 0.48, 0]}>
            <cylinderGeometry args={[0.14, 0.13, 0.34, 10]} />
            <meshStandardMaterial color={color} roughness={0.55} metalness={0.12}
              emissive={color} emissiveIntensity={emissiveInt} />
          </mesh>

          {/* Levé rameno + paže */}
          <group ref={lArmRef} position={[-0.17, 0.58, 0]} rotation={[0, 0, -0.25]}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.045, 0.05, 0.22, 8]} />
              <meshStandardMaterial color={color} roughness={0.6}
                emissive={color} emissiveIntensity={emissiveInt * 0.6} />
            </mesh>
          </group>

          {/* Pravé rameno + paže */}
          <group ref={rArmRef} position={[0.17, 0.58, 0]} rotation={[0, 0, 0.25]}>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.045, 0.05, 0.22, 8]} />
              <meshStandardMaterial color={color} roughness={0.6}
                emissive={color} emissiveIntensity={emissiveInt * 0.6} />
            </mesh>
          </group>

          {/* Krk */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.055, 0.07, 0.1, 8]} />
            <meshStandardMaterial color="#d4a574" roughness={0.7} />
          </mesh>

          {/* Hlava */}
          <group ref={headRef} position={[0, 0.84, 0]}>
            <mesh>
              <sphereGeometry args={[0.2, 14, 14]} />
              <meshStandardMaterial color="#e8b89a" roughness={0.65}
                emissive={color} emissiveIntensity={emissiveInt * 0.25} />
            </mesh>

            {/* Oči — malé tmavé koule */}
            <mesh position={[-0.075, 0.04, 0.17]}>
              <sphereGeometry args={[0.028, 6, 6]} />
              <meshBasicMaterial color="#1a0800" />
            </mesh>
            <mesh position={[0.075, 0.04, 0.17]}>
              <sphereGeometry args={[0.028, 6, 6]} />
              <meshBasicMaterial color="#1a0800" />
            </mesh>

            {/* Výraz dle emoce */}
            {emotion === "cheer" && (
              <>
                {/* Radostný úsměv — klenutý cylinder */}
                <mesh position={[0, -0.05, 0.18]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.055, 0.012, 6, 10, Math.PI]} />
                  <meshBasicMaterial color="#c08060" />
                </mesh>
              </>
            )}
            {emotion === "shake" && (
              <>
                {/* Smutný výraz */}
                <mesh position={[0, -0.06, 0.18]}>
                  <torusGeometry args={[0.055, 0.012, 6, 10, Math.PI]} />
                  <meshBasicMaterial color="#c08060" />
                </mesh>
              </>
            )}

            {/* Jméno jako billboard */}
            <Billboard follow lockX={false} lockY={true} lockZ={false}>
              <Text
                position={[0, 0.32, 0]}
                fontSize={isActive ? 0.17 : 0.13}
                color={isActive ? color : "#cccccc"}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {player.name?.slice(0, 7)}
              </Text>
            </Billboard>
          </group>

          {/* Šipka nad aktivním hráčem */}
          {isActive && (
            <Billboard>
              <Text
                position={[0, 1.35, 0]}
                fontSize={0.22}
                color={color}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000"
              >
                ▼
              </Text>
            </Billboard>
          )}

        </group>
      </group>
    </group>
  );
};

// ─── Osvětlení scény ──────────────────────────────────────────
const SceneLighting = ({ activeCircle, players, curIdx }) => {
  // Refs pro světla která animujeme
  const ambientRef    = useRef();
  const mainDirRef    = useRef();
  const innerGlowRef  = useRef();
  const outerMoodRef  = useRef();
  const paradiseRef   = useRef();
  const followRef     = useRef();  // spotlight sledující aktivního hráče

  // Cílové hodnoty dle zóny
  const isInner = activeCircle === "inner";

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // ── Ambientní světlo — plynulý přechod ──────────────────
    if (ambientRef.current) {
      const targetIntensity = isInner ? 0.45 : 0.22;
      ambientRef.current.intensity +=
        (targetIntensity - ambientRef.current.intensity) * 0.02;
    }

    // ── Hlavní směrové světlo — barva dle zóny ───────────────
    if (mainDirRef.current) {
      const targetIntensity = isInner ? 1.6 : 1.0;
      mainDirRef.current.intensity +=
        (targetIntensity - mainDirRef.current.intensity) * 0.02;
    }

    // ── Záře sboru — pulzuje ─────────────────────────────────
    if (innerGlowRef.current) {
      const base = isInner ? 1.2 : 0.2;
      innerGlowRef.current.intensity =
        base + Math.sin(t * 0.6) * (isInner ? 0.3 : 0.05);
    }

    // ── Temná nálada vnějšího světa ──────────────────────────
    if (outerMoodRef.current) {
      const target = isInner ? 0.1 : 0.5;
      outerMoodRef.current.intensity +=
        (target - outerMoodRef.current.intensity) * 0.02;
    }

    // ── Záře ráje ────────────────────────────────────────────
    if (paradiseRef.current) {
      const base = isInner ? 2.2 : 0.4;
      paradiseRef.current.intensity = base + Math.sin(t * 0.4) * 0.4;
    }

    // ── Spotlight sledující aktivního hráče ──────────────────
    if (followRef.current && players?.length > 0) {
      const p = players[curIdx];
      if (p) {
        const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
        const r     = p.circle === "outer" ? OUTER_R     : INNER_R;
        const angle = (p.position / tiles.length) * Math.PI * 2 - Math.PI / 2;
        const tx    = r * Math.cos(angle);
        const tz    = r * Math.sin(angle);

        // Plynulý lerp pozice světla nad hráčem
        followRef.current.position.x +=
          (tx - followRef.current.position.x) * 0.08;
        followRef.current.position.z +=
          (tz - followRef.current.position.z) * 0.08;

        // Target světla — na hráče
        followRef.current.target.position.set(tx, 0, tz);
        followRef.current.target.updateMatrixWorld();
      }
    }
  });

  const playerColor = players?.[curIdx]
    ? PLAYER_COLORS[curIdx % PLAYER_COLORS.length]
    : "#ffffff";

  return (
    <>
      {/* Ambientní — základ scény */}
      <ambientLight ref={ambientRef} intensity={0.22} color={isInner ? "#1a2a1a" : "#0d0d1a"} />

      {/* Hlavní směrové světlo — dramatické ze strany */}
      <directionalLight
        ref={mainDirRef}
        position={[8, 14, 6]}
        intensity={1.0}
        color={isInner ? "#fad5a5" : "#9090bb"}
      />

      {/* Protisměrné světlo — měkké stíny */}
      <directionalLight
        position={[-6, 8, -5]}
        intensity={isInner ? 0.4 : 0.15}
        color={isInner ? "#9FE1CB" : "#333355"}
      />

      {/* Záře středu sboru */}
      <pointLight
        ref={innerGlowRef}
        position={[0, 3, 0]}
        color="#9FE1CB"
        intensity={0.2}
        distance={7}
        decay={2}
      />

      {/* Temná nálada vnějšího světa — zlověstné boční světlo */}
      <pointLight
        ref={outerMoodRef}
        position={[-9, 1.5, -9]}
        color="#2a2a5a"
        intensity={0.5}
        distance={15}
        decay={2}
      />

      {/* Záře ráje — bodové světlo ze středu */}
      <spotLight
        ref={paradiseRef}
        position={[0, 7, 0]}
        angle={0.35}
        penumbra={0.6}
        color="#f5d76e"
        intensity={0.4}
        distance={10}
        decay={2}
      />

      {/* Spotlight sledující aktivního hráče */}
      <spotLight
        ref={followRef}
        position={[0, 5, 0]}
        angle={0.25}
        penumbra={0.8}
        color={playerColor}
        intensity={1.2}
        distance={6}
        decay={2}
      />
    </>
  );
};

// ─── Filmová kamera — 3 fáze ─────────────────────────────────
//  OVERVIEW  — celá deska z 45°, kamera pomalu obíhá
//  MOVING    — kamera těsně sleduje figurku ze 45°
//  LANDING   — dramatický nájezd na přistávající políčko
const CameraController = ({ players, curIdx, isMoving, movingStep, movingTotal }) => {
  const { camera } = useThree();
  const posRef  = useRef(new THREE.Vector3(0, 10, 9));
  const lookRef = useRef(new THREE.Vector3(0, 0, 0));
  const phaseRef = useRef("overview"); // "overview" | "moving" | "landing"

  useEffect(() => {
    if (isMoving) {
      phaseRef.current = "moving";
    } else if (phaseRef.current === "moving") {
      // Právě přistálo — krátká landing fáze
      phaseRef.current = "landing";
      setTimeout(() => { phaseRef.current = "overview"; }, 1800);
    }
  }, [isMoving]);

  useFrame((state) => {
    const p = players[curIdx];
    if (!p) return;

    const tiles = p.circle === "outer" ? OUTER_TILES : INNER_TILES;
    const r     = p.circle === "outer" ? OUTER_R     : INNER_R;
    const angle = (p.position / tiles.length) * Math.PI * 2 - Math.PI / 2;
    const px    = r * Math.cos(angle);
    const pz    = r * Math.sin(angle);
    const t     = state.clock.elapsedTime;

    let targetPos  = new THREE.Vector3();
    let targetLook = new THREE.Vector3();
    let lerpSpeed  = 0.03;

    if (phaseRef.current === "moving") {
      // Kamera sleduje figurku zblízka — ze strany a shora (45°)
      // Pozice kamery je "za" figurkou ve směru pohybu
      const behindAngle = angle + Math.PI * 0.55;
      targetPos.set(
        px + Math.cos(behindAngle) * 3.8,
        4.5,
        pz + Math.sin(behindAngle) * 3.8,
      );
      targetLook.set(px * 0.7, 0.3, pz * 0.7);
      lerpSpeed = 0.06; // rychlejší sledování při pohybu

    } else if (phaseRef.current === "landing") {
      // Dramatický nájezd na přistávající políčko — kamera klesne níže
      targetPos.set(
        px * 0.5 + Math.cos(angle + 1.2) * 3,
        3.2,
        pz * 0.5 + Math.sin(angle + 1.2) * 3,
      );
      targetLook.set(px, 0.5, pz);
      lerpSpeed = 0.05;

    } else {
      // Overview — celá deska, kamera pomalu obíhá + mírně osciluje
      const orbitAngle = t * 0.04; // velmi pomalé otáčení
      targetPos.set(
        Math.sin(orbitAngle) * 1.5,
        9.5 + Math.sin(t * 0.15) * 0.4,
        9.0 + Math.cos(orbitAngle) * 1.0,
      );
      targetLook.set(0, 0, 0);
      lerpSpeed = 0.025;
    }

    // Plynulý lerp
    posRef.current.lerp(targetPos, lerpSpeed);
    lookRef.current.lerp(targetLook, lerpSpeed * 1.5);

    camera.position.copy(posRef.current);
    camera.lookAt(lookRef.current);
  });

  return null;
};

// ─── Atmosféra ────────────────────────────────────────────────
// ─── Plovoucí částice vnějšího světa ─────────────────────────
const OuterParticles = () => {
  const count   = 60;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = INNER_R + 0.5 + Math.random() * (OUTER_R - INNER_R - 0.5);
      pos[i * 3]     = r * Math.cos(a);
      pos[i * 3 + 1] = Math.random() * 1.5;
      pos[i * 3 + 2] = r * Math.sin(a);
    }
    return pos;
  }, []);

  // Imperativně vytvoř geometry aby se předešlo JSX bufferAttribute bugům v R3F v8
  const pointsRef = useRef();
  useEffect(() => {
    if (!pointsRef.current) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsRef.current.geometry = geo;
    return () => geo.dispose();
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <pointsMaterial
        size={0.04}
        color="#888899"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

// ─── Záře ráje — světelné kruhy ───────────────────────────────
const ParadiseRays = () => {
  const raysRef = useRef();
  useFrame((state) => {
    if (!raysRef.current) return;
    raysRef.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={raysRef} position={[0, 0.1, 0]}>
      {/* Torus kruhy kolem ráje — různé velikosti */}
      {[1.45, 1.65, 1.85].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[r, 0.012, 6, 48]} />
          <meshStandardMaterial
            color="#f5d76e"
            emissive="#f5d76e"
            emissiveIntensity={0.6 - i * 0.15}
            transparent
            opacity={0.35 - i * 0.08}
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── Dynamická mlha ───────────────────────────────────────────
const DynamicFog = ({ activeCircle }) => {
  const { scene } = useThree();

  useEffect(() => {
    // Přechod mlhy dle zóny
    const isInner = activeCircle === "inner";
    scene.fog = new THREE.FogExp2(
      isInner ? "#040c08" : "#02020a",
      isInner ? 0.038 : 0.052,
    );
    return () => { scene.fog = null; };
  }, [activeCircle, scene]);

  return null;
};

// ─── Pozadí scény — textura ──────────────────────────────────
const SceneBackground = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/cesta-do-raje/background.jpg', (texture) => {
      scene.background = texture;
    });
    return () => { scene.background = null; };
  }, [scene]);

  return null;
};

// ─── Hlavní Atmosphere komponenta ────────────────────────────
const Atmosphere = ({ activeCircle }) => (
  <>
    {/* Dynamická mlha */}
    <DynamicFog activeCircle={activeCircle} />

    {/* Hvězdy — jen ve vnějším světě jsou výrazné */}
    <Stars
      radius={28}
      depth={18}
      count={activeCircle === "inner" ? 600 : 1400}
      factor={activeCircle === "inner" ? 2 : 3.5}
      saturation={0}
      fade
      speed={0.3}
    />

    {/* Plovoucí prach ve vnějším světě */}
    {activeCircle === "outer" && <OuterParticles />}

    {/* Záře ráje — torus kruhy */}
    <ParadiseRays />

    {/* Sparkles v celém sboru — zlaté i zelené */}
    {activeCircle === "inner" && (
      <>
        <Sparkles
          count={50}
          scale={[8, 2.5, 8]}
          size={2.5}
          speed={0.35}
          color="#9FE1CB"
          position={[0, 0.3, 0]}
          opacity={0.8}
        />
        <Sparkles
          count={25}
          scale={[4, 1.5, 4]}
          size={1.8}
          speed={0.5}
          color="#f5d76e"
          position={[0, 0.8, 0]}
          opacity={0.6}
        />
      </>
    )}

    {/* Jemné sparkles vždy — pro ráj */}
    <Sparkles
      count={12}
      scale={[2.2, 1.5, 2.2]}
      size={2}
      speed={0.25}
      color="#f5d76e"
      position={[0, 1.2, 0]}
      opacity={0.9}
    />
  </>
);

// ─── 3D Scéna — vše dohromady ────────────────────────────────
const Scene3D = () => {
  const players  = useGameStore((s) => s.players) ?? [];
  const curIdx        = useGameStore((s) => s.currentPlayerIndex);
  const isMoving      = useGameStore((s) => s.isMoving);
  const movingStep    = useGameStore((s) => s.movingStep);
  const movingTotal   = useGameStore((s) => s.movingTotal);
  const showTileAction   = useGameStore((s) => s.showTileAction);
  const currentTileAction = useGameStore((s) => s.currentTileAction);
  const showWitnessing   = useGameStore((s) => s.showWitnessing);

  // Počkej na načtení hráčů ze store
  if (!players || players.length === 0) {
    return (
      <>
        <ambientLight intensity={0.3} />
      </>
    );
  }


  const curPlayer    = players[curIdx];
  const activeCircle = curPlayer?.circle ?? "outer";

  // Emoce pro každého hráče
  const getEmotion = (player, i) => {
    const isCurrentPlayer = i === curIdx;
    if (isMoving && isCurrentPlayer) return "jump";
    if (showWitnessing && !isCurrentPlayer) return "lean";
    if (showTileAction && currentTileAction) {
      const type = currentTileAction.tile?.type;
      if (!isCurrentPlayer) {
        if (type === "negative") return "shake";
        if (type === "study" || type === "prayer" || type === "special") return "cheer";
      }
    }
    return "idle";
  };

  return (
    <>
      <SceneBackground />
      <CameraController players={players} curIdx={curIdx} isMoving={isMoving} movingStep={movingStep} movingTotal={movingTotal} />
      <SceneLighting activeCircle={activeCircle} players={players} curIdx={curIdx} />
      <Atmosphere activeCircle={activeCircle} />
      <PostProcessing activeCircle={activeCircle} />

      {/* Deska */}
      <BoardBase />
      <ParadiseCenter />

      {/* Vnější políčka */}
      {OUTER_TILES.map((tile, i) => {
        const pos     = getTilePos3D(i, OUTER_TILES.length, OUTER_R);
        const curHere = curPlayer?.circle === "outer" && curPlayer?.position === i;
        const anyHere = players.some((p) => p.circle === "outer" && p.position === i);
        return (
          <Tile3D key={`o-${i}`}
            tile={tile}
            position={pos}
            isActive={anyHere}
            isMovingHere={curHere && isMoving}
          />
        );
      })}

      {/* Vnitřní políčka */}
      {INNER_TILES.map((tile, i) => {
        const pos     = getTilePos3D(i, INNER_TILES.length, INNER_R);
        const curHere = curPlayer?.circle === "inner" && curPlayer?.position === i;
        const anyHere = players.some((p) => p.circle === "inner" && p.position === i);
        return (
          <Tile3D key={`i-${i}`}
            tile={tile}
            position={pos}
            isActive={anyHere}
            isMovingHere={curHere && isMoving}
          />
        );
      })}

      {/* Figurky hráčů */}
      {players.map((player, i) => {
        const tiles   = player.circle === "outer" ? OUTER_TILES : INNER_TILES;
        const r       = player.circle === "outer" ? OUTER_R     : INNER_R;
        const pos     = getTilePos3D(player.position, tiles.length, r);
        const same    = players.filter((p) => p.circle === player.circle && p.position === player.position);
        const sIdx    = same.findIndex((p) => p.id === player.id);
        const emotion = getEmotion(player, i);

        return (
          <PlayerFigurine
            key={player.id}
            player={player}
            targetPos={pos}
            isActive={i === curIdx}
            index={i}
            spotIdx={sIdx}
            totalAtSpot={same.length}
            emotion={emotion}
          />
        );
      })}
    </>
  );
};

// ─── Hlavní komponenta ────────────────────────────────────────
const GameBoard3D = () => {
  const { size } = useDisplaySize();
  const maxWidth = Math.round(600 * (size / 100));

  return (
    <div style={{
      width: "100%",
      maxWidth: maxWidth,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* 3D Canvas */}
      <div style={{
        position:      "relative",
        width:         "100%",
        paddingBottom: "90%",
        borderRadius:  16,
        overflow:      "hidden",
        background:    "transparent",
      }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Canvas
            camera={{ position: [0, 10, 9], fov: 50 }}
            gl={{
              antialias:        true,
              alpha:            true,
              powerPreference:  "high-performance",
              outputColorSpace: "srgb",
            }}
            dpr={[1, 2]}
          >
            <Scene3D />
          </Canvas>
        </div>
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

      {/* Kostka */}
      <DiceRoller3D />
    </div>
  );
};

export default GameBoard3D;
