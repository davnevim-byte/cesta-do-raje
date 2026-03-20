// ============================================================
//  OVOCE DUCHA — Cesta do Ráje
//  Galatským 5:22–23 (NWT)
//
//  Systém sleduje které ovoce ducha hráč projevuje
//  během hry — na základě políček, odpovědí a scénářů.
//  Na konci hra vygeneruje unikátní titul pro každého hráče.
// ============================================================

// ─────────────────────────────────────────────
//  9 OVOCÍ DUCHA
// ─────────────────────────────────────────────

export const FRUITS = {
  láska: {
    key: "láska",
    label: "Láska",
    emoji: "❤️",
    color: "#D4537E",
    bgColor: "#FBEAF0",
    verseRef: "Galatským 5:22",
    description:
      "Nezištná láska k Jehovovi i k lidem — základ všeho ostatního ovoce.",
    howEarned: [
      "Úspěšné svědectví u dveří",
      "Pomoc druhému hráči (Pomocná ruka)",
      "Scénáře kategorie 'služba u dveří'",
    ],
  },
  radost: {
    key: "radost",
    label: "Radost",
    emoji: "😊",
    color: "#EF9F27",
    bgColor: "#FAEEDA",
    verseRef: "Galatským 5:22",
    description:
      "Hluboká radost z Jehovova přátelství — nezávislá na okolnostech.",
    howEarned: [
      "Políčko VSTUP do sboru",
      "Políčko SHROMÁŽDĚNÍ",
      "Divoká karta 'Okrskový sjezd'",
      "Skupinová chvíle vděčnosti",
    ],
  },
  pokoj: {
    key: "pokoj",
    label: "Pokoj",
    emoji: "🕊️",
    color: "#1D9E75",
    bgColor: "#E1F5EE",
    verseRef: "Galatským 5:22",
    description:
      "Vnitřní klid plynoucí z důvěry v Jehovu — i uprostřed zkoušek.",
    howEarned: [
      "Každé políčko MODLITBA",
      "Scénář 'Truchlící soused'",
      "Klidná reakce na agresivní scénáře",
    ],
  },
  trpělivost: {
    key: "trpělivost",
    label: "Trpělivost",
    emoji: "⏳",
    color: "#7F77DD",
    bgColor: "#EEEDFE",
    verseRef: "Galatským 5:22",
    description:
      "Vytrvalé snášení obtíží bez reptání — napodobování Jehovovy trpělivosti.",
    howEarned: [
      "Políčko PŘIHLÁŠKA průkopníka",
      "Divoká karta 'Zkouška víry'",
      "Scénář 'Otázka o Trojici' — trpělivé vysvětlení",
      "Přeskočení tahu bez reptání",
    ],
  },
  laskavost: {
    key: "laskavost",
    label: "Laskavost",
    emoji: "🤲",
    color: "#378ADD",
    bgColor: "#E6F1FB",
    verseRef: "Galatským 5:22",
    description:
      "Praktická dobrota k ostatním — laskavé činy bez očekávání odměny.",
    howEarned: [
      "Políčko KAZATELSKÁ SLUŽBA",
      "Políčko DVEŘE (svědectví)",
      "Divoká karta 'Pomocná ruka'",
      "Scénář 'Bratr/sestra prochází těžkostmi'",
    ],
  },
  dobrota: {
    key: "dobrota",
    label: "Dobrota",
    emoji: "🌟",
    color: "#639922",
    bgColor: "#EAF3DE",
    verseRef: "Galatským 5:22",
    description:
      "Morální bezúhonnost a štědrost — odraz Jehovovy přirozenosti.",
    howEarned: [
      "Políčko KOMENTÁŘE",
      "Políčko STAVBY Království síní",
      "Divoká karta 'Bratrská pomoc'",
      "Sdílení povzbuzení s ostatními",
    ],
  },
  víra: {
    key: "víra",
    label: "Víra",
    emoji: "🙏",
    color: "#185FA5",
    bgColor: "#E6F1FB",
    verseRef: "Galatským 5:22",
    description:
      "Pevná důvěra v Jehovu a jeho sliby — projevující se skutky.",
    howEarned: [
      "Každé políčko STUDIUM Bible",
      "Správná odpověď na biblickou otázku",
      "Divoká karta 'Verš zpaměti'",
      "Scénář 'Svědectví za mřížemi'",
    ],
  },
  mírnost: {
    key: "mírnost",
    label: "Mírnost",
    emoji: "🍃",
    color: "#0F6E56",
    bgColor: "#E1F5EE",
    verseRef: "Galatským 5:23",
    description:
      "Jemnost a ohleduplnost v jednání — síla ovládaná moudrostí.",
    howEarned: [
      "Klidná reakce na agresivní scénář",
      "Scénář 'Agresivní muž' — zachování klidu",
      "Scénář 'Kritik organizace'",
      "Nepřetí se zbytečně s ostatními hráči",
    ],
  },
  sebeovládání: {
    key: "sebeovládání",
    label: "Sebeovládání",
    emoji: "💪",
    color: "#533A1B",
    bgColor: "#FAEEDA",
    verseRef: "Galatským 5:23",
    description:
      "Ovládání vlastních tužeb a emocí — klíč k integritě.",
    howEarned: [
      "Správné zodpovězení negativního políčka",
      "Odmítnutí trestu skrze biblickou odpověď",
      "Divoká karta 'Rozptýlení světa' — escape",
      "Scénář 'Spolužák ve škole'",
    ],
  },
};

export const FRUIT_KEYS = Object.keys(FRUITS);

// ─────────────────────────────────────────────
//  POČÁTEČNÍ STAV HRÁČE
// ─────────────────────────────────────────────

export const createInitialFruitScore = () =>
  FRUIT_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

// ─────────────────────────────────────────────
//  PŘIDÁNÍ OVOCE DUCHA
// ─────────────────────────────────────────────

export const addFruit = (fruitScore, fruitKey, amount = 1) => {
  if (!fruitKey || !FRUITS[fruitKey]) return fruitScore;
  return {
    ...fruitScore,
    [fruitKey]: (fruitScore[fruitKey] || 0) + amount,
  };
};

// ─────────────────────────────────────────────
//  VYHODNOCENÍ — top ovoce hráče
// ─────────────────────────────────────────────

export const getTopFruits = (fruitScore, count = 3) => {
  return Object.entries(fruitScore)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([key, score]) => ({ ...FRUITS[key], score }));
};

export const getTotalFruitScore = (fruitScore) =>
  Object.values(fruitScore).reduce((sum, v) => sum + v, 0);

// ─────────────────────────────────────────────
//  SYSTÉM TITULŮ
//  Titul se skládá ze dvou nejsilnějších ovocí
//  + celkového duchovního výkonu hráče
// ─────────────────────────────────────────────

// Tituly podle nejsilnějšího ovoce
export const PRIMARY_TITLES = {
  láska: [
    "Milující svědek",
    "Srdce Sboru",
    "Odraz Jehovovy Lásky",
    "Věrný Přítel",
    "Pastýřské Srdce",
  ],
  radost: [
    "Radostný Zvěstovatel",
    "Světlo Sboru",
    "Posol Dobré Zprávy",
    "Jásavý Průkopník",
    "Jehova je Moje Radost",
  ],
  pokoj: [
    "Strážce Pokoje",
    "Klidný Služebník",
    "Tichý Svědek",
    "Modlitební Bojovník",
    "Jehovův Pokoj",
  ],
  trpělivost: [
    "Trpělivý Průkopník",
    "Věrný až do Konce",
    "Vytrvalý Svědek",
    "Jako Job",
    "Strážce Integrity",
  ],
  laskavost: [
    "Laskavý Samaritán",
    "Pomocná Ruka Sboru",
    "Praktická Láska",
    "Odraz Jehovovy Laskavosti",
    "Věrný Pomocník",
  ],
  dobrota: [
    "Bezúhonný Svědek",
    "Šalomounova Moudrost",
    "Morální Pevnost",
    "Dobrý a Věrný Otrok",
    "Odraz Jehovovy Dobroty",
  ],
  víra: [
    "Vírou Obstál/Obstála",
    "Abrahamova Víra",
    "Pilný Studující",
    "Strážce Pravdy",
    "Věrný Biblista",
  ],
  mírnost: [
    "Mírný Svědek",
    "Jehovova Jemnost",
    "Taktní Zvěstovatel",
    "Mírnost v Bouři",
    "Pastýřská Mírnost",
  ],
  sebeovládání: [
    "Pevný ve Zkouškách",
    "Ovládaná Síla",
    "Danielova Integrita",
    "Nezlomný Svědek",
    "Jehovův Bojovník",
  ],
};

// Titulní předpony podle celkového výkonu
export const PERFORMANCE_PREFIXES = {
  legendary: "⭐ Legendární",  // top 100% — 20+ bodů celkem
  excellent:  "✨ Vynikající",  // 15–19 bodů
  good:       "🌿 Věrný",       // 10–14 bodů
  average:    "🌱 Rostoucí",    // 5–9 bodů
  beginner:   "🌸 Nováček",     // 0–4 body
};

const getPerformancePrefix = (totalScore) => {
  if (totalScore >= 20) return PERFORMANCE_PREFIXES.legendary;
  if (totalScore >= 15) return PERFORMANCE_PREFIXES.excellent;
  if (totalScore >= 10) return PERFORMANCE_PREFIXES.good;
  if (totalScore >= 5)  return PERFORMANCE_PREFIXES.average;
  return PERFORMANCE_PREFIXES.beginner;
};

// Kombinované tituly pro dvě nejsilnější ovoce
export const COMBO_TITLES = {
  "láska+radost":       "Radostné Srdce Sboru",
  "láska+pokoj":        "Klidný Milující Pastýř",
  "láska+trpělivost":   "Trpělivý Ochránce",
  "láska+laskavost":    "Dobrý Samaritán",
  "láska+dobrota":      "Věrný Příteli Jehovy",
  "láska+víra":         "Láska a Víra — Pilíře Sboru",
  "láska+mírnost":      "Mírný a Milující",
  "láska+sebeovládání": "Silné ale Laskavé Srdce",
  "radost+pokoj":       "Klidná Radost v Jehovovi",
  "radost+víra":        "Jásavý Věřící",
  "radost+laskavost":   "Světlo a Teplo Sboru",
  "pokoj+víra":         "Tichá Pevná Víra",
  "pokoj+mírnost":      "Jehovova Tichá Síla",
  "trpělivost+víra":    "Jobova Trpělivost a Abrahamova Víra",
  "trpělivost+sebeovládání": "Ocelová Integrita",
  "laskavost+dobrota":  "Ruka i Srdce Otevřené",
  "víra+sebeovládání":  "Danielova Cesta",
  "víra+dobrota":       "Pilný Bezúhonný Otrok",
  "mírnost+sebeovládání": "Ježíšova Mírnost",
};

// ─────────────────────────────────────────────
//  GENERÁTOR TITULU pro hráče
// ─────────────────────────────────────────────

export const generatePlayerTitle = (playerName, fruitScore, position, circle) => {
  const totalScore = getTotalFruitScore(fruitScore);
  const topFruits  = getTopFruits(fruitScore, 2);
  const prefix     = getPerformancePrefix(totalScore);

  // Pokud hráč nedostal žádné ovoce
  if (totalScore === 0) {
    return {
      prefix:    "🌸 Nováček",
      title:     "Nováček na Cestě",
      comboKey:  null,
      topFruits: [],
      totalScore: 0,
      summary:   `${playerName} teprve začíná svou cestu. Jehova vidí každý krok!`,
    };
  }

  const [first, second] = topFruits;

  // Zkus najít combo titul
  let comboKey  = null;
  let mainTitle = null;

  if (first && second && second.score > 0) {
    const key1 = `${first.key}+${second.key}`;
    const key2 = `${second.key}+${first.key}`;
    if (COMBO_TITLES[key1]) { comboKey = key1; mainTitle = COMBO_TITLES[key1]; }
    else if (COMBO_TITLES[key2]) { comboKey = key2; mainTitle = COMBO_TITLES[key2]; }
  }

  // Pokud není combo — použij primární titul prvního ovoce
  if (!mainTitle && first) {
    const options = PRIMARY_TITLES[first.key] || ["Věrný Svědek"];
    mainTitle = options[Math.floor(Math.random() * options.length)];
  }

  // Shrnutí cesty hráče
  const circleLabel = circle === "inner" ? "vnitřního kruhu (sboru)" : "vnějšího kruhu (světa)";
  const fruitSummary = topFruits
    .filter((f) => f.score > 0)
    .map((f) => `${f.emoji} ${f.label} (${f.score}×)`)
    .join(" · ");

  const summaryLines = [
    `${playerName} dosáhl/a políčka ${position} ${circleLabel}.`,
    fruitSummary
      ? `Nejsilnější ovoce ducha: ${fruitSummary}.`
      : "",
    totalScore >= 15
      ? "Výjimečné duchovní úsilí — Jehova jistě žehná!"
      : totalScore >= 8
      ? "Solidní duchovní růst na cestě do Ráje."
      : "Každý krok se počítá — cesta teprve začíná.",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    prefix,
    title: mainTitle || "Věrný Svědek",
    comboKey,
    topFruits,
    totalScore,
    summary: summaryLines,
  };
};

// ─────────────────────────────────────────────
//  CELKOVÉ VYHODNOCENÍ HRY
// ─────────────────────────────────────────────

export const evaluateAllPlayers = (players) => {
  return players.map((player) => ({
    ...player,
    titleData: generatePlayerTitle(
      player.name,
      player.fruitScore || createInitialFruitScore(),
      player.position,
      player.circle
    ),
  }));
};

// Hráč s nejvíce ovoce ducha celkově
export const getMostFruitfulPlayer = (players) => {
  return players.reduce((best, player) => {
    const score = getTotalFruitScore(player.fruitScore || {});
    const bestScore = getTotalFruitScore(best.fruitScore || {});
    return score > bestScore ? player : best;
  }, players[0]);
};

// Hráč s nejvíce konkrétním ovocem
export const getMostOfFruit = (players, fruitKey) => {
  return players.reduce((best, player) => {
    const score = (player.fruitScore || {})[fruitKey] || 0;
    const bestScore = (best.fruitScore || {})[fruitKey] || 0;
    return score > bestScore ? player : best;
  }, players[0]);
};

// ─────────────────────────────────────────────
//  SPECIÁLNÍ CENY NA KONCI HRY
// ─────────────────────────────────────────────

export const END_AWARDS = [
  {
    id: "MOST_LOVING",
    title: "Nejlaskavější svědek",
    emoji: "❤️",
    fruitKey: "láska",
    description: "Hráč s nejvíce ovocem LÁSKA",
  },
  {
    id: "MOST_FAITHFUL",
    title: "Nejpilnější student/studentka",
    emoji: "📖",
    fruitKey: "víra",
    description: "Hráč s nejvíce ovocem VÍRA",
  },
  {
    id: "MOST_PEACEFUL",
    title: "Strážce pokoje",
    emoji: "🕊️",
    fruitKey: "pokoj",
    description: "Hráč s nejvíce ovocem POKOJ",
  },
  {
    id: "MOST_FRUITFUL",
    title: "Nejplodnější v duchu",
    emoji: "🍇",
    fruitKey: null,
    description: "Hráč s nejvyšším celkovým skóre ovoce ducha",
  },
  {
    id: "PARADISE_WINNER",
    title: "Dosáhl/a Ráje!",
    emoji: "🌿",
    fruitKey: null,
    description: "Hráč/hráči kteří se dostali do vnitřního kruhu",
  },
];

export const calculateEndAwards = (players) => {
  return END_AWARDS.map((award) => {
    let winner = null;

    if (award.id === "PARADISE_WINNER") {
      const winners = players.filter((p) => p.circle === "inner");
      return { ...award, winners: winners.map((p) => p.name) };
    }

    if (award.id === "MOST_FRUITFUL") {
      winner = getMostFruitfulPlayer(players);
    } else if (award.fruitKey) {
      winner = getMostOfFruit(players, award.fruitKey);
    }

    return {
      ...award,
      winner: winner?.name || null,
      score: winner
        ? award.fruitKey
          ? (winner.fruitScore || {})[award.fruitKey] || 0
          : getTotalFruitScore(winner.fruitScore || {})
        : 0,
    };
  });
};
