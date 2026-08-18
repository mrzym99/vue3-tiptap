import type { App, Plugin } from "vue";

import TipTapEditor from "./components/index.vue";
import builtinExtensions from "./components/extensions";

import { applyTheme, themeOverrides } from "./theme";

export * from "./types";
export type { LocaleName, LocaleT, LocaleContext } from "./locales";

export { TipTapEditor, builtinExtensions, applyTheme, themeOverrides };

/**
 * Install as a Vue plugin:
 *   app.use(TipTapEditorPlugin, { /* options *​/ })
 */
const TipTapEditorPlugin: Plugin = {
  install(app: App) {
    app.component("TipTapEditor", TipTapEditor);
  },
};

export default TipTapEditorPlugin;
