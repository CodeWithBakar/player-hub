import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "public", // Tell Vite to use the 'public' folder as the root
  build: {
    outDir: "../dist", // Where to build for production (optional for now)
  },
  server: {
    port: 8081,
  },
});
