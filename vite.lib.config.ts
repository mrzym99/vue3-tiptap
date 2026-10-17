import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import dts from "unplugin-dts/vite";
import { resolve } from "node:path";

// Library build: produces dist/index.js (ESM), dist/index.cjs (CJS),
// dist/index.d.ts (types, bundled into one file by vite-plugin-dts)
// and dist/style.css.
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ imports: ["vue"], dts: false }),
    Icons({ compiler: "vue3" }),
    // dts: bundleTypes uses @microsoft/api-extractor to emit ONE dist/index.d.ts
    // instead of per-file declarations (the v3/v4 option was `rollupTypes`).
    dts({ tsconfigPath: "./tsconfig.lib.json", bundleTypes: true, outDir: "dist" }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    copyPublicDir: false, // keep favicon.svg (demo asset) out of dist
    cssCodeSplit: false,
    emptyOutDir: false, // types (dist/index.d.ts) are emitted by vite-plugin-dts
    rollupOptions: {
      external: ["vue", /^@tiptap\//],
      output: {
        exports: "named",
        // inline all CSS variables/component styles into one style.css
        assetFileNames: "style.[ext]",
      },
    },
  },
});
