import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  // Default both `vite` and `vite build` to production env (env/.env.production).
  // The `--mode` flag in the :local/:qa/:final scripts still overrides this.
  mode: "production",
  envDir: "./env",
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
