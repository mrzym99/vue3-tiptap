import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Mirror the app vite config (auto-imports of vue APIs, `@` alias): several
  // components rely on `computed`/`ref` being injected by unplugin-auto-import,
  // so component tests need the same transform.
  plugins: [vue(), AutoImport({ imports: ["vue"] })],
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