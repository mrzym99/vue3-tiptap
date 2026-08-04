import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { resolve } from "node:path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      dts: "auto-imports.d.ts",
      eslintrc: {
        enabled: true, // generate .eslintrc-auto-import.json
      },
    }),
    VueI18nPlugin({
      include: resolve(__dirname, "./src/locales/**"),
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
