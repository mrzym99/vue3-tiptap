import type { App, Plugin } from "vue";

import TipTapEditor from "./components/index.vue";

import { applyTheme } from "./theme";

export * from "./types";
export type { ImageUploader } from "./types";
export type { LocaleName, LocaleT, LocaleMessages, LocaleTranslations, LocaleContext } from "./locales";

/**
 * Built-in extensions, exported individually so hosts can hand-pick them via
 * the `extensions` prop, plus `StarterKit` for the full bundle:
 * `extensions: [StarterKit.configure({ twitch: false, image: { upload } })]`
 */
export * from "./components/extensions";

export { TipTapEditor, applyTheme };

/**
 * Install as a Vue plugin:
 *   app.use(TipTapEditorPlugin)
 */
const TipTapEditorPlugin: Plugin = {
  install(app: App) {
    app.component("TipTapEditor", TipTapEditor);
  },
};

export default TipTapEditorPlugin;
