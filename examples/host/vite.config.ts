import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // The lib is a workspace package symlinked to the repo root: skip prebundling
  // so `pnpm dev` always serves the freshly built dist without cache wipes.
  optimizeDeps: { exclude: ["@yumine9/vue3-tiptap"] },
});
