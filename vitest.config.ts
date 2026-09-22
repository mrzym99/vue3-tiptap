import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Mirror the app vite config (auto-imports of vue APIs, `@` alias, on-demand
  // `~icons/*`): extension tests import real components, which need the same
  // transform as the app build.
  plugins: [
    vue(),
    AutoImport({ imports: ["vue"] }),
    Icons({ compiler: "vue3" }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts"],
  },
});
