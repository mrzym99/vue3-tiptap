import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import dts from "unplugin-dts/vite";
import { resolve } from "node:path";

// Library build: two entries — dist/index.js|.cjs (editor core) and
// dist/ai.js|.cjs (AI add-on, also published as the `./ai` subpath).
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({ imports: ["vue"], dts: false }),
    Icons({ compiler: "vue3" }),
    // Per-file declarations (NOT api-extractor rollup: that only supports one entry).
    dts({ tsconfigPath: "./tsconfig.lib.json", bundleTypes: false, outDirs: "dist" }),
  ],
xx
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        ai: resolve(__dirname, "src/ai/index.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => (format === "es" ? `${entryName}.js` : `${entryName}.cjs`),
    },
    copyPublicDir: false, // keep favicon.svg (demo asset) out of dist
    cssCodeSplit: false,
    emptyOutDir: false, // types (dist/index.d.ts) are emitted by unplugin-dts
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
