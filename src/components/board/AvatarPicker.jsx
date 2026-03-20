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
        title={`Změnit avatar — aktuálně: ${current.name}`}
      >
        <CurrentComp size={44} />
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
              gap:                 8,
            }}>
              {AVATAR_CONFIGS.map((cfg) => {
                const Comp     = getAvatarComponent(cfg.id);
                const selected = cfg.id === value;
                return (
                  <motion.button
                    key={cfg.id}
                    onClick={() => { onChange(cfg.id); setOpen(false); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.93 }}
                    style={{
                      background:   selected ? `${cfg.color}22` : "transparent",
                      border:       `2px solid ${selected ? cfg.color : "transparent"}`,
                      borderRadius: 10,
                      padding:      4,
                      cursor:       "pointer",
                      display:      "flex",
                      flexDirection:"column",
                      alignItems:   "center",
                      gap:          3,
                    }}
                    title={cfg.name}
                  >
                    <Comp size={44} />
                    <span style={{
                      fontSize:  8,
                      color:     selected ? cfg.color : "#555",
                      fontWeight:selected ? 700 : 400,
                    }}>
                      {cfg.name}
                    </span>
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
