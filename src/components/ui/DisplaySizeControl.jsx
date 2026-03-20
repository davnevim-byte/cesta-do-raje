// ============================================================
//  DisplaySizeControl — plovoucí tlačítko pro nastavení
//  velikosti zobrazení s odpočtem 5s
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { useDisplaySize } from "../../hooks/useDisplaySize";

export const DisplaySizeControl = () => {
  const { size, setSize, saveSize, MIN_SIZE, MAX_SIZE } = useDisplaySize();
  const [open, setOpen]         = useState(false);
  const [draft, setDraft]       = useState(size);
  const [countdown, setCountdown] = useState(null);
  const timerRef      = useRef(null);
  const countRef      = useRef(null);
  const originalSize  = useRef(size);

  // Při otevření nastav draft na aktuální velikost
  const handleOpen = () => {
    originalSize.current = size;
    setDraft(size);
    setCountdown(null);
    setOpen(true);
  };

  // Při změně slideru — okamžitě aplikuj (jen vizuálně) + spusť odpočet
  const handleChange = useCallback((val) => {
    setDraft(val);
    setSize(val); // okamžitý náhled

    // Reset odpočtu
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);

    setCountdown(5);
    let c = 5;
    countRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(countRef.current);
      }
    }, 1000);

    // Po 5s vrátit na původní pokud nepotvrzeno
    timerRef.current = setTimeout(() => {
      setSize(originalSize.current); // vrátí zpět
      setDraft(originalSize.current);
      setCountdown(null);
      setOpen(false);
    }, 5500);
  }, [size, setSize]);

  // Potvrdit — uložit do localStorage
  const handleConfirm = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);
    saveSize(draft);
    setCountdown(null);
    setOpen(false);
  };

  // Zavřít bez uložení
  const handleCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);
    setSize(originalSize.current); // vrátit na původní
    setCountdown(null);
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countRef.current) clearInterval(countRef.current);
    };
  }, []);

  return (
    <>
      {/* Plovoucí tlačítko ⚙️ */}
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            position:     "fixed",
            bottom:       20,
            right:        20,
            zIndex:       200,
            width:        40,
            height:       40,
            borderRadius: "50%",
            background:   "rgba(15, 110, 86, 0.25)",
            border:       "1px solid rgba(29, 158, 117, 0.4)",
            color:        "#9FE1CB",
            fontSize:     18,
            cursor:       "pointer",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            transition:   "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(15, 110, 86, 0.5)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(15, 110, 86, 0.25)"}
          title="Nastavení velikosti"
        >
          ⚙️
        </button>
      )}

      {/* Modal s sliderem */}
      {open && (
        <div style={{
          position:   "fixed",
          bottom:     20,
          right:      20,
          zIndex:     200,
          background: "rgba(6, 8, 16, 0.92)",
          border:     "1px solid rgba(29, 158, 117, 0.4)",
          borderRadius: 16,
          padding:    "16px 20px",
          width:      260,
          backdropFilter: "blur(12px)",
          boxShadow:  "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          {/* Hlavička */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ color: "#9FE1CB", fontSize: 13, fontWeight: 600 }}>
              ⚙️ Velikost zobrazení
            </span>
            <button
              onClick={handleCancel}
              style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}
            >✕</button>
          </div>

          {/* Hodnota */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{draft}%</span>
          </div>

          {/* Slider */}
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            value={draft}
            onChange={e => handleChange(parseInt(e.target.value))}
            style={{
              width: "100%",
              accentColor: "#1D9E75",
              cursor: "pointer",
              marginBottom: 6,
            }}
          />

          {/* Min/Max popisky */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ color: "#555", fontSize: 10 }}>{MIN_SIZE}% (telefon)</span>
            <span style={{ color: "#555", fontSize: 10 }}>{MAX_SIZE}% (velký PC)</span>
          </div>

          {/* Tlačítko potvrdit + odpočet */}
          <button
            onClick={handleConfirm}
            style={{
              width:        "100%",
              padding:      "10px",
              background:   "#1D9E75",
              border:       "none",
              borderRadius: 10,
              color:        "#fff",
              fontSize:     13,
              fontWeight:   600,
              cursor:       "pointer",
              fontFamily:   "inherit",
            }}
          >
            {countdown !== null
              ? `Potvrdit (vrátí se za ${countdown}s)`
              : "Potvrdit"}
          </button>
        </div>
      )}
    </>
  );
};
