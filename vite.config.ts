import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import { resolve } from "node:path";

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
    Icons({
      compiler: "vue3",
      // Keep the icon at 1em so its rendered size follows the host font-size
      // on-demand icon imports resolve from ~icons/<collection>/<name>
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    // Force single copies of ProseMirror / Tiptap core — duplicated
    // prosemirror-model breaks node wrapping/splitting (Enter → new paragraph)
    dedupe: [
      "prosemirror-model",
      "prosemirror-state",
      "prosemirror-transform",
      "prosemirror-view",
      "prosemirror-keymap",
      "prosemirror-commands",
      "@tiptap/pm",
      "@tiptap/core",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        codeSplitting: {
          maxSize: 50000,
          groups: [
            {
              name: "tiptap-vendor",
              test: /node_modules\/@tiptap\//,
              priority: 20,
            },
            {
              name: "@iconify-json-vendor",
              test: /node_modules\/@iconify-json\//,
              priority: 15,
            },
            {
              name: "vendor",
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
