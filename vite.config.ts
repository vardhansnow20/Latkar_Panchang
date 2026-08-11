import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Where the built site will be served from.
  //
  // GitHub Pages serves this repo from a subpath, so every asset URL
  // has to carry that prefix. Netlify serves from the root of its own
  // domain, where the same prefix would point every image and script
  // at a directory that does not exist — the failure is silent and
  // total, which is exactly the bug that broke the images here once
  // already.
  //
  // Netlify sets NETLIFY=true during its builds, so both targets stay
  // correct without anyone having to remember to flip this. Anything
  // reading `import.meta.env.BASE_URL` (see src/lib/asset.ts) follows
  // automatically.
  base: process.env.NETLIFY ? "/" : "/kolhapur-latkar-panchang/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
