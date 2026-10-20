import type { App, Plugin } from "vue";

import TipTapEditor from "./components/index.vue";

import { applyTheme } from "./theme";

export * from "./types";
export type { ImageUploader } from "./types";
export type { LocaleName, LocaleT, LocaleMessages, LocaleTranslations, LocaleContext } from "./locales";

/** Every built-in extension (hand-pick via `extensions`), plus the `StarterKit` bundle. */
export * from "./components/extensions";

export { TipTapEditor, applyTheme };

/**
 * Reusable UI primitives (the editor's own building blocks) so hosts building
 * custom UI on top of the editor keep a consistent look. All styles ship in
 * `style.css`. Components that accept a `t` translation fn make it optional —
 * standalone use falls back to identity (raw keys shown).
 */
export { default as Dialog } from "./components/ui-common/dialog/index.vue";
export type { DialogProps } from "./components/ui-common/dialog/props";
export { default as Popover } from "./components/ui-common/popover/index.vue";
export type { PopoverProps } from "./components/ui-common/popover/props";
export { default as Tooltip } from "./components/ui-common/tooltip/index.vue";
export { default as Button } from "./components/ui-common/button/index.vue";
export { default as ActionButton } from "./components/ui-common/action-button/index.vue";
export type { ActionButtonProps } from "./components/ui-common/action-button/props";
export { default as ActionMenuButton } from "./components/ui-common/action-menu-button/index.vue";
export type { ActionButtonMenuProps } from "./components/ui-common/action-menu-button/props";
export type { ActionMenuButtonItem } from "./components/ui-common/action-menu-button/type";
export { default as ActionDialogButton } from "./components/ui-common/action-dialog-button/index.vue";
export { default as Form } from "./components/ui-common/form/index.vue";
export { default as FormItem } from "./components/ui-common/form-item/index.vue";
export type { FormItemProps } from "./components/ui-common/form-item/props";
export { default as Input } from "./components/ui-common/input/index.vue";
export { default as Tabs } from "./components/ui-common/tabs/index.vue";
export { default as ThemeProvider } from "./components/ui-common/theme-provider/index.vue";

// AI tool kit: headless toolkit + OpenAI-compatible agent + chat panel
export { createAiToolkit } from "./ai/toolkit";
export { createEditorAgent } from "./ai/agent";
export { buildSystemPrompt } from "./ai/prompt";
export { default as AiPanel } from "./ai/components/ai-panel/index.vue";

/** Vue plugin: `app.use(TipTapEditorPlugin)` registers the `<TipTapEditor>` component. */
const TipTapEditorPlugin: Plugin = {
  install(app: App) {
    app.component("TipTapEditor", TipTapEditor);
  },
};

export default TipTapEditorPlugin;
