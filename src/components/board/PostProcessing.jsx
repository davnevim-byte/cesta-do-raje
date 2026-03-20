// ============================================================
//  PostProcessing — vizuální efekty pro 3D scénu
//
//  Bloom   — záře kolem svítících objektů (figurky, políčka)
//  Vignette — ztmavení rohů obrazovky → dramatický pocit
//  Noise   — jemný film grain → filmový pocit
//
//  Výkon: na mobilech snížíme intenzitu automaticky
//  Používá @react-three/postprocessing v3
// ============================================================

import { useRef, useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";

// ── Detekce výkonu zařízení ──────────────────────────────────
const getPerformanceTier = () => {
  // Mobilní zařízení — snížíme efekty
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  // Počet logických procesorů jako hrubý ukazatel výkonu
  const cores    = navigator.hardwareConcurrency ?? 4;

  if (isMobile && cores <= 6) return "low";
  if (isMobile) return "medium";
  return "high";
};

// ── Hlavní komponenta ─────────────────────────────────────────
const PostProcessing = ({ activeCircle }) => {
  const tier = getPerformanceTier();

  // Intenzita bloom dle zóny — sbor je teplejší a světlejší
  const bloomIntensity  = activeCircle === "inner" ? 1.4 : 0.9;
  const bloomThreshold  = activeCircle === "inner" ? 0.55 : 0.65;
  const bloomRadius     = activeCircle === "inner" ? 0.7  : 0.5;

  // Na slabých zařízeních — jednodušší efekty
  if (tier === "low") {
    return (
      <EffectComposer multisampling={0}>
        <Vignette
          offset={0.4}
          darkness={0.7}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer
      multisampling={tier === "high" ? 4 : 2}
      frameBufferType={tier === "high" ? undefined : undefined}
    >
      {/* Bloom — záře kolem emissive objektů */}
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        radius={bloomRadius}
        kernelSize={tier === "high" ? KernelSize.LARGE : KernelSize.MEDIUM}
        blendFunction={BlendFunction.ADD}
      />

      {/* Vignette — ztmavení rohů */}
      <Vignette
        offset={0.38}
        darkness={activeCircle === "inner" ? 0.6 : 0.8}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Noise — jemný film grain — jen na high tier */}
      {tier === "high" && (
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.06}
        />
      )}
    </EffectComposer>
  );
};

export default PostProcessing;
