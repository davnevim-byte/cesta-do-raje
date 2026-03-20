// ============================================================
//  TileIllustration — SVG ilustrace pro každý typ políčka
//  Mini-scény které se zobrazí v modalu při přistání
// ============================================================

// Základní wrapper
const IllustrationBase = ({ children, bg = "#0d0d0f", size = 120 }) => (
  <svg
    width={size} height={size * 0.6}
    viewBox="0 0 200 120"
    xmlns="http://www.w3.org/2000/svg"
    style={{ borderRadius: 10, display: "block" }}
  >
    <rect width="200" height="120" fill={bg} />
    {children}
  </svg>
);

// ── NEGATIVNÍ políčka ────────────────────────────────────────

export const IllustrationCigarety = ({ size }) => (
  <IllustrationBase size={size} bg="#0d0808">
    {/* Tmavá krajina */}
    <rect x="0" y="80" width="200" height="40" fill="#1a0a0a" />
    {/* Mraky */}
    <ellipse cx="60" cy="25" rx="35" ry="20" fill="#2a1a1a" />
    <ellipse cx="90" cy="20" rx="40" ry="22" fill="#351a1a" />
    <ellipse cx="140" cy="28" rx="30" ry="18" fill="#2a1a1a" />
    {/* Krabička cigaret */}
    <rect x="82" y="50" width="36" height="50" rx="3" fill="#8b0000" />
    <rect x="82" y="50" width="36" height="15" rx="3" fill="#a00000" />
    <rect x="84" y="52" width="32" height="11" rx="2" fill="#cc0000" />
    {/* Cigarety vyčnívající */}
    <rect x="88" y="35" width="5" height="20" rx="2" fill="#f5f5dc" />
    <rect x="96" y="32" width="5" height="23" rx="2" fill="#f5f5dc" />
    <rect x="104" y="38" width="5" height="17" rx="2" fill="#f5f5dc" />
    {/* Filtr */}
    <rect x="88" y="50" width="5" height="4" rx="1" fill="#c8a882" />
    <rect x="96" y="50" width="5" height="4" rx="1" fill="#c8a882" />
    <rect x="104" y="50" width="5" height="4" rx="1" fill="#c8a882" />
    {/* Kouř */}
    <path d="M90 33 Q88 28 91 24 Q89 20 92 16" stroke="#888" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M98 30 Q96 24 99 20 Q97 15 100 11" stroke="#888" strokeWidth="1.5" fill="none" opacity="0.4" />
  </IllustrationBase>
);

export const IllustrationDrogy = ({ size }) => (
  <IllustrationBase size={size} bg="#08080d">
    <rect x="0" y="75" width="200" height="45" fill="#0d0d15" />
    {/* Tajemné světlo */}
    <ellipse cx="100" cy="60" rx="50" ry="30" fill="#1a0a2e" />
    {/* Lahvička */}
    <rect x="88" y="45" width="24" height="40" rx="4" fill="#2a1a4a" />
    <rect x="91" y="40" width="18" height="8" rx="2" fill="#3a2a5a" />
    <rect x="92" y="37" width="16" height="5" rx="2" fill="#4a3a6a" />
    {/* Tablety vedle */}
    <circle cx="70" cy="80" r="7" fill="#7a2a7a" />
    <circle cx="70" cy="80" r="4" fill="#9a3a9a" />
    <circle cx="55" cy="72" r="6" fill="#2a5a7a" />
    <circle cx="55" cy="72" r="3.5" fill="#3a7a9a" />
    <circle cx="140" cy="78" r="6" fill="#7a5a1a" />
    <circle cx="140" cy="78" r="3.5" fill="#9a7a2a" />
    {/* Dým / éter */}
    <path d="M100 42 Q95 35 100 28 Q97 22 102 16" stroke="#6a3a9a" strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M95 40 Q90 32 95 25" stroke="#5a2a8a" strokeWidth="1.5" fill="none" opacity="0.4" />
  </IllustrationBase>
);

export const IllustrationAlkohol = ({ size }) => (
  <IllustrationBase size={size} bg="#0d0a05">
    <rect x="0" y="75" width="200" height="45" fill="#150f05" />
    {/* Bouřkové mraky */}
    <ellipse cx="100" cy="30" rx="70" ry="35" fill="#1a1005" />
    {/* Lahev */}
    <path d="M85 30 Q83 40 80 55 L75 110 Q80 115 100 115 Q120 115 125 110 L120 55 Q117 40 115 30Z" fill="#4a3a0a" />
    <path d="M85 30 L115 30 L113 35 L87 35Z" fill="#5a4a1a" />
    <rect x="90" y="22" width="20" height="10" rx="2" fill="#6a5a2a" />
    {/* Amber tekutina */}
    <path d="M82 70 L75 110 Q80 115 100 115 Q120 115 125 110 L118 70Z" fill="#8B4513" opacity="0.7" />
    {/* Odlesk */}
    <path d="M88 35 Q87 55 86 75" stroke="rgba(255,220,100,0.2)" strokeWidth="3" fill="none" />
    {/* Sklenička */}
    <path d="M135 75 L130 110 L150 110 L145 75Z" fill="#3a3a5a" opacity="0.7" />
    <path d="M136 78 L131 108 L149 108 L144 78Z" fill="#8B4513" opacity="0.5" />
  </IllustrationBase>
);

export const IllustrationNemravnost = ({ size }) => (
  <IllustrationBase size={size} bg="#0d0510">
    <rect x="0" y="70" width="200" height="50" fill="#150820" />
    {/* Siluety postav */}
    <ellipse cx="80" cy="50" rx="18" ry="22" fill="#2a0a3a" />
    <circle cx="80" cy="30" r="12" fill="#2a0a3a" />
    <ellipse cx="120" cy="50" rx="18" ry="22" fill="#3a0a2a" />
    <circle cx="120" cy="30" r="12" fill="#3a0a2a" />
    {/* Zlověstné kvítky */}
    <circle cx="40" cy="85" r="10" fill="#4a0a1a" />
    <circle cx="40" cy="85" r="6" fill="#6a0a2a" />
    <circle cx="160" cy="80" r="8" fill="#4a0a1a" />
    <circle cx="160" cy="80" r="5" fill="#6a0a2a" />
    {/* Viny */}
    <path d="M30 90 Q50 80 70 90 Q90 100 110 90 Q130 80 150 90 Q170 100 190 90" stroke="#3a0a2a" strokeWidth="2" fill="none" />
    {/* Varující světlo */}
    <ellipse cx="100" cy="55" rx="30" ry="20" fill="#2a0a3a" opacity="0.8" />
    <text x="100" y="60" textAnchor="middle" fill="#8a1a4a" fontSize="20" fontWeight="bold">⚠</text>
  </IllustrationBase>
);

export const IllustrationSpatnaSpolecnost = ({ size }) => (
  <IllustrationBase size={size} bg="#080808">
    <rect x="0" y="70" width="200" height="50" fill="#0d0d0d" />
    {/* Siluety temných postav */}
    {[30, 60, 90, 120, 150, 170].map((x, i) => (
      <g key={i}>
        <ellipse cx={x} cy={65 + (i % 2) * 8} rx="10" ry="16" fill={i % 2 === 0 ? "#1a1a1a" : "#222"} />
        <circle cx={x} cy={47 + (i % 2) * 8} r="9" fill={i % 2 === 0 ? "#1a1a1a" : "#222"} />
      </g>
    ))}
    {/* Kouř / mlha */}
    <ellipse cx="100" cy="85" rx="80" ry="20" fill="#222" opacity="0.8" />
    {/* Zlé oči */}
    <circle cx="70" cy="50" r="3" fill="#e74c3c" opacity="0.8" />
    <circle cx="130" cy="45" r="3" fill="#e74c3c" opacity="0.8" />
    <circle cx="100" cy="55" r="2.5" fill="#e74c3c" opacity="0.6" />
  </IllustrationBase>
);

export const IllustrationSpiritismus = ({ size }) => (
  <IllustrationBase size={size} bg="#050510">
    <rect x="0" y="70" width="200" height="50" fill="#080815" />
    {/* Tmavá krajina */}
    <path d="M0 80 Q30 70 50 80 Q80 65 100 75 Q130 65 160 78 Q180 70 200 75 L200 120 L0 120Z" fill="#0a0a1a" />
    {/* Křišťálová koule */}
    <circle cx="100" cy="65" r="28" fill="none" stroke="#4a4a8a" strokeWidth="2" />
    <circle cx="100" cy="65" r="26" fill="#0a0a2a" opacity="0.9" />
    {/* Vnitřní záře */}
    <circle cx="100" cy="65" r="15" fill="#1a1a5a" />
    <circle cx="100" cy="65" r="8" fill="#3a3a9a" opacity="0.7" />
    {/* Mystický symbol */}
    <text x="100" y="70" textAnchor="middle" fill="#6a6aaa" fontSize="14">✦</text>
    {/* Stůl */}
    <rect x="65" y="88" width="70" height="6" rx="3" fill="#2a1a0a" />
    <rect x="70" y="93" width="8" height="20" rx="2" fill="#2a1a0a" />
    <rect x="122" y="93" width="8" height="20" rx="2" fill="#2a1a0a" />
    {/* Tarotové karty */}
    <rect x="72" y="76" width="14" height="20" rx="2" fill="#1a0a2a" stroke="#4a2a6a" strokeWidth="1" />
    <rect x="90" y="74" width="14" height="20" rx="2" fill="#1a0a2a" stroke="#4a2a6a" strokeWidth="1" />
    <rect x="114" y="76" width="14" height="20" rx="2" fill="#1a0a2a" stroke="#4a2a6a" strokeWidth="1" />
    {/* Duch */}
    <path d="M30 30 Q28 20 35 15 Q42 10 40 20 Q45 15 43 25 Q48 22 45 30 Q42 38 35 35 Q28 38 30 30Z" fill="#6a6a9a" opacity="0.4" />
  </IllustrationBase>
);

export const IllustrationSvatky = ({ size }) => (
  <IllustrationBase size={size} bg="#0d0d0d">
    <rect x="0" y="70" width="200" height="50" fill="#0a0a0a" />
    {/* Temný strom */}
    <path d="M80 115 L80 60 L70 55 L80 50 L70 40 L85 38 L80 25 L100 22 L120 25 L115 38 L130 40 L120 50 L130 55 L120 60 L120 115Z" fill="#1a1a1a" />
    {/* Dýně Halloween */}
    <ellipse cx="45" cy="90" rx="22" ry="20" fill="#8B4513" />
    <ellipse cx="45" cy="90" rx="20" ry="18" fill="#cc6600" />
    {/* Oči dýně */}
    <path d="M35 85 L39 80 L43 85Z" fill="#1a1a1a" />
    <path d="M47 85 L51 80 L55 85Z" fill="#1a1a1a" />
    {/* Úsměv dýně */}
    <path d="M35 93 L38 97 L42 93 L45 97 L48 93 L52 97 L55 93" stroke="#1a1a1a" strokeWidth="2" fill="none" />
    {/* Světélko uvnitř */}
    <ellipse cx="45" cy="92" rx="10" ry="8" fill="#ff6600" opacity="0.3" />
    {/* Kříž na stromě */}
    <circle cx="90" cy="45" r="4" fill="#aa0000" />
    <circle cx="100" cy="48" r="3" fill="#00aa00" />
    <circle cx="110" cy="43" r="4" fill="#0000aa" />
  </IllustrationBase>
);

export const IllustrationDvojiZivot = ({ size }) => (
  <IllustrationBase size={size} bg="#0d0d0d">
    {/* Rozdělená krajina */}
    <rect x="0" y="0" width="100" height="120" fill="#0a1a0a" />
    <rect x="100" y="0" width="100" height="120" fill="#0a0a1a" />
    <line x1="100" y1="0" x2="100" y2="120" stroke="#888" strokeWidth="2" strokeDasharray="5 3" />
    {/* Dvě tváře — světlá a tmavá */}
    <circle cx="55" cy="55" r="25" fill="#e8c090" />
    <path d="M30 55 Q30 30 55 30 Q80 30 80 55Z" fill="#f0d0b0" />
    <circle cx="47" cy="52" r="4" fill="white" />
    <circle cx="63" cy="52" r="4" fill="white" />
    <circle cx="48" cy="53" r="2.5" fill="#333" />
    <circle cx="64" cy="53" r="2.5" fill="#333" />
    <path d="M47 63 Q55 68 63 63" stroke="#c08060" strokeWidth="1.5" fill="none" />
    {/* Tmavá tvář */}
    <circle cx="145" cy="55" r="25" fill="#2a1a1a" />
    <path d="M120 55 Q120 30 145 30 Q170 30 170 55Z" fill="#1a1010" />
    <circle cx="137" cy="52" r="4" fill="#333" />
    <circle cx="153" cy="52" r="4" fill="#333" />
    <circle cx="138" cy="53" r="2.5" fill="#e74c3c" />
    <circle cx="154" cy="53" r="2.5" fill="#e74c3c" />
    <path d="M137 65 Q145 61 153 65" stroke="#8a3a3a" strokeWidth="1.5" fill="none" />
  </IllustrationBase>
);

// ── POZITIVNÍ políčka ────────────────────────────────────────

export const IllustrationModlitba = ({ size }) => (
  <IllustrationBase size={size} bg="#05100a">
    {/* Ranní světlo */}
    <ellipse cx="100" cy="120" rx="80" ry="60" fill="#0a2010" />
    <ellipse cx="100" cy="110" rx="60" ry="40" fill="#0d3010" />
    {/* Paprsky světla */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const x2 = 100 + 80 * Math.cos(rad);
      const y2 = 60 + 80 * Math.sin(rad);
      return <line key={i} x1="100" y1="60" x2={x2} y2={y2} stroke="#1D9E75" strokeWidth="0.5" opacity="0.2" />;
    })}
    {/* Ruce v modlitbě */}
    <path d="M75 80 Q75 60 82 50 Q88 40 92 55 L90 80Z" fill="#d4a574" />
    <path d="M125 80 Q125 60 118 50 Q112 40 108 55 L110 80Z" fill="#d4a574" />
    <path d="M90 55 Q95 45 100 45 Q105 45 110 55 L110 80 L90 80Z" fill="#d4a574" />
    {/* Záře nad rukama */}
    <ellipse cx="100" cy="50" rx="20" ry="15" fill="#1D9E75" opacity="0.2" />
    <ellipse cx="100" cy="48" rx="10" ry="8" fill="#9FE1CB" opacity="0.3" />
    {/* Hvězdičky */}
    <circle cx="40" cy="20" r="1.5" fill="#9FE1CB" opacity="0.7" />
    <circle cx="160" cy="15" r="1.5" fill="#9FE1CB" opacity="0.7" />
    <circle cx="70" cy="10" r="1" fill="#9FE1CB" opacity="0.5" />
    <circle cx="130" cy="25" r="1" fill="#9FE1CB" opacity="0.5" />
  </IllustrationBase>
);

export const IllustrationStudium = ({ size }) => (
  <IllustrationBase size={size} bg="#050f08">
    <rect x="0" y="80" width="200" height="40" fill="#0a1a10" />
    {/* Otevřená Bible */}
    <path d="M40 45 Q40 30 100 30 Q160 30 160 45 L160 100 Q100 105 100 105 Q40 105 40 100Z" fill="#2a1a0a" />
    <path d="M40 45 Q40 30 100 30 L100 105 Q40 105 40 100Z" fill="#f5f0e8" />
    <path d="M100 30 Q160 30 160 45 L160 100 Q100 105 100 105Z" fill="#f0ebe0" />
    {/* Hřbet */}
    <rect x="97" y="28" width="6" height="78" rx="3" fill="#8B4513" />
    {/* Řádky textu */}
    {[40, 47, 54, 61, 68, 75, 82].map((y) => (
      <g key={y}>
        <line x1="52" y1={y} x2="93" y2={y} stroke="#ccc" strokeWidth="1" />
        <line x1="107" y1={y} x2="148" y2={y} stroke="#ccc" strokeWidth="1" />
      </g>
    ))}
    {/* Zlaté světlo z Bible */}
    <ellipse cx="100" cy="60" rx="40" ry="30" fill="#f5d76e" opacity="0.1" />
    {/* Záložka */}
    <rect x="145" y="28" width="6" height="25" rx="3" fill="#e74c3c" />
    {/* Světelné paprsky */}
    <line x1="100" y1="30" x2="100" y2="5" stroke="#f5d76e" strokeWidth="1" opacity="0.3" />
    <line x1="90" y1="32" x2="70" y2="8" stroke="#f5d76e" strokeWidth="0.8" opacity="0.2" />
    <line x1="110" y1="32" x2="130" y2="8" stroke="#f5d76e" strokeWidth="0.8" opacity="0.2" />
  </IllustrationBase>
);

export const IllustrationShromazdeni = ({ size }) => (
  <IllustrationBase size={size} bg="#050a0f">
    <rect x="0" y="75" width="200" height="45" fill="#071015" />
    {/* Budova Království síně */}
    <rect x="50" y="30" width="100" height="70" rx="3" fill="#0d2535" />
    <rect x="50" y="30" width="100" height="20" rx="3" fill="#1a3a4a" />
    {/* Okna */}
    <rect x="65" y="55" width="20" height="25" rx="2" fill="#f5d76e" opacity="0.8" />
    <rect x="92" y="55" width="20" height="25" rx="2" fill="#f5d76e" opacity="0.8" />
    <rect x="119" y="55" width="20" height="25" rx="2" fill="#f5d76e" opacity="0.8" />
    {/* Dveře */}
    <rect x="88" y="78" width="24" height="22" rx="2" fill="#8B4513" />
    {/* Střecha / jehlice */}
    <polygon points="100,5 55,30 145,30" fill="#1a4a5a" />
    <line x1="100" y1="0" x2="100" y2="30" stroke="#f5d76e" strokeWidth="1.5" />
    {/* Teplé světlo z oken */}
    <ellipse cx="75" cy="68" rx="15" ry="10" fill="#f5d76e" opacity="0.1" />
    <ellipse cx="102" cy="68" rx="15" ry="10" fill="#f5d76e" opacity="0.1" />
    <ellipse cx="129" cy="68" rx="15" ry="10" fill="#f5d76e" opacity="0.1" />
    {/* Hvězdy */}
    <circle cx="20" cy="15" r="1.5" fill="#9FE1CB" />
    <circle cx="180" cy="20" r="1.5" fill="#9FE1CB" />
    <circle cx="35" cy="8" r="1" fill="#9FE1CB" />
  </IllustrationBase>
);

export const IllustrationSluzba = ({ size }) => (
  <IllustrationBase size={size} bg="#050f0a">
    <rect x="0" y="75" width="200" height="45" fill="#0a1a10" />
    {/* Dveře domu */}
    <rect x="30" y="30" width="55" height="70" rx="4" fill="#8B4513" />
    <rect x="33" y="33" width="49" height="64" rx="3" fill="#6b3410" />
    {/* Klepadlo */}
    <circle cx="72" cy="65" r="4" fill="#f39c12" />
    {/* Svědkové u dveří */}
    {/* Postava 1 */}
    <ellipse cx="120" cy="85" rx="12" ry="18" fill="#1a3a5a" />
    <circle cx="120" cy="62" r="11" fill="#d4a574" />
    <path d="M109 72 Q109 60 120 58 Q131 60 131 72Z" fill="#2a1a08" />
    {/* Postava 2 */}
    <ellipse cx="150" cy="85" rx="11" ry="18" fill="#3a1a6a" />
    <circle cx="150" cy="63" r="10" fill="#fad5b5" />
    <path d="M140 70 Q140 60 150 58 Q160 60 160 70Z" fill="#f5d76e" />
    {/* Bible / tablet */}
    <rect x="108" y="75" width="14" height="18" rx="2" fill="#1a3a1a" />
    <rect x="142" y="78" width="14" height="14" rx="2" fill="#1a1a3a" />
    {/* Slunce vychází */}
    <ellipse cx="180" cy="15" rx="20" ry="18" fill="#f39c12" opacity="0.3" />
    <ellipse cx="180" cy="15" rx="12" ry="11" fill="#f5d76e" opacity="0.5" />
  </IllustrationBase>
);

export const IllustrationKomentare = ({ size }) => (
  <IllustrationBase size={size} bg="#05080f">
    <rect x="0" y="75" width="200" height="45" fill="#080d18" />
    {/* Řečniště */}
    <rect x="80" y="45" width="40" height="50" rx="3" fill="#1a2a3a" />
    <path d="M75 50 L80 45 L120 45 L125 50Z" fill="#2a3a4a" />
    {/* Postava u řečniště */}
    <ellipse cx="100" cy="60" rx="14" ry="20" fill="#1a3a6a" />
    <circle cx="100" cy="40" r="11" fill="#d4a574" />
    <path d="M89 50 Q89 38 100 36 Q111 38 111 50Z" fill="#2c1810" />
    {/* Mikrofon */}
    <line x1="100" y1="52" x2="100" y2="65" stroke="#888" strokeWidth="1.5" />
    <circle cx="100" cy="50" r="4" fill="#555" />
    {/* Řady sedadel — siluety */}
    {[1, 2, 3].map((row) => (
      [30, 55, 145, 170].map((x) => (
        <g key={`${row}-${x}`}>
          <circle cx={x} cy={65 + row * 14} r="8" fill="#0d1a2a" />
          <ellipse cx={x} cy={75 + row * 14} rx="10" ry="12" fill="#0d1a2a" />
        </g>
      ))
    ))}
  </IllustrationBase>
);

export const IllustrationStavby = ({ size }) => (
  <IllustrationBase size={size} bg="#050a05">
    <rect x="0" y="80" width="200" height="40" fill="#0a150a" />
    {/* Nedokončená budova */}
    <rect x="40" y="30" width="120" height="75" rx="2" fill="#1a2a1a" />
    <rect x="40" y="30" width="120" height="15" rx="2" fill="#0d4020" />
    {/* Okna */}
    <rect x="55" y="50" width="20" height="20" rx="2" fill="#1a3a4a" />
    <rect x="90" y="50" width="20" height="20" rx="2" fill="#1a3a4a" />
    <rect x="125" y="50" width="20" height="20" rx="2" fill="#1a3a4a" />
    {/* Lešení */}
    <line x1="35" y1="25" x2="35" y2="110" stroke="#8B4513" strokeWidth="2" />
    <line x1="165" y1="25" x2="165" y2="110" stroke="#8B4513" strokeWidth="2" />
    {[30, 50, 70, 90].map((y) => (
      <line key={y} x1="35" y1={y} x2="165" y2={y} stroke="#8B4513" strokeWidth="1.5" />
    ))}
    {/* Pracovníci — siluety */}
    <circle cx="70" cy="28" r="6" fill="#2a3a2a" />
    <ellipse cx="70" cy="35" rx="7" ry="10" fill="#2a3a2a" />
    {/* Helma */}
    <ellipse cx="70" cy="23" rx="7" ry="4" fill="#f39c12" />
    <circle cx="130" cy="28" r="6" fill="#2a3a2a" />
    <ellipse cx="130" cy="35" rx="7" ry="10" fill="#2a3a2a" />
    <ellipse cx="130" cy="23" rx="7" ry="4" fill="#f39c12" />
  </IllustrationBase>
);

export const IllustrationPrihlaska = ({ size }) => (
  <IllustrationBase size={size} bg="#050f0f">
    <rect x="0" y="80" width="200" height="40" fill="#081515" />
    {/* Papír přihlášky */}
    <rect x="55" y="20" width="90" height="90" rx="4" fill="#f5f0e8" />
    <rect x="55" y="20" width="90" height="15" rx="4" fill="#1D9E75" />
    {/* Nadpis */}
    <rect x="62" y="26" width="60" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
    {/* Řádky formuláře */}
    {[45, 56, 67, 78, 89].map((y) => (
      <line key={y} x1="65" y1={y} x2="135" y2={y} stroke="#ccc" strokeWidth="1" />
    ))}
    {/* Zaškrtávací pole */}
    <rect x="65" y="93" width="10" height="10" rx="2" fill="none" stroke="#1D9E75" strokeWidth="1.5" />
    <path d="M67 98 L70 101 L76 95" stroke="#1D9E75" strokeWidth="1.5" fill="none" />
    {/* Pero */}
    <path d="M140 80 L155 65 L160 70 L145 85Z" fill="#1a1a3a" />
    <path d="M140 80 L143 83 L145 85Z" fill="#888" />
    {/* Světlo naděje */}
    <ellipse cx="100" cy="50" rx="30" ry="20" fill="#1D9E75" opacity="0.08" />
  </IllustrationBase>
);

// ── SPECIÁLNÍ políčka ────────────────────────────────────────

export const IllustrationDvere = ({ size }) => (
  <IllustrationBase size={size} bg="#050f05">
    <rect x="0" y="80" width="200" height="40" fill="#0a1a0a" />
    {/* Záře za dveřmi */}
    <ellipse cx="100" cy="70" rx="45" ry="55" fill="#f5d76e" opacity="0.15" />
    <ellipse cx="100" cy="70" rx="30" ry="40" fill="#f5d76e" opacity="0.2" />
    {/* Rám dveří */}
    <rect x="65" y="20" width="70" height="90" rx="5" fill="#5a3010" />
    <rect x="68" y="22" width="64" height="86" rx="4" fill="#6b3a12" />
    {/* Mřížka v dveřích */}
    <rect x="68" y="22" width="64" height="42" rx="4" fill="#f5d76e" opacity="0.3" />
    <rect x="68" y="66" width="64" height="42" rx="4" fill="#5a3010" />
    {/* Klepadlo */}
    <circle cx="100" cy="68" r="5" fill="#f39c12" />
    <circle cx="100" cy="68" r="3" fill="#e67e22" />
    {/* Klika */}
    <rect x="88" y="74" width="12" height="3" rx="1.5" fill="#c0922a" />
    {/* Světlo vycházející zpoza dveří */}
    <line x1="65" y1="22" x2="40" y2="10" stroke="#f5d76e" strokeWidth="1" opacity="0.4" />
    <line x1="135" y1="22" x2="160" y2="10" stroke="#f5d76e" strokeWidth="1" opacity="0.4" />
    <line x1="65" y1="60" x2="35" y2="60" stroke="#f5d76e" strokeWidth="1" opacity="0.3" />
    <line x1="135" y1="60" x2="165" y2="60" stroke="#f5d76e" strokeWidth="1" opacity="0.3" />
    {/* Rostliny podél dveří */}
    <path d="M55 100 Q50 80 55 70 Q58 80 55 100Z" fill="#1D9E75" />
    <path d="M145 100 Q150 80 145 70 Q142 80 145 100Z" fill="#1D9E75" />
  </IllustrationBase>
);

export const IllustrationStart = ({ size }) => (
  <IllustrationBase size={size} bg="#050a05">
    <rect x="0" y="75" width="200" height="45" fill="#0a1a0a" />
    {/* Cesta */}
    <path d="M80 120 Q100 80 100 30 Q100 80 120 120Z" fill="#5a4a2a" opacity="0.5" />
    {/* Strom vlevo */}
    <rect x="25" y="60" width="8" height="40" rx="2" fill="#5a3010" />
    <circle cx="29" cy="52" r="18" fill="#1a4a1a" />
    <circle cx="22" cy="58" r="14" fill="#1D9E75" />
    <circle cx="36" cy="55" r="15" fill="#145214" />
    {/* Strom vpravo */}
    <rect x="167" y="65" width="8" height="35" rx="2" fill="#5a3010" />
    <circle cx="171" cy="57" r="16" fill="#1a4a1a" />
    {/* Startovací vlajka */}
    <line x1="100" y1="20" x2="100" y2="80" stroke="#888" strokeWidth="2" />
    <rect x="100" y="20" width="30" height="20" rx="2" fill="#1D9E75" />
    {/* Šachovnicový vzor vlajky */}
    {[0, 1, 2].map((col) =>
      [0, 1].map((row) => (
        <rect
          key={`${col}-${row}`}
          x={100 + col * 10}
          y={20 + row * 10}
          width={10} height={10}
          fill={((col + row) % 2 === 0) ? "white" : "#1D9E75"}
        />
      ))
    )}
    {/* Světlo nového dne */}
    <ellipse cx="100" cy="5" rx="30" ry="20" fill="#f5d76e" opacity="0.2" />
  </IllustrationBase>
);

export const IllustrationVstup = ({ size }) => (
  <IllustrationBase size={size} bg="#050f08">
    <rect x="0" y="80" width="200" height="40" fill="#0a1a10" />
    {/* Brána */}
    <rect x="20" y="20" width="15" height="80" rx="3" fill="#8B4513" />
    <rect x="165" y="20" width="15" height="80" rx="3" fill="#8B4513" />
    {/* Oblouk brány */}
    <path d="M35 20 Q100 -15 165 20" fill="none" stroke="#8B4513" strokeWidth="8" />
    {/* Zlaté ozdoby */}
    <circle cx="100" cy="8" r="8" fill="#f39c12" />
    <circle cx="100" cy="8" r="5" fill="#f5d76e" />
    <circle cx="35" cy="20" r="5" fill="#f39c12" />
    <circle cx="165" cy="20" r="5" fill="#f39c12" />
    {/* Cesta dovnitř */}
    <path d="M60 120 Q100 80 140 120" fill="#9FE1CB" opacity="0.15" />
    {/* Světlo za branou */}
    <ellipse cx="100" cy="60" rx="50" ry="60" fill="#1D9E75" opacity="0.1" />
    <ellipse cx="100" cy="50" rx="30" ry="40" fill="#9FE1CB" opacity="0.1" />
    {/* Kvítky u brány */}
    <circle cx="50" cy="90" r="6" fill="#e74c3c" opacity="0.7" />
    <circle cx="50" cy="90" r="3" fill="#f39c12" />
    <circle cx="150" cy="88" r="6" fill="#9b59b6" opacity="0.7" />
    <circle cx="150" cy="88" r="3" fill="#f39c12" />
  </IllustrationBase>
);

// ── Mapa typů na komponenty ──────────────────────────────────

export const TILE_ILLUSTRATIONS = {
  negative: {
    CIGARETY:         IllustrationCigarety,
    DROGY:            IllustrationDrogy,
    ALKOHOL:          IllustrationAlkohol,
    NEMRAVNOST:       IllustrationNemravnost,
    "ŠPATNÁ SPOLEČNOST": IllustrationSpatnaSpolecnost,
    SPIRITISMUS:      IllustrationSpiritismus,
    SVÁTKY:           IllustrationSvatky,
    "DVOJÍ ŽIVOT":    IllustrationDvojiZivot,
  },
  positive: {
    MODLITBA:         IllustrationModlitba,
    STUDIUM:          IllustrationStudium,
    SHROMÁŽDĚNÍ:      IllustrationShromazdeni,
    SLUŽBA:           IllustrationSluzba,
    KOMENTÁŘE:        IllustrationKomentare,
    STAVBY:           IllustrationStavby,
    PŘIHLÁŠKA:        IllustrationPrihlaska,
  },
  special: {
    DVEŘE:            IllustrationDvere,
    START:            IllustrationStart,
    VSTUP:            IllustrationVstup,
  },
};

export const getTileIllustration = (tileName, tileType) => {
  const nameMap = TILE_ILLUSTRATIONS[tileType] ?? TILE_ILLUSTRATIONS.positive;
  return nameMap[tileName] ?? IllustrationStudium;
};
