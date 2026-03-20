// ============================================================
//  AvatarSVG — 12 unikátních SVG avatarů
//  Každý má vlastní osobnost, barvu vlasů, tón pleti
//  Žádné externí obrázky — vše je vektorová grafika
// ============================================================

// Pomocná komponenta pro každý avatar
const AvatarBase = ({ size = 56, bg, children }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 56 56"
    xmlns="http://www.w3.org/2000/svg"
    style={{ borderRadius: "50%", flexShrink: 0, display: "block" }}
  >
    {/* Pozadí */}
    <circle cx="28" cy="28" r="28" fill={bg} />
    {children}
  </svg>
);

// ─── Avatar 01 — Marek (tmavé vlasy, oblek) ─────────────────
export const Avatar01 = ({ size }) => (
  <AvatarBase size={size} bg="#1a2a3a">
    {/* Tělo */}
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#1e3a5f" />
    {/* Košile + kravata */}
    <rect x="24" y="36" width="8" height="10" fill="white" rx="1" />
    <polygon points="28,37 26,44 28,43 30,44" fill="#c0392b" />
    {/* Oblek */}
    <path d="M12 56 Q14 38 22 36 L24 40 L28 38 L32 40 L34 36 Q42 38 44 56Z" fill="#2c3e50" />
    {/* Krk */}
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#e8b89a" />
    {/* Hlava */}
    <ellipse cx="28" cy="24" rx="11" ry="12" fill="#e8b89a" />
    {/* Vlasy */}
    <path d="M17 22 Q18 12 28 11 Q38 12 39 22 Q36 14 28 14 Q20 14 17 22Z" fill="#2c1810" />
    {/* Oči */}
    <ellipse cx="23" cy="23" rx="2" ry="2.2" fill="white" />
    <ellipse cx="33" cy="23" rx="2" ry="2.2" fill="white" />
    <circle cx="23.5" cy="23.5" r="1.3" fill="#1a0a00" />
    <circle cx="33.5" cy="23.5" r="1.3" fill="#1a0a00" />
    {/* Úsměv */}
    <path d="M23 29 Q28 33 33 29" stroke="#c0856a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 02 — Jana (světlé vlasy, bílá halenka) ──────────
export const Avatar02 = ({ size }) => (
  <AvatarBase size={size} bg="#1a1a2e">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#8e44ad" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#6c3483" />
    <rect x="23" y="35" width="10" height="12" fill="#f8f9fa" rx="2" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#fad5b5" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#fad5b5" />
    {/* Světlé vlasy */}
    <path d="M17 20 Q17 10 28 10 Q39 10 39 20" fill="#f0c040" />
    <path d="M17 20 Q16 26 17 30 Q18 26 17 20Z" fill="#f0c040" />
    <path d="M39 20 Q40 26 39 30 Q40 26 39 20Z" fill="#f0c040" />
    <ellipse cx="28" cy="13" rx="11" ry="4" fill="#f0c040" />
    <ellipse cx="23" cy="22" rx="1.8" ry="2" fill="white" />
    <ellipse cx="33" cy="22" rx="1.8" ry="2" fill="white" />
    <circle cx="23.5" cy="22.5" r="1.2" fill="#3d2b1f" />
    <circle cx="33.5" cy="22.5" r="1.2" fill="#3d2b1f" />
    {/* Řasy */}
    <path d="M21 20 L22 18.5 M23 19.5 L23 18 M25 20 L25.5 18.5" stroke="#3d2b1f" strokeWidth="0.7" />
    <path d="M31 20 L31.5 18.5 M33 19.5 L33 18 M35 20 L34.5 18.5" stroke="#3d2b1f" strokeWidth="0.7" />
    <path d="M23 28 Q28 32 33 28" stroke="#c9826a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 03 — Tomáš (hnědé vlasy, brýle) ─────────────────
export const Avatar03 = ({ size }) => (
  <AvatarBase size={size} bg="#0d1f0d">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#1e4d1e" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#145214" />
    <rect x="23" y="35" width="10" height="12" fill="white" rx="1" />
    <polygon points="28,36 26,43 28,42 30,43" fill="#2980b9" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#d4a574" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#d4a574" />
    <path d="M17 21 Q18 11 28 11 Q38 11 39 21 Q36 13 28 13 Q20 13 17 21Z" fill="#6b3a1f" />
    {/* Brýle */}
    <rect x="19" y="21" width="7" height="5" rx="2" fill="none" stroke="#444" strokeWidth="1.2" />
    <rect x="30" y="21" width="7" height="5" rx="2" fill="none" stroke="#444" strokeWidth="1.2" />
    <line x1="26" y1="23.5" x2="30" y2="23.5" stroke="#444" strokeWidth="1.2" />
    <line x1="17" y1="23" x2="19" y2="23.5" stroke="#444" strokeWidth="1" />
    <line x1="39" y1="23" x2="37" y2="23.5" stroke="#444" strokeWidth="1" />
    <circle cx="22.5" cy="23.5" r="1" fill="#3d2b1f" />
    <circle cx="33.5" cy="23.5" r="1" fill="#3d2b1f" />
    <path d="M23 29 Q28 33 33 29" stroke="#b07a5a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 04 — Lucie (tmavé vlasy, červené puntíky) ───────
export const Avatar04 = ({ size }) => (
  <AvatarBase size={size} bg="#2d0a0a">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#922b21" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#7b241c" />
    <rect x="23" y="35" width="10" height="12" fill="#fadbd8" rx="2" />
    <circle cx="25" cy="38" r="1" fill="#e74c3c" />
    <circle cx="28" cy="37" r="1" fill="#e74c3c" />
    <circle cx="31" cy="38" r="1" fill="#e74c3c" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#f5cba7" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#f5cba7" />
    {/* Vlnité tmavé vlasy */}
    <path d="M17 22 Q17 10 28 10 Q39 10 39 22" fill="#1a0a00" />
    <path d="M17 22 Q15 28 16 34 Q18 28 17 22Z" fill="#1a0a00" />
    <path d="M39 22 Q41 28 40 34 Q38 28 39 22Z" fill="#1a0a00" />
    <path d="M17 14 Q20 10 25 12 Q20 14 17 14Z" fill="#1a0a00" />
    <ellipse cx="28" cy="11" rx="11" ry="3.5" fill="#1a0a00" />
    <ellipse cx="23" cy="22" rx="1.8" ry="2" fill="white" />
    <ellipse cx="33" cy="22" rx="1.8" ry="2" fill="white" />
    <circle cx="23.5" cy="22.5" r="1.2" fill="#1a0a00" />
    <circle cx="33.5" cy="22.5" r="1.2" fill="#1a0a00" />
    <path d="M23 29 Q28 32 33 29" stroke="#d4826a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Naušnice */}
    <circle cx="17" cy="26" r="1.5" fill="#f39c12" />
    <circle cx="39" cy="26" r="1.5" fill="#f39c12" />
  </AvatarBase>
);

// ─── Avatar 05 — Pavel (šedé vlasy, starší) ─────────────────
export const Avatar05 = ({ size }) => (
  <AvatarBase size={size} bg="#1a1a3a">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#2c3e7a" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#1a2560" />
    <rect x="23" y="35" width="10" height="12" fill="white" rx="1" />
    <polygon points="28,36 26,43 28,42 30,43" fill="#8e44ad" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#d4a574" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#d4a574" />
    {/* Šedé vlasy */}
    <path d="M17 22 Q18 11 28 11 Q38 11 39 22 Q36 14 28 14 Q20 14 17 22Z" fill="#95a5a6" />
    {/* Vous */}
    <path d="M21 30 Q28 35 35 30 Q33 34 28 35 Q23 34 21 30Z" fill="#bdc3c7" />
    <ellipse cx="23" cy="23" rx="2" ry="2.2" fill="white" />
    <ellipse cx="33" cy="23" rx="2" ry="2.2" fill="white" />
    <circle cx="23.5" cy="23.5" r="1.3" fill="#2c1810" />
    <circle cx="33.5" cy="23.5" r="1.3" fill="#2c1810" />
    <path d="M23 29 Q28 32 33 29" stroke="#c0856a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 06 — Marie (rusé vlasy, uzel) ───────────────────
export const Avatar06 = ({ size }) => (
  <AvatarBase size={size} bg="#0d1a0d">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#196f3d" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#0e4d29" />
    <rect x="23" y="35" width="10" height="12" fill="#d5f5e3" rx="2" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#fad5b5" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#fad5b5" />
    {/* Rusé vlasy do uzlu */}
    <path d="M17 22 Q17 10 28 10 Q39 10 39 22 Q36 14 28 14 Q20 14 17 22Z" fill="#e67e22" />
    {/* Uzel nahoře */}
    <circle cx="28" cy="10" r="5" fill="#e67e22" />
    <ellipse cx="28" cy="10" rx="4" ry="3" fill="#d35400" />
    <ellipse cx="23" cy="22" rx="1.8" ry="2" fill="white" />
    <ellipse cx="33" cy="22" rx="1.8" ry="2" fill="white" />
    <circle cx="23.5" cy="22.5" r="1.2" fill="#1a0a00" />
    <circle cx="33.5" cy="22.5" r="1.2" fill="#1a0a00" />
    <path d="M23 29 Q28 33 33 29" stroke="#c9826a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Pihy */}
    <circle cx="25" cy="27" r="0.7" fill="#d4926a" />
    <circle cx="27" cy="26.5" r="0.7" fill="#d4926a" />
    <circle cx="29" cy="27" r="0.7" fill="#d4926a" />
    <circle cx="31" cy="26.5" r="0.7" fill="#d4926a" />
  </AvatarBase>
);

// ─── Avatar 07 — David (tmavá pleť, krátké vlasy) ───────────
export const Avatar07 = ({ size }) => (
  <AvatarBase size={size} bg="#1a0d2e">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#6c3483" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#512e81" />
    <rect x="23" y="35" width="10" height="12" fill="white" rx="1" />
    <polygon points="28,36 26,43 28,42 30,43" fill="#1abc9c" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#8d5524" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#8d5524" />
    {/* Krátké kudrnaté vlasy */}
    <path d="M17 22 Q18 11 28 11 Q38 11 39 22" fill="#1a0a00" />
    <circle cx="20" cy="16" r="3" fill="#1a0a00" />
    <circle cx="24" cy="13" r="3.5" fill="#1a0a00" />
    <circle cx="28" cy="12" r="3.5" fill="#1a0a00" />
    <circle cx="32" cy="13" r="3.5" fill="#1a0a00" />
    <circle cx="36" cy="16" r="3" fill="#1a0a00" />
    <ellipse cx="23" cy="23" rx="2" ry="2.2" fill="white" />
    <ellipse cx="33" cy="23" rx="2" ry="2.2" fill="white" />
    <circle cx="23.5" cy="23.5" r="1.4" fill="#0a0500" />
    <circle cx="33.5" cy="23.5" r="1.4" fill="#0a0500" />
    <path d="M23 29 Q28 33 33 29" stroke="#7a4a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 08 — Eliška (světlé vlasy, copy) ────────────────
export const Avatar08 = ({ size }) => (
  <AvatarBase size={size} bg="#0d1a2e">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#1a4d7a" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#0d2d4a" />
    <rect x="23" y="35" width="10" height="12" fill="#ebf5fb" rx="2" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#fce5d0" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#fce5d0" />
    {/* Světlé copy */}
    <path d="M17 20 Q17 10 28 10 Q39 10 39 20" fill="#f5d76e" />
    <path d="M17 20 Q15 30 16 42 L18 42 Q17 30 17 20Z" fill="#f5d76e" />
    <path d="M39 20 Q41 30 40 42 L38 42 Q39 30 39 20Z" fill="#f5d76e" />
    <ellipse cx="28" cy="13" rx="11" ry="4" fill="#f5d76e" />
    <ellipse cx="23" cy="22" rx="1.8" ry="2" fill="white" />
    <ellipse cx="33" cy="22" rx="1.8" ry="2" fill="white" />
    <circle cx="23.5" cy="22.5" r="1.2" fill="#2c1a00" />
    <circle cx="33.5" cy="22.5" r="1.2" fill="#2c1a00" />
    {/* Malé ústa */}
    <path d="M25 29 Q28 31 31 29" stroke="#c9826a" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Mašle */}
    <path d="M25 11 Q28 9 31 11 Q28 13 25 11Z" fill="#e74c3c" />
  </AvatarBase>
);

// ─── Avatar 09 — Jakub (zrzavé vlasy, mladý) ────────────────
export const Avatar09 = ({ size }) => (
  <AvatarBase size={size} bg="#1a0d00">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#873600" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#6e2c00" />
    <rect x="23" y="35" width="10" height="12" fill="white" rx="1" />
    <polygon points="28,36 26,43 28,42 30,43" fill="#e67e22" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#f0c090" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#f0c090" />
    {/* Zrzavé rozcuchané vlasy */}
    <path d="M17 22 Q18 10 28 10 Q38 10 39 22" fill="#c0392b" />
    <path d="M17 18 Q15 12 18 10 Q16 14 17 18Z" fill="#c0392b" />
    <path d="M39 18 Q41 12 38 10 Q40 14 39 18Z" fill="#c0392b" />
    <path d="M22 11 Q20 8 22 7 Q21 9 22 11Z" fill="#c0392b" />
    <path d="M28 10 Q28 7 30 7 Q29 9 28 10Z" fill="#c0392b" />
    <path d="M34 11 Q36 8 34 7 Q35 9 34 11Z" fill="#c0392b" />
    <ellipse cx="23" cy="23" rx="2" ry="2.2" fill="white" />
    <ellipse cx="33" cy="23" rx="2" ry="2.2" fill="white" />
    <circle cx="23.5" cy="23.5" r="1.3" fill="#1a0800" />
    <circle cx="33.5" cy="23.5" r="1.3" fill="#1a0800" />
    <path d="M23 29 Q28 33 33 29" stroke="#c0856a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {/* Pihy */}
    <circle cx="24" cy="27" r="0.8" fill="#c9826a" />
    <circle cx="32" cy="27" r="0.8" fill="#c9826a" />
  </AvatarBase>
);

// ─── Avatar 10 — Kateřina (tmavé vlasy, asijský typ) ────────
export const Avatar10 = ({ size }) => (
  <AvatarBase size={size} bg="#1a0a1a">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#6c1a6c" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#4a0d4a" />
    <rect x="23" y="35" width="10" height="12" fill="#f9ebea" rx="2" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#f0c8a0" />
    <ellipse cx="28" cy="23" rx="10" ry="12" fill="#f0c8a0" />
    {/* Rovné tmavé vlasy */}
    <path d="M18 22 Q18 9 28 9 Q38 9 38 22" fill="#0d0508" />
    <path d="M18 22 Q17 30 17 38 L19 38 Q19 30 18 22Z" fill="#0d0508" />
    <path d="M38 22 Q39 30 39 38 L37 38 Q37 30 38 22Z" fill="#0d0508" />
    <rect x="17" y="10" width="22" height="5" rx="0" fill="#0d0508" />
    {/* Mandlové oči */}
    <path d="M20 23 Q23 21 26 23 Q23 25 20 23Z" fill="white" />
    <path d="M30 23 Q33 21 36 23 Q33 25 30 23Z" fill="white" />
    <circle cx="23" cy="23" r="1.2" fill="#0d0508" />
    <circle cx="33" cy="23" r="1.2" fill="#0d0508" />
    <path d="M23 29 Q28 32 33 29" stroke="#c9826a" strokeWidth="1" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 11 — Ondřej (sportovní typ, krátké vlasy) ───────
export const Avatar11 = ({ size }) => (
  <AvatarBase size={size} bg="#0a1a0a">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#1a5c1a" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#0d400d" />
    <rect x="23" y="35" width="10" height="12" fill="white" rx="1" />
    <polygon points="28,36 26,43 28,42 30,43" fill="#27ae60" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#e8b89a" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#e8b89a" />
    {/* Krátké hnědé vlasy */}
    <path d="M17 21 Q18 11 28 11 Q38 11 39 21 Q36 13 28 14 Q20 13 17 21Z" fill="#4a2810" />
    <ellipse cx="28" cy="13" rx="10" ry="3" fill="#4a2810" />
    <ellipse cx="23" cy="23" rx="2" ry="2.2" fill="white" />
    <ellipse cx="33" cy="23" rx="2" ry="2.2" fill="white" />
    <circle cx="23.5" cy="23.5" r="1.4" fill="#1a0800" />
    <circle cx="33.5" cy="23.5" r="1.4" fill="#1a0800" />
    {/* Výraznější obočí */}
    <path d="M20 20 Q23 19 26 20" stroke="#3a1a08" strokeWidth="1.4" fill="none" />
    <path d="M30 20 Q33 19 36 20" stroke="#3a1a08" strokeWidth="1.4" fill="none" />
    <path d="M23 29 Q28 33 33 29" stroke="#c0856a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
  </AvatarBase>
);

// ─── Avatar 12 — Sofie (africké vlasy, výrazná) ─────────────
export const Avatar12 = ({ size }) => (
  <AvatarBase size={size} bg="#0d0d1a">
    <ellipse cx="28" cy="46" rx="16" ry="10" fill="#1a3a6c" />
    <path d="M12 56 Q14 38 22 36 L28 38 L34 36 Q42 38 44 56Z" fill="#0d2040" />
    <rect x="23" y="35" width="10" height="12" fill="#eaf2ff" rx="2" />
    <ellipse cx="28" cy="34" rx="5" ry="3" fill="#7a4520" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#7a4520" />
    {/* Afro vlasy */}
    <circle cx="28" cy="16" r="14" fill="#0d0508" />
    <circle cx="28" cy="23" rx="11" ry="10" fill="#7a4520" />
    <ellipse cx="28" cy="23" rx="11" ry="12" fill="#7a4520" />
    <circle cx="15" cy="20" r="5" fill="#0d0508" />
    <circle cx="41" cy="20" r="5" fill="#0d0508" />
    <circle cx="20" cy="13" r="5" fill="#0d0508" />
    <circle cx="36" cy="13" r="5" fill="#0d0508" />
    <circle cx="28" cy="10" r="6" fill="#0d0508" />
    <ellipse cx="23" cy="23" rx="2" ry="2.2" fill="white" />
    <ellipse cx="33" cy="23" rx="2" ry="2.2" fill="white" />
    <circle cx="23.5" cy="23.5" r="1.4" fill="#050208" />
    <circle cx="33.5" cy="23.5" r="1.4" fill="#050208" />
    <path d="M23 29 Q28 33 33 29" stroke="#8a5a3a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {/* Náušnice */}
    <circle cx="17" cy="27" r="2" fill="#f39c12" />
    <circle cx="39" cy="27" r="2" fill="#f39c12" />
  </AvatarBase>
);

// ── Export všech avatarů ─────────────────────────────────────

export const AVATAR_COMPONENTS = [
  Avatar01, Avatar02, Avatar03, Avatar04,
  Avatar05, Avatar06, Avatar07, Avatar08,
  Avatar09, Avatar10, Avatar11, Avatar12,
];

export const AVATAR_CONFIGS = [
  { id: "AVATAR01", name: "Marek",    Component: Avatar01, color: "#1D9E75" },
  { id: "AVATAR02", name: "Jana",     Component: Avatar02, color: "#9B59B6" },
  { id: "AVATAR03", name: "Tomáš",    Component: Avatar03, color: "#27AE60" },
  { id: "AVATAR04", name: "Lucie",    Component: Avatar04, color: "#E74C3C" },
  { id: "AVATAR05", name: "Pavel",    Component: Avatar05, color: "#2980B9" },
  { id: "AVATAR06", name: "Marie",    Component: Avatar06, color: "#E67E22" },
  { id: "AVATAR07", name: "David",    Component: Avatar07, color: "#8E44AD" },
  { id: "AVATAR08", name: "Eliška",   Component: Avatar08, color: "#2471A3" },
  { id: "AVATAR09", name: "Jakub",    Component: Avatar09, color: "#C0392B" },
  { id: "AVATAR10", name: "Kateřina", Component: Avatar10, color: "#76448A" },
  { id: "AVATAR11", name: "Ondřej",   Component: Avatar11, color: "#1E8449" },
  { id: "AVATAR12", name: "Sofie",    Component: Avatar12, color: "#1A5276" },
];

export const getAvatarComponent = (avatarId) => {
  const config = AVATAR_CONFIGS.find((a) => a.id === avatarId);
  return config?.Component ?? Avatar01;
};

export const getAvatarColor = (avatarId) => {
  const config = AVATAR_CONFIGS.find((a) => a.id === avatarId);
  return config?.color ?? "#1D9E75";
};
