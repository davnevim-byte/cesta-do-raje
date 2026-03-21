// CertificateGenerator - generuje jedinecny certifikat pro kazdeho hrace
// Pouziva HTML5 Canvas API -> PNG ke stazeni
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAvatarColor } from "../board/AvatarSVG";
import { getTopFruits, getTotalFruitScore, generatePlayerTitle } from "../../data/fruitOfSpirit";

// Barvy certifikatu dle top ovoce
const CERT_THEMES = {
  laska:        { bg1: "#1a0510", bg2: "#2a0a18", accent: "#D4537E", gold: "#FAB0CC" },
  radost:       { bg1: "#1a1005", bg2: "#2a1a08", accent: "#EF9F27", gold: "#FAC775" },
  pokoj:        { bg1: "#041a10", bg2: "#082a1a", accent: "#1D9E75", gold: "#9FE1CB" },
  trpelivost:   { bg1: "#0a1a1a", bg2: "#102a2a", accent: "#5BA3A0", gold: "#A8D8D6" },
  laskavost:    { bg1: "#0a1505", bg2: "#142008", accent: "#68A830", gold: "#B4D97A" },
  dobrota:      { bg1: "#1a1505", bg2: "#2a2008", accent: "#C8A020", gold: "#E8C870" },
  vira:         { bg1: "#05101a", bg2: "#08182a", accent: "#2980b9", gold: "#85C0E8" },
  mirnost:      { bg1: "#0a0a1a", bg2: "#10102a", accent: "#7B5EA7", gold: "#C0A0E0" },
  sebeovladani: { bg1: "#1a0a05", bg2: "#2a1008", accent: "#C05820", gold: "#E8A878" },
  default:      { bg1: "#0a0a14", bg2: "#14141e", accent: "#1D9E75", gold: "#9FE1CB" },
};

// Ovoce klic -> klic temy
const FRUIT_THEME_MAP = {
  "laska": "laska", "radost": "radost", "pokoj": "pokoj",
  "trpelivost": "trpelivost", "laskavost": "laskavost", "dobrota": "dobrota",
  "vira": "vira", "mirnost": "mirnost", "sebeovladani": "sebeovladani",
};

const drawCertificate = (canvas, player, titleData, avatarColor) => {
  const ctx = canvas.getContext("2d");
  const W = 900;
  const H = 640;
  canvas.width  = W;
  canvas.height = H;

  // Zjisti temu
  const topFruit = titleData.topFruits?.[0];
  const themeKey = topFruit ? (FRUIT_THEME_MAP[topFruit.key] ?? "default") : "default";
  const theme = CERT_THEMES[themeKey] ?? CERT_THEMES.default;

  // Pozadi - gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, theme.bg1);
  grad.addColorStop(1, theme.bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Dekorativni rohove rozetky
  const drawCorner = (x, y, r) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r);
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(18, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = theme.accent + "66";
      ctx.fill();
      ctx.rotate(Math.PI / 4);
    }
    ctx.restore();
  };
  drawCorner(40, 40, 0);
  drawCorner(W - 40, 40, Math.PI / 2);
  drawCorner(40, H - 40, -Math.PI / 2);
  drawCorner(W - 40, H - 40, Math.PI);

  // Vnejsi lem
  ctx.strokeStyle = theme.accent + "88";
  ctx.lineWidth = 2;
  ctx.strokeRect(18, 18, W - 36, H - 36);

  // Vnitrni lem
  ctx.strokeStyle = theme.gold + "44";
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  // Horni ozdoba - horizontalni linka s textem
  ctx.strokeStyle = theme.accent + "66";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, 80); ctx.lineTo(W - 50, 80); ctx.stroke();

  // Nadpis - CERTIFIKAT
  ctx.font = "bold 13px serif";
  ctx.fillStyle = theme.accent;
  ctx.letterSpacing = "4px";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFIKAT OVOCE DUCHA", W / 2, 65);
  ctx.letterSpacing = "0px";

  // Barevny kruh pro avatar
  ctx.beginPath();
  ctx.arc(W / 2, 175, 52, 0, Math.PI * 2);
  ctx.fillStyle = avatarColor + "33";
  ctx.fill();
  ctx.strokeStyle = avatarColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Iniciala hrace v kruhu
  ctx.font = "bold 42px sans-serif";
  ctx.fillStyle = avatarColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(player.name.charAt(0).toUpperCase(), W / 2, 175);
  ctx.textBaseline = "alphabetic";

  // Hvezdicky okolo kruhu
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const sx = W / 2 + Math.cos(angle) * 70;
    const sy = 175 + Math.sin(angle) * 70;
    ctx.fillStyle = theme.gold + "99";
    ctx.font = "10px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("*", sx, sy);
  }
  ctx.textBaseline = "alphabetic";

  // Jmeno hrace
  ctx.font = "bold 32px serif";
  ctx.fillStyle = theme.gold;
  ctx.textAlign = "center";
  ctx.fillText(player.name, W / 2, 262);

  // Titul prefix
  ctx.font = "italic 14px serif";
  ctx.fillStyle = theme.accent;
  ctx.fillText(titleData.prefix ?? "", W / 2, 288);

  // Hlavni titul
  ctx.font = "bold 22px serif";
  ctx.fillStyle = "#fff";
  ctx.fillText(titleData.title ?? "Verny Svedek", W / 2, 322);

  // Dekorativni linka
  const lgLine = ctx.createLinearGradient(W/2 - 200, 0, W/2 + 200, 0);
  lgLine.addColorStop(0, "transparent");
  lgLine.addColorStop(0.5, theme.accent);
  lgLine.addColorStop(1, "transparent");
  ctx.strokeStyle = lgLine;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W/2 - 200, 338); ctx.lineTo(W/2 + 200, 338); ctx.stroke();

  // Ovoce ducha - ikony a skore
  const fruits = titleData.topFruits?.filter(f => f.score > 0).slice(0, 4) ?? [];
  if (fruits.length > 0) {
    const totalW = fruits.length * 110;
    const startX = W / 2 - totalW / 2 + 55;
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    fruits.forEach((f, i) => {
      const fx = startX + i * 110;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.roundRect(fx - 44, 348, 88, 66, 10);
      ctx.fill();
      ctx.fillStyle = theme.accent + "88";
      ctx.strokeStyle = theme.accent + "44";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.fillText(f.emoji, fx, 378);
      ctx.font = "bold 13px sans-serif";
      ctx.fillStyle = theme.gold;
      ctx.fillText(`${f.label}: ${f.score}x`, fx, 402);
      ctx.font = "24px serif";
    });
  }

  // Celkove skore
  const totalScore = titleData.totalScore ?? 0;
  const circleLabel = player.circle === "inner" ? "Sbor" : "Svet";
  ctx.font = "13px sans-serif";
  ctx.fillStyle = theme.accent + "cc";
  ctx.textAlign = "center";
  ctx.fillText(`Celkove skore: ${totalScore} bodu  |  Kruh: ${circleLabel}  |  Kolo: ${player.turnCount ?? 0}`, W / 2, 440);

  // Shrnuti cesty
  const summary = titleData.summary ?? "";
  if (summary) {
    ctx.font = "italic 12px serif";
    ctx.fillStyle = "#888";
    ctx.textAlign = "center";
    // Zalamovani textu
    const words = summary.split(" ");
    let line = ""; let lines = [];
    for (const w of words) {
      const test = line + w + " ";
      if (ctx.measureText(test).width > 680) { lines.push(line.trim()); line = w + " "; }
      else line = test;
    }
    lines.push(line.trim());
    lines.forEach((l, i) => ctx.fillText(l, W / 2, 466 + i * 18));
  }

  // Spodni linka
  ctx.strokeStyle = theme.accent + "66";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, H - 70); ctx.lineTo(W - 50, H - 70); ctx.stroke();

  // Spodni text
  ctx.font = "11px sans-serif";
  ctx.fillStyle = theme.accent + "99";
  ctx.textAlign = "center";
  ctx.fillText("Cesta do Raje  -  Herni certifikat", W / 2, H - 48);
  ctx.fillStyle = theme.gold + "66";
  ctx.fillText("Galatanum 5:22-23", W / 2, H - 30);
};

// Jeden certifikat
export const Certificate = ({ player }) => {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  const fruitScore  = player.fruitScore ?? {};
  const avatarColor = getAvatarColor(player.avatarId);
  const titleData   = generatePlayerTitle(player.name, fruitScore, player.position, player.circle);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawCertificate(canvasRef.current, player, titleData, avatarColor);
    setReady(true);
  }, []);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `certifikat-${player.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{
        borderRadius: 12, overflow: "hidden",
        border: `1.5px solid ${avatarColor}44`,
        width: "100%", maxWidth: 500,
        boxShadow: `0 0 24px ${avatarColor}33`,
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      {ready && (
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          style={{
            padding: "10px 24px",
            background: avatarColor,
            border: "none", borderRadius: 10,
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Stahnout certifikat PNG
        </motion.button>
      )}
    </div>
  );
};

// CertificateModal - zobrazi certifikaty vsech hracu
const CertificateModal = ({ players, onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const player = players[activeIdx];
  const avatarColor = getAvatarColor(player?.avatarId);

  if (!players.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.94)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: "16px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            width: "100%", maxWidth: 580, maxHeight: "95dvh",
            background: "#0a0a14",
            border: `1.5px solid ${avatarColor}44`,
            borderRadius: 18, overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#9FE1CB" }}>
              Certifikaty hracu
            </div>
            <button onClick={onClose} style={{
              background: "transparent", border: "1px solid #333",
              borderRadius: 8, color: "#555", fontSize: 14,
              cursor: "pointer", padding: "4px 10px", fontFamily: "inherit",
            }}>X</button>
          </div>

          {/* Taby hracu */}
          {players.length > 1 && (
            <div style={{
              display: "flex", gap: 6, padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexWrap: "wrap", flexShrink: 0,
            }}>
              {players.map((p, i) => {
                const c = getAvatarColor(p.avatarId);
                return (
                  <button key={p.id} onClick={() => setActiveIdx(i)}
                    style={{
                      padding: "6px 14px",
                      background: activeIdx === i ? c + "22" : "transparent",
                      border: `1px solid ${activeIdx === i ? c : "#333"}`,
                      borderRadius: 8, color: activeIdx === i ? c : "#555",
                      fontSize: 12, fontWeight: activeIdx === i ? 700 : 400,
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Certifikat */}
          <div style={{ padding: "20px", overflowY: "auto" }}>
            <Certificate key={player.id} player={player} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CertificateModal;
