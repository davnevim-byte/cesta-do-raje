// ============================================================
//  AvatarPicker — výběr avatara kliknutím
//  Zobrazí galerii 12 avatarů, vybraný se zvýrazní
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AVATAR_CONFIGS, getAvatarComponent } from "../board/AvatarSVG";

const AvatarPicker = ({ value, onChange, playerName }) => {
  const [open, setOpen] = useState(false);

  const current = AVATAR_CONFIGS.find((a) => a.id === value) ?? AVATAR_CONFIGS[0];
  const CurrentComp = getAvatarComponent(current.id);

  return (
    <div style={{ position: "relative" }}>
      {/* Tlačítko — aktuální avatar */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background:   "transparent",
          border:       `2px solid ${open ? current.color : "rgba(255,255,255,0.15)"}`,
          borderRadius: "50%",
          padding:      2,
          cursor:       "pointer",
          display:      "block",
          transition:   "border-color 0.2s",
          position:     "relative",
        }}
        title={`Zmen avatar — aktualne: ${current.name}`}
      >
        <CurrentComp size={52} />
        {/* Malá tužka ikonka */}
        <div style={{
          position:       "absolute",
          bottom:         -2, right: -2,
          width:          18, height: 18,
          borderRadius:   "50%",
          background:     current.color,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       10,
          border:         "1.5px solid #060810",
        }}>
          ✎
        </div>
      </motion.button>

      {/* Galerie avatarů */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              position:       "absolute",
              top:            "calc(100% + 10px)",
              left:           "50%",
              transform:      "translateX(-50%)",
              zIndex:         200,
              background:     "rgba(6,8,16,0.97)",
              border:         "1px solid rgba(255,255,255,0.1)",
              borderRadius:   14,
              padding:        12,
              width:          240,
              backdropFilter: "blur(16px)",
              boxShadow:      "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{
              fontSize: 10, color: "#555", marginBottom: 10,
              fontWeight: 600, letterSpacing: 0.5, textAlign: "center",
            }}>
              VYBER AVATARA PRO {playerName?.toUpperCase() || "HRÁČE"}
            </div>

            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap:                 6,
            }}>
              {AVATAR_CONFIGS.map((cfg) => {
                const Comp     = getAvatarComponent(cfg.id);
                const selected = cfg.id === value;
                return (
                  <motion.button
                    key={cfg.id}
                    onClick={() => { onChange(cfg.id); setOpen(false); }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.93 }}
                    style={{
                      background:    selected
                        ? `${cfg.color}28`
                        : "rgba(255,255,255,0.03)",
                      border:        `2px solid ${selected ? cfg.color : "rgba(255,255,255,0.06)"}`,
                      borderRadius:  10,
                      padding:       "6px 4px 4px",
                      cursor:        "pointer",
                      display:       "flex",
                      flexDirection: "column",
                      alignItems:    "center",
                      gap:           3,
                      boxShadow:     selected ? `0 0 12px ${cfg.color}44` : "none",
                      transition:    "all 0.2s",
                    }}
                    title={cfg.name}
                  >
                    {/* Avatar s pulzující září pokud vybrán */}
                    <div style={{ position: "relative" }}>
                      <Comp size={50} />
                      {selected && (
                        <div style={{
                          position: "absolute", inset: -3,
                          borderRadius: "50%",
                          border: `2px solid ${cfg.color}`,
                          animation: "pulse 1.5s infinite",
                          opacity: 0.6,
                        }} />
                      )}
                    </div>
                    <span style={{
                      fontSize:   8,
                      color:      selected ? cfg.color : "#555",
                      fontWeight: selected ? 700 : 400,
                      letterSpacing: 0.2,
                    }}>
                      {cfg.name}
                    </span>
                    {selected && (
                      <div style={{
                        width: 5, height: 5,
                        borderRadius: "50%",
                        background: cfg.color,
                      }} />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Zavřít */}
            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop:    10,
                width:        "100%",
                padding:      "7px",
                background:   "transparent",
                border:       "1px solid #222",
                borderRadius: 8,
                color:        "#555",
                fontSize:     12,
                cursor:       "pointer",
                fontFamily:   "inherit",
              }}
            >
              Zavřít
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvatarPicker;
