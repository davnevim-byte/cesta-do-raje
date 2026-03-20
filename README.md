# 🌿 Cesta do Ráje

Biblická desková hra pro svědky Jehovovy — až 10 hráčů, PWA, offline podpora.

## 🎮 Jak hrát

1. Zadej heslo pro vstup do hry
2. Nastav hráče, obtížnost a délku hry
3. Hráči střídavě hází kostkou a pohybují se po desce
4. **Vnější kruh** = svět — vyhni se negativním políčkům, hledej Dveře
5. **Dveře** = svědectví scénář — úspěch = přesun do sboru (vnitřního kruhu)
6. **Vnitřní kruh** = sbor — studium, modlitba, shromáždění
7. Cílem je dosáhnout **Ráje** (středu)

## 🚀 Spuštění

```bash
npm install
npm run dev
```

## 📦 Build + Deploy

```bash
npm run build
```

GitHub Actions automaticky nasadí na GitHub Pages při každém push do `main`.

### Nastavení GitHub Pages:
1. Jdi do Settings → Pages
2. Source: **GitHub Actions**
3. Hotovo — hra bude na `https://[username].github.io/[repo]/`

### Pokud je hra v podsložce (ne v root doméně):
Odkomentuj v `vite.config.js`:
```js
base: "/[název-repozitáře]/",
```

## 📱 PWA — Instalace

Na mobilu otevři hru v prohlížeči → "Přidat na domovskou obrazovku" → hra funguje offline jako nativní app.

## 🔑 Heslo

Výchozí heslo: `raj2025`

Změnit v: `src/store/gameStore.js` → `const PASSWORD = "..."`

## 🛠️ Technologie

- **React 18** + **Vite** — rychlý build
- **Zustand** — herní stav + persist (localStorage)
- **Framer Motion** — animace
- **vite-plugin-pwa** — PWA + offline
- **Web Audio API** — zvuky bez externích souborů

## 📁 Struktura

```
src/
├── data/           # Obsah hry (otázky, políčka, scénáře...)
├── store/          # Zustand herní stav
├── hooks/          # useGameLogic, useSound, useAnimation, useSaveGame
└── components/
    ├── board/      # GameBoard, BoardTile, PlayerToken, DiceRoller
    ├── modals/     # QuestionModal, WitnessingModal, TileModal, WildCardModal
    ├── screens/    # Login, Setup, Game, End
    └── ui/         # Scoreboard, FruitTracker, Timer
```

## 🍇 Ovoce ducha

Systém 9 ovocí ducha (Galatským 5:22–23):
láska · radost · pokoj · trpělivost · laskavost · dobrota · víra · mírnost · sebeovládání

Každý hráč dostane na konci unikátní duchovní titul.

---

*jw.org · Nový světový překlad*
