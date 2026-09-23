import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import type { Theme, ThemeName } from "./theme";
import type { LocaleName, LocaleTranslations } from "@/locales";

export * from "./theme";
export type { ImageUploader } from "./upload";

/** Props of the `TipTapEditor` component (modelValue is handled by v-model). */
export interface TipTapEditorProps {
  /** Max characters, 0 = unlimited. Read once at editor creation. */
  limit?: number;
  /** Whether editing is disabled (read-only) */
  disabled?: boolean;
  /** Theme mode */
  theme?: ThemeName;
  /** Custom CSS variables (`--tiptap-*`) layered on top of `theme` */
  themeOverrides?: Theme;
  /** Placeholder text shown when the document is empty; falls back to the locale pack's `placeholder` key */
  placeholder?: string;
  /** UI language ("zh" | "en", or a custom id provided via `translations`) */
  locale?: LocaleName | (string & {});
  /** Host translations, shallow-merged over the built-in packs */
  translations?: LocaleTranslations;
  /** Focus on mount; `"start"` / `"end"` / a position pass through to tiptap */
  autofocus?: boolean | "start" | "end" | number;
  /** Toolbar button selection; keys are extension names, `undefined` = default layout */
  toolbar?: Toolbar;
  /** Bubble-menu selection; `undefined`/`false` = disabled (does NOT fall back to `toolbar`) */
  bubbleMenu?: Toolbar | false;
  /** Floating-menu selection; `undefined`/`false` = disabled (does NOT fall back to `toolbar`) */
  floatingMenu?: Toolbar | false;
  /** Show invisible characters (spaces, hard breaks, paragraph marks); default hidden */
  showInvisibleCharacters?: boolean;
  /** Extensions to load — nothing included automatically; later entries win on name conflicts */
  extensions?: import("@tiptap/core").Extensions;
}

/** Toolbar config: a TinyMCE-style string, an ordered key list, or `{ include?, exclude? }` filters. */
export type Toolbar = string | string[] | { include?: string[]; exclude?: string[] };

/** Default toolbar layout, TinyMCE-style; keys are Tiptap extension names. */
export const defaultToolbar =
  "undo redo | clearFormatting | " +
  "bold italic strike underline | code highlight subscript superscript | " +
  "heading horizontalRule blockquote textAlign | bulletList orderedList taskList | " +
  "link codeBlock details | image video youtube audio twitch | color fontFamily fontSize | " +
  "table | findAndReplace";

/** Translation function compatible with the basic vue-i18n `t` signature. */
export type TranslateFn = (key: string, named?: Record<string, unknown> | number, plural?: number) => string;

/** General options shared by every bundled extension. */
export interface GeneralOptions {
  /** Toolbar button view */
  button: ButtonView;
  /** Extension-owned floating toolbar while the caret is inside its content; `false` disables */
  bubbleMenu?: ButtonView | false;
}

/** Button view function */
export interface ButtonView {
  (options: ButtonViewParams): ButtonViewReturn;
}

/** Parameters for {@link ButtonView} */
export interface ButtonViewParams {
  editor: Editor;
  t: TranslateFn;
}

/** Return value for {@link ButtonView} */
export interface ButtonViewReturn {
  component: Component;
  /** Props forwarded to the component */
  componentProps?: Record<string, unknown>;
}
