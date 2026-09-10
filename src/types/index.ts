import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import type { Theme, ThemeName } from "./theme";
import type { LocaleName, LocaleTranslations } from "@/locales";

export * from "./theme";
export type { ImageUploader } from "./upload";

/**
 * Represents the keys for different extensions.
 */
export type ExtensionNameKeys =
  | "undo"
  | "redo"
  | "clearFormatting"
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "color"
  | "highlight"
  | "heading"
  | "textAlign"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "indent"
  | "link"
  | "image"
  | "video"
  | "table"
  | "blockquote"
  | "horizontalRule"
  | "code"
  | "codeBlock"
  | "clear"
  | "history"
  | "fullscreen";

/**
 * Props of the `TipTapEditor` component (modelValue is handled by v-model).
 */
export interface TipTapEditorProps {
  /** Max number of characters, 0 means unlimited */
  maxLength?: number;
  /** Whether editing is disabled (read-only) */
  disabled?: boolean;
  /** Theme mode */
  theme?: ThemeName;
  /**
   * Custom CSS variables (`--tiptap-*`) layered on top of `theme`.
   * Keys are token names (see `Theme`), values are any valid CSS value,
   * e.g. `{ "--tiptap-color-bg": "#FAFAFA", "--tiptap-border-radius-md": "6px" }`.
   */
  themeOverrides?: Theme;
  /** Placeholder text shown when the document is empty */
  placeholder?: string;
  /** UI language ("zh" | "en", or a custom id provided via `translations`) */
  locale?: LocaleName | (string & {});
  /**
   * Host translations, shallow-merged over the built-in packs.
   * Override built-in wording for "zh"/"en", or add a new locale and select
   * it via `locale`, e.g.:
   * `translations: { fr: { bold: "Gras" } }`, `locale: "fr"`
   */
  translations?: LocaleTranslations;
  /**
   * Whether to focus the editor on mount. Pass `"start"` / `"end"` /
   * a document position for fine-grained control (passed through to tiptap).
   */
  autofocus?: boolean | "start" | "end" | number;
  /**
   * Toolbar button selection. Keys are extension names
   * (e.g. "bold", "heading", "textAlign", "table", "image").
   * - `string`: TinyMCE-style layout, e.g. "bold italic | underline strike"
   *   (space-separated keys, `|` groups buttons with a separator)
   * - `string[]`: render only these buttons, in this order
   * - `{ include?, exclude? }`: include filters to a subset (default: all),
   *   exclude removes specific buttons
   * - `undefined`: use the default toolbar layout
   */
  toolbar?: Toolbar;
  /** Bubble-menu selection, falls back to `toolbar` when omitted */
  bubbleMenu?: Toolbar;
  /** Floating-menu selection, falls back to `toolbar` when omitted */
  floatingMenu?: Toolbar;
  /**
   * Extra/customized extensions merged over the built-ins (by name).
   * Use this to configure extension options, e.g.:
   * `extensions: [Image.configure({ upload: myUpload })]`
   */
  extensions?: import("@tiptap/core").Extensions;
}

/**
 * Toolbar configuration.
 *
 * - `string`: TinyMCE-style — space-separated button keys, `|` divides groups
 *   (e.g. `"bold italic | underline strike"`). Unknown keys are ignored.
 * - `string[]`: render only these buttons, in this order
 * - `{ include?, exclude? }`: include filters to a subset (default: all),
 *   exclude removes specific buttons
 * - `undefined`: use {@link defaultToolbar}
 */
export type Toolbar = string | string[] | { include?: string[]; exclude?: string[] };

/**
 * Default toolbar layout, TinyMCE-style.
 * Space-separated button keys; `|` renders a group separator.
 * Keys are Tiptap extension names (e.g. "bold", "heading", "table", "image").
 */
export const defaultToolbar =
  "undo redo | clearFormatting | " +
  "bold italic strike underline | code highlight subscript superscript | " +
  "heading horizontalRule blockquote textAlign | bulletList orderedList taskList | " +
  "link codeBlock details | image video youtube audio twitch | color fontFamily | " +
  "table | findAndReplace invisibleCharacters";

/**
 * Translation function compatible with the basic vue-i18n `t` signature.
 */
export type TranslateFn = (key: string, named?: Record<string, unknown> | number, plural?: number) => string;

/**
 * Represents the general options for Tiptap extensions.
 */
export interface GeneralOptions {
  /** Button view function */
  button: ButtonView;
}

/**
 * Represents the ButtonView function.
 */
export interface ButtonView {
  (options: ButtonViewParams): ButtonViewReturn;
}

/**
 * Represents the parameters for the ButtonView function.
 */
export interface ButtonViewParams {
  /** Editor object */
  editor: Editor;
  /** Translation function */
  t: TranslateFn;
}

/**
 * Represents the return value for the ButtonView component.
 */
export interface ButtonViewReturn {
  /** Component */
  component: Component;
  /** Component props (forwarded to the button component) */
  componentProps?: Record<string, unknown>;
}
