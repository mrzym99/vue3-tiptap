import type { App, Plugin } from "vue";

import TipTapEditor from "./components/index.vue";
import builtinExtensions from "./components/extensions";

import { applyTheme } from "./theme";

export * from "./types";
export type { ImageUploader } from "./types";
export type { LocaleName, LocaleT, LocaleContext } from "./locales";

/**
 * All built-in extensions, exported individually so hosts can reconfigure
 * them via the `extensions` prop, e.g.:
 * `extensions: [Mention.configure({ items }), Image.configure({ upload })]`
 * (user extensions are merged over the built-ins by extension name).
 */
export * from "./components/extensions";

export { TipTapEditor, builtinExtensions, applyTheme };

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
