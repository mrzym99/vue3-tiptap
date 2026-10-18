import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import type { ThemeName } from "./theme";
import type { LocaleName, LocaleTranslations } from "@/locales";

export * from "./theme";
export type { ImageUploader } from "./upload";

/** Props of the `TipTapEditor` component (modelValue is handled by v-model). */
export interface TipTapEditorProps {
  /** Max characters, 0 = unlimited. Read once at editor creation. */
  limit?: number;
  /** Whether editing is disabled (read-only) */
  readonly?: boolean;
  /** Theme mode */
  theme?: ThemeName;
  /** Primary accent color (any CSS color); all accent-derived UI follows it in both modes */
  primaryColor?: string;
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
  /** Wrap the toolbar buttons onto multiple rows instead of one scrollable line */
  toolbarWrap?: boolean;
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

export type { Extensions } from "@tiptap/core";

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
