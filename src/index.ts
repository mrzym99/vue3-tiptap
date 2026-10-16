import type { App, Plugin } from "vue";

import TipTapEditor from "./components/index.vue";

import { applyTheme } from "./theme";

export * from "./types";
export type { ImageUploader } from "./types";
export type { LocaleName, LocaleT, LocaleMessages, LocaleTranslations, LocaleContext } from "./locales";

/** Every built-in extension (hand-pick via `extensions`), plus the `StarterKit` bundle. */
export * from "./components/extensions";

export { TipTapEditor, applyTheme };

/** Vue plugin: `app.use(TipTapEditorPlugin)` registers the `<TipTapEditor>` component. */
const TipTapEditorPlugin: Plugin = {
  install(app: App) {
    app.component("TipTapEditor", TipTapEditor);
  },
};

export default TipTapEditorPlugin;
