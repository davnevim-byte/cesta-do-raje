// ============================================================
//  DIVOKÉ KARTY — Cesta do Ráje
//  Terminologie: NWT, jw.org
//
//  Divoké karty se táhnou náhodně během hry — přidávají
//  překvapení, smích, napětí a duchovní hloubku.
//
//  Tokeny:
//    {currentPlayer}  — hráč který kartu táhne
//    {targetPlayer}   — náhodně vybraný jiný hráč
//    {allPlayers}     — všichni hráči
//
//  Typy karet:
//    "bonus"     — pozitivní efekt pro jednoho nebo všechny
//    "challenge" — výzva pro jednoho hráče
//    "group"     — zapojuje celou skupinu
//    "swap"      — výměna nebo přesun hráčů
//    "prayer"    — duchovní moment pro skupinu
//    "fun"       — lehčí zábavná karta
//    "penalty"   — nevýhoda pro jednoho hráče
//
//  Každá karta má:
//    id          — unikátní identifikátor
//    title       — název karty
//    type        — kategorie
//    emoji       — vizuální ikona
//    description — co se stane (s tokeny)
//    action      — technický efekt ve hře
//    verse       — biblický verš (volitelné)
//    atmosphere  — "light" / "dark" / "neutral"
// ============================================================

export const WILD_CARDS = [

  // ─────────────────────────────────────────────
  //  BONUS KARTY — pozitivní překvapení
  // ─────────────────────────────────────────────

  {
    id: "WC_NOVA_STRAZE",
    title: "Nová Strážní věž!",
    type: "bonus",
    emoji: "📰",
    description:
      "Přišlo nové číslo Strážní věže! Jehova žehná pilným čtenářům. {currentPlayer} hodí kostkou — tolik políček postoupí vpřed.",
    action: { type: "bonusRoll", target: "currentPlayer" },
    verse: "Izajáš 48:17 — 'Já jsem Jehova, tvůj Bůh, který tě učí tomu co ti prospívá.'",
    atmosphere: "light",
  },

  {
    id: "WC_OKRSKOVY_SJEZD",
    title: "Okrskový sjezd!",
    type: "bonus",
    emoji: "🎪",
    description:
      "Celý sbor jede na okrskový sjezd! Všichni hráči postoupí o 2 políčka vpřed — Jehova požehnal vašemu společenství.",
    action: { type: "allMoveForward", spaces: 2 },
    verse: "Žalm 133:1 — 'Jak dobré a příjemné je, když bratři bydlí v jednotě!'",
    atmosphere: "light",
  },

  {
    id: "WC_PIONYR_MESIC",
    title: "Pomocné průkopnictví!",
    type: "bonus",
    emoji: "📢",
    description:
      "{currentPlayer} se přihlásil/a na pomocné průkopnictví tento měsíc! Postup o 3 políčka vpřed a získáváš ovoce ducha: LÁSKA.",
    action: { type: "moveForward", spaces: 3, target: "currentPlayer", fruit: "láska" },
    verse: "Římanům 10:15 — 'Jak krásné jsou nohy těch kteří přinášejí dobrou zprávu!'",
    atmosphere: "light",
  },

  {
    id: "WC_JEHOVUV_DEN",
    title: "Jehovův den se blíží!",
    type: "bonus",
    emoji: "☀️",
    description:
      "Jehovův den je blíže než kdy jindy! Všichni hráči ve vnitřním kruhu postoupí o 1 políčko vpřed. Hráči v křesťanském světě — vaše cesta se urychluje!",
    action: { type: "allInnerMoveForward", spaces: 1 },
    verse: "Římanům 13:11 — 'hodina pro vás probudit se ze spánku je již blíže než když jste poprvé uvěřili.'",
    atmosphere: "light",
  },

  {
    id: "WC_BETELSKAR",
    title: "Pozvání do Betelu!",
    type: "bonus",
    emoji: "🏛️",
    description:
      "{currentPlayer} dostává pozvání na Betelskou prohlídku! Řekni ostatním: co by tě na Betelu nejvíce zajímalo? Za upřímnou odpověď postup o 2 políčka.",
    action: { type: "moveForward", spaces: 2, target: "currentPlayer", requiresAnswer: true },
    verse: "1. Mojžíšova 28:19 — Jákob pojmenoval místo Betel: 'Boží dům.'",
    atmosphere: "light",
  },

  {
    id: "WC_BIBLIA_ZPAMET",
    title: "Verš zpaměti!",
    type: "bonus",
    emoji: "✨",
    description:
      "{currentPlayer} — řekni zpaměti libovolný verš z Žalmů. Zvládneš-li to, postup o 2 políčka. Skupina hlasuje zda verš byl správně.",
    action: { type: "moveForward", spaces: 2, target: "currentPlayer", requiresAnswer: true },
    verse: "Žalm 119:11 — 'Uložil jsem tvé slovo do svého srdce.'",
    atmosphere: "light",
  },

  {
    id: "WC_STUDIUM_BIBLE",
    title: "Nové biblické studium!",
    type: "bonus",
    emoji: "📚",
    description:
      "Zájemce o Bibli souhlasil se studiem! {currentPlayer} hodí kostkou znovu — výsledek přidá k aktuální pozici jako bonus.",
    action: { type: "bonusRoll", target: "currentPlayer" },
    verse: "Jan 6:44 — 'Nikdo nemůže přijít ke mně, pokud ho nepřitáhne Otec.'",
    atmosphere: "light",
  },

  {
    id: "WC_RODINNE_STUDIUM",
    title: "Rodinné duchovní studium!",
    type: "bonus",
    emoji: "👨‍👩‍👧",
    description:
      "Celá rodina se sešla na rodinném duchovním studiu! Každý hráč řekne jeden verš o rodině. Všichni kdo odpoví postoupí o 1 políčko vpřed.",
    action: { type: "groupChallenge", reward: { type: "moveForward", spaces: 1 } },
    verse: "Efezanům 6:4 — 'vychovávejte je v kázni a v mentálním regulaci od Jehovy.'",
    atmosphere: "light",
  },

  // ─────────────────────────────────────────────
  //  CHALLENGE KARTY — výzvy pro jednoho hráče
  // ─────────────────────────────────────────────

  {
    id: "WC_SVAM_SVADEK",
    title: "Rychlé svědectví!",
    type: "challenge",
    emoji: "⏱️",
    description:
      "{currentPlayer} má 60 sekund vysvětlit {targetPlayer} (jako neznámému člověku) co je Boží království. Skupina hlasuje — jasné / nejasné.",
    action: {
      type: "timedChallenge",
      seconds: 60,
      target: "currentPlayer",
      judge: "group",
      successReward: { type: "moveForward", spaces: 2 },
      failPenalty: { type: "moveBack", spaces: 1 },
    },
    verse: "1. Petra 3:15 — 'buďte vždy připraveni dát obhajobu každému kdo se vás ptá.'",
    atmosphere: "neutral",
  },

  {
    id: "WC_TRIKY_SATAN",
    title: "Satanovy triky!",
    type: "challenge",
    emoji: "🌀",
    description:
      "Satan se snaží odradit {currentPlayer} od služby! Odpověz na tuto otázku: jaké jsou tři hlavní způsoby jak satan ovlivňuje lidi dnes? Správně = +1, špatně = -1.",
    action: {
      type: "questionChallenge",
      answer:
        "Světská média, špatná společnost, materialistické smýšlení (nebo podobné — skupina hodnotí)",
      successReward: { type: "moveForward", spaces: 1 },
      failPenalty: { type: "moveBack", spaces: 1 },
    },
    verse: "1. Petra 5:8 — 'váš protivník ďábel chodí kolem jako řvoucí lev.'",
    atmosphere: "dark",
  },

  {
    id: "WC_OTAZKA_SKUPINY",
    title: "Skupinová otázka!",
    type: "challenge",
    emoji: "❓",
    description:
      "{targetPlayer} vymyslí pro {currentPlayer} jednu biblickou otázku. Správná odpověď = {currentPlayer} postoupí o 2, špatná = nic.",
    action: {
      type: "playerQuestion",
      questioner: "targetPlayer",
      answerer: "currentPlayer",
      successReward: { type: "moveForward", spaces: 2 },
    },
    verse: "Přísloví 27:17 — 'železo ostří železo, a člověk ostří tvář svého druha.'",
    atmosphere: "neutral",
  },

  {
    id: "WC_KAZDELSKI_CAS",
    title: "Čas na kazatelskou službu!",
    type: "challenge",
    emoji: "🗓️",
    description:
      "{currentPlayer} — řekni kolik hodin jsi byl/a minulý měsíc ve službě. Za každých 5 hodin postoupíš o 1 políčko. Maximálně 3 políčka.",
    action: {
      type: "hoursChallenge",
      target: "currentPlayer",
      hoursPerSpace: 5,
      maxSpaces: 3,
    },
    verse: "Matouš 24:14 — 'tato dobrá zpráva o království bude kázána v celé obydlené zemi.'",
    atmosphere: "light",
  },

  {
    id: "WC_ZPIVEJME",
    title: "Zpívejme Jehovovi!",
    type: "fun",
    emoji: "🎵",
    description:
      "{currentPlayer} zazpívá (nebo odrecituje) část libovolné písně z Království písní. Ostatní přidají ruce. Za odvahu postup o 1 políčko.",
    action: {
      type: "performChallenge",
      target: "currentPlayer",
      successReward: { type: "moveForward", spaces: 1 },
    },
    verse: "Kolosanům 3:16 — 'zpívejte Bohu žalmy, chvalozpěvy a duchovní písně.'",
    atmosphere: "light",
  },

  {
    id: "WC_KDO_JSEM",
    title: "Kdo jsem?",
    type: "fun",
    emoji: "🎭",
    description:
      "{currentPlayer} myslí na biblickou postavu. Ostatní hráči mají 10 otázek (Ano/Ne) aby uhodli kdo to je. Uhodnou = všichni +1. Neuhodnou = {currentPlayer} +2.",
    action: {
      type: "guessGame",
      target: "currentPlayer",
      maxQuestions: 10,
      winRewardAll: { type: "moveForward", spaces: 1 },
      winRewardCurrent: { type: "moveForward", spaces: 2 },
    },
    verse: "Hebrejům 11 — galerie víry plná hrdinů na které si vzpomenout.",
    atmosphere: "light",
  },

  // ─────────────────────────────────────────────
  //  GROUP KARTY — zapojují celou skupinu
  // ─────────────────────────────────────────────

  {
    id: "WC_CHVALA_JEHOVOVI",
    title: "Chvála Jehovovi!",
    type: "group",
    emoji: "🙌",
    description:
      "Chvíle vděčnosti! Každý hráč po řadě řekne jednu věc za kterou je vděčný Jehovovi tento týden. Všichni kdo odpoví postoupí o 1 políčko.",
    action: {
      type: "groupShare",
      reward: { type: "moveForward", spaces: 1, perPlayer: true },
    },
    verse: "Žalm 107:1 — 'Vzdejte díky Jehovovi, neboť je dobrý; jeho milující laskavost trvá navždy.'",
    atmosphere: "light",
  },

  {
    id: "WC_VERSETURNAJ",
    title: "Turnaj ve verších!",
    type: "group",
    emoji: "🏆",
    description:
      "Rychlý turnaj! Každý hráč řekne jeden verš o naději nebo ráji. Kdo řekne nejvíce za 2 minuty? Vítěz postoupí o 3 políčka.",
    action: {
      type: "verseTournament",
      topic: "naděje nebo ráj",
      timeSeconds: 120,
      winnerReward: { type: "moveForward", spaces: 3 },
    },
    verse: "Žalm 37:29 — 'Spravedliví zdědí zemi a budou na ní přebývat navždy.'",
    atmosphere: "light",
  },

  {
    id: "WC_MODLITBA_SKUPINY",
    title: "Skupinová modlitba!",
    type: "prayer",
    emoji: "🙏",
    description:
      "Skupina se ztišuje. {currentPlayer} pronese krátkou modlitbu (2–3 věty) za celou skupinu a hráče. Po modlitbě všichni postoupí o 1 políčko.",
    action: {
      type: "groupPrayer",
      leader: "currentPlayer",
      reward: { type: "allMoveForward", spaces: 1 },
    },
    verse: "Matouš 18:20 — 'kde jsou dva nebo tři shromážděni v mém jménu, tam jsem já uprostřed nich.'",
    atmosphere: "light",
  },

  {
    id: "WC_OVOCE_DUCHA_HRA",
    title: "Ovoce ducha!",
    type: "group",
    emoji: "🍇",
    description:
      "Každý hráč jmenuje jedno z devíti ovocí ducha a řekne jak ho vidí v životě jiného hráče u stolu. Krásná chvíle pro celou skupinu. Pak každý postoupí o 1 políčko.",
    action: {
      type: "fruitShare",
      reward: { type: "allMoveForward", spaces: 1 },
    },
    verse: "Galatským 5:22–23 — 'ovocem ducha je láska, radost, pokoj...'",
    atmosphere: "light",
  },

  {
    id: "WC_PROROK_VZKAZ",
    title: "Prorokův vzkaz!",
    type: "group",
    emoji: "📜",
    description:
      "Jeden hráč přečte nahlas Izajáš 65:21–23 (ráj na zemi). Potom každý hráč řekne jednu věc co by v ráji chtěl dělat. Fantazie vítána! Všichni +1 políčko.",
    action: {
      type: "groupShare",
      verse: "Izajáš 65:21–23",
      reward: { type: "allMoveForward", spaces: 1 },
    },
    verse: "Izajáš 65:21 — 'budou stavět domy a bydlet v nich, budou sázet vinice a jíst jejich ovoce.'",
    atmosphere: "light",
  },

  {
    id: "WC_SVATA_TABULE",
    title: "Kdo zná Bibli nejlépe?",
    type: "group",
    emoji: "📖",
    description:
      "Rychlá kvízová otázka pro všechny! Moderátor přečte otázku obtížnosti MEDIUM. Kdo první odpoví správně, postoupí o 2 políčka.",
    action: {
      type: "firstAnswerWins",
      difficulty: "MEDIUM",
      reward: { type: "moveForward", spaces: 2 },
    },
    verse: "Přísloví 1:5 — 'moudrý člověk naslouchá a přidá k svému vzdělání.'",
    atmosphere: "neutral",
  },

  // ─────────────────────────────────────────────
  //  SWAP KARTY — výměny a přesuny
  // ─────────────────────────────────────────────

  {
    id: "WC_POMOCNA_RUKA",
    title: "Pomocná ruka!",
    type: "swap",
    emoji: "🤝",
    description:
      "{currentPlayer} projevuje laskavost! Může se rozhodnout: buď postoupí o 2 políčka sám/sama, nebo daruje 2 políčka hráči {targetPlayer} a získá ovoce ducha LASKAVOST.",
    action: {
      type: "choiceBonus",
      optionA: { type: "moveForward", spaces: 2, target: "currentPlayer" },
      optionB: {
        type: "moveForward",
        spaces: 2,
        target: "targetPlayer",
        bonusFruit: "laskavost",
        bonusTarget: "currentPlayer",
      },
    },
    verse: "Filipanům 2:4 — 'každý z vás nechť pohlíží nejen na své vlastní zájmy, ale i na zájmy druhých.'",
    atmosphere: "light",
  },

  {
    id: "WC_BRATRSKA_POMOC",
    title: "Bratrská pomoc!",
    type: "swap",
    emoji: "👐",
    description:
      "{targetPlayer} — máš možnost postoupit o 1 políčko vpřed jako dar od {currentPlayer}. Přijímáš? Pokud ano, oba získáte ovoce ducha DOBROTA.",
    action: {
      type: "giftMove",
      giver: "currentPlayer",
      receiver: "targetPlayer",
      spaces: 1,
      fruitBoth: "dobrota",
    },
    verse: "Galatským 6:10 — 'prokazujme dobro všem, ale zvláště těm kteří jsou s námi ve víře.'",
    atmosphere: "light",
  },

  {
    id: "WC_ZKOUSKA_VIRY",
    title: "Zkouška víry!",
    type: "swap",
    emoji: "⚖️",
    description:
      "{currentPlayer} — Jehova zkouší tvou víru jako Joba. Vrátíš se o 1 políčko, ale získáváš ovoce ducha TRPĚLIVOST a příští tah hodíš kostkou dvakrát.",
    action: {
      type: "faithTest",
      target: "currentPlayer",
      penalty: { type: "moveBack", spaces: 1 },
      reward: { fruit: "trpělivost", bonusRollNextTurn: true },
    },
    verse: "Jakub 1:3 — 'zkoušení vaší víry způsobuje vytrvalost.'",
    atmosphere: "neutral",
  },

  // ─────────────────────────────────────────────
  //  FUN KARTY — lehčí a zábavnější
  // ─────────────────────────────────────────────

  {
    id: "WC_ZVIRE_V_BIBLI",
    title: "Zvíře z Bible!",
    type: "fun",
    emoji: "🦁",
    description:
      "Hra pro celou skupinu! Každý hráč jmenuje jiné zvíře zmíněné v Bibli. Kdo se zasekne nebo zopakuje — vypadá. Poslední hráč postoupí o 2 políčka.",
    action: {
      type: "eliminationGame",
      topic: "zvířata z Bible",
      winnerReward: { type: "moveForward", spaces: 2 },
    },
    verse: "1. Mojžíšova 2:20 — 'Adam dal jméno všem zvířatům.'",
    atmosphere: "light",
  },

  {
    id: "WC_BIBLE_HRANI",
    title: "Biblická pantomima!",
    type: "fun",
    emoji: "🎬",
    description:
      "{currentPlayer} předvádí pantomimou biblickou scénu nebo postavu. Ostatní hádají. Uhodnou do 60 sekund = všichni +1. Neuhodnou = {currentPlayer} +2 za kreativitu.",
    action: {
      type: "pantomime",
      actor: "currentPlayer",
      timeSeconds: 60,
      successRewardAll: { type: "moveForward", spaces: 1 },
      failRewardActor: { type: "moveForward", spaces: 2 },
    },
    verse: "Žalm 150:4 — 'chvalte ho tancem a hrou na strunné nástroje.'",
    atmosphere: "light",
  },

  {
    id: "WC_ABECEDA_BIBLE",
    title: "Biblická abeceda!",
    type: "fun",
    emoji: "🔤",
    description:
      "Skupinová hra! Projdete abecedou — každý hráč řekne jméno biblické postavy na další písmeno. Zvládnete celou abecedu? Ano = všichni +2, ne = nikdo nic.",
    action: {
      type: "alphabetGame",
      topic: "biblické postavy",
      successReward: { type: "allMoveForward", spaces: 2 },
    },
    verse: "Hebrejům 11 — jen část galerie víry má desítky jmen.",
    atmosphere: "light",
  },

  {
    id: "WC_RAJ_SNENI",
    title: "Snění o ráji!",
    type: "fun",
    emoji: "🌿",
    description:
      "Relaxační chvíle! Každý hráč za 30 sekund popíše jedno konkrétní místo nebo aktivitu v ráji na které se nejvíce těší. Čím konkrétnější tím lépe! Všichni +1.",
    action: {
      type: "groupShare",
      topic: "ráj na zemi",
      reward: { type: "allMoveForward", spaces: 1 },
    },
    verse: "Zjevení 21:4 — 'a smrt již nebude, ani smutek, ani křik, ani bolest již nebude.'",
    atmosphere: "light",
  },

  // ─────────────────────────────────────────────
  //  PENALTY KARTY — drobné nevýhody
  // ─────────────────────────────────────────────

  {
    id: "WC_ROZPTYLENI",
    title: "Rozptýlení světa!",
    type: "penalty",
    emoji: "📱",
    description:
      "{currentPlayer} se nechal/a rozptýlit světem — telefon, sociální sítě... Přeskočíš příští tah. Ale dostáváš příležitost: řekni jak se chráníš před světskými rozptýleními. Řekneš? Vrátíš tah zpět.",
    action: {
      type: "penaltyWithEscape",
      penalty: { type: "skip", turns: 1 },
      escape: { type: "answerQuestion", reward: { type: "cancelPenalty" } },
    },
    verse: "1. Jana 2:15–17 — 'nemilujte svět ani věci na světě.'",
    atmosphere: "dark",
  },

  {
    id: "WC_ZAHLEDENI_DO_MINULOSTI",
    title: "Zahlédnutí do minulosti!",
    type: "penalty",
    emoji: "⏪",
    description:
      "Jako Lotova žena jsi se ohlédl/a za starým životem. {currentPlayer} se vrátí o 2 políčka. Ale pokud řekneš co tě nejvíce táhne zpět a jak to překonáváš — vrátíš se jen o 1.",
    action: {
      type: "penaltyWithReduction",
      fullPenalty: { type: "moveBack", spaces: 2 },
      reducedPenalty: { type: "moveBack", spaces: 1 },
      reductionCondition: "answerPersonalQuestion",
    },
    verse: "Lukáš 9:62 — 'nikdo kdo přiloží ruku k pluhu a dívá se zpět není způsobilý pro Boží království.'",
    atmosphere: "dark",
  },

  {
    id: "WC_UNAVENY_SLUZEBNIK",
    title: "Unavený služebník!",
    type: "penalty",
    emoji: "😴",
    description:
      "{currentPlayer} je duchovně unavený/á. Přeskočíš příští tah — čas na odpočinek a modlitbu. Ale sdílej s ostatními jeden tip jak znovu nabrat duchovní sílu. Pak tah dostáváš zpět.",
    action: {
      type: "penaltyWithEscape",
      penalty: { type: "skip", turns: 1 },
      escape: { type: "shareEncouragement", reward: { type: "cancelPenalty" } },
    },
    verse: "Izajáš 40:31 — 'ti kdo skládají naději v Jehovu obnoví svou sílu.'",
    atmosphere: "neutral",
  },

];

// ─────────────────────────────────────────────
//  POMOCNÉ FUNKCE
// ─────────────────────────────────────────────

export const getRandomWildCard = () =>
  WILD_CARDS[Math.floor(Math.random() * WILD_CARDS.length)];

export const getWildCardsByType = (type) =>
  WILD_CARDS.filter((c) => c.type === type);

// Nahradí tokeny {currentPlayer} a {targetPlayer} skutečnými jmény
export const fillWildCardNames = (card, currentPlayerName, targetPlayerName) => {
  const replace = (text) =>
    text
      .replace(/\{currentPlayer\}/g, currentPlayerName)
      .replace(/\{targetPlayer\}/g, targetPlayerName)
      .replace(/\{allPlayers\}/g, "všichni hráči");

  return {
    ...card,
    description: replace(card.description),
  };
};

// Šance na tažení divoké karty (po každém kole — nastavitelné)
export const WILD_CARD_TRIGGER_CHANCE = 0.2; // 20% šance po každém tahu

export const WILD_CARD_TYPES = {
  bonus:     { label: "Bonus",     color: "#1D9E75", bgColor: "#EAF3DE" },
  challenge: { label: "Výzva",     color: "#185FA5", bgColor: "#E6F1FB" },
  group:     { label: "Skupinová", color: "#7F77DD", bgColor: "#EEEDFE" },
  swap:      { label: "Výměna",    color: "#EF9F27", bgColor: "#FAEEDA" },
  prayer:    { label: "Modlitba",  color: "#0F6E56", bgColor: "#E1F5EE" },
  fun:       { label: "Zábava",    color: "#D4537E", bgColor: "#FBEAF0" },
  penalty:   { label: "Zkouška",   color: "#E24B4A", bgColor: "#FCEBEB" },
};
