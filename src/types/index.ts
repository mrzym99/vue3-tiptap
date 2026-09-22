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
  /** Placeholder text shown when the document is empty */
  placeholder?: string;
  /** UI language ("zh" | "en", or a custom id provided via `translations`) */
  locale?: LocaleName | (string & {});
  /** Host translations, shallow-merged over the built-in packs */
  translations?: LocaleTranslations;
  /** Focus on mount; `"start"` / `"end"` / a position pass through to tiptap */
  autofocus?: boolean | "start" | "end" | number;
  /**
   * Toolbar button selection. Keys are extension names.
   * - `string`: TinyMCE-style layout, e.g. "bold italic | underline strike"
   * - `string[]`: render only these buttons, in this order
   * - `{ include?, exclude? }`: filter buttons
   * - `undefined`: default layout
   */
  toolbar?: Toolbar;
  /** Bubble-menu selection, falls back to `toolbar` when omitted */
  bubbleMenu?: Toolbar;
  /** Floating-menu selection, falls back to `toolbar` when omitted */
  floatingMenu?: Toolbar;
  /**
   * Extensions to load — nothing is included automatically.
   * `extensions: [StarterKit.configure({ twitch: false })]` or hand-pick
   * `[Bold, Italic, Mention.configure({ items })]`. Later entries win on
   * name conflicts.
   */
  extensions?: import("@tiptap/core").Extensions;
}

/**
 * Toolbar configuration: a TinyMCE-style string, an ordered key list,
 * `{ include?, exclude? }` filters, or undefined for {@link defaultToolbar}.
 */
export type Toolbar = string | string[] | { include?: string[]; exclude?: string[] };

/** Default toolbar layout, TinyMCE-style; keys are Tiptap extension names. */
export const defaultToolbar =
  "undo redo | clearFormatting | " +
  "bold italic strike underline | code highlight subscript superscript | " +
  "heading horizontalRule blockquote textAlign | bulletList orderedList taskList | " +
  "link codeBlock details | image video youtube audio twitch | color fontFamily fontSize | " +
  "table | findAndReplace invisibleCharacters";

/** Translation function compatible with the basic vue-i18n `t` signature. */
export type TranslateFn = (key: string, named?: Record<string, unknown> | number, plural?: number) => string;

/** General options shared by every bundled extension. */
export interface GeneralOptions {
  /** Toolbar button view */
  button: ButtonView;
  /**
   * Floating toolbar owned by the extension while the caret is inside its
   * content. Set to `false` to disable.
   */
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
