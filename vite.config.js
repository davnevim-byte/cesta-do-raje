import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.VITE_BASE_URL ?? "/";

export default defineConfig({
  base,

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name:             "Cesta do Ráje",
        short_name:       "Cesta do Ráje",
        description:      "Biblická 3D desková hra",
        theme_color:      "#060810",
        background_color: "#060810",
        display:          "standalone",
        orientation:      "any",
        start_url:        base,
        lang:             "cs",
        icons: [
          { src: "icon512.png", sizes: "192x192", type: "image/png" },
          { src: "icon512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },
    }),
  ],

  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-spring/three",
    ],
  },

  build: {
    chunkSizeWarningLimit: 2500,
  },
});
