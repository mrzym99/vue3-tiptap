import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // LLM APIs don't send CORS headers — proxy the demo through the dev server
  // (same /ai-proxy target as the root vite.config.ts).
  server: {
    proxy: {
      "/ai-proxy": {
        target: "https://ark.cn-beijing.volces.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-proxy/, "/api/coding/v3"),
      },
    },
  },
  // The lib is a workspace package symlinked to the repo root: skip prebundling
  // so `pnpm dev` always serves the freshly built dist without cache wipes.
  optimizeDeps: { exclude: ["@yumine9/vue3-tiptap"] },
});
