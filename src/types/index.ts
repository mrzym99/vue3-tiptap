import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import type { ThemeName } from "./theme";

export * from "./theme";
export type { ImageUploader } from "./upload";

/**
 * Represents the keys for different extensions.
 */
export type ExtensionNameKeys =
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
  /** Placeholder text shown when the document is empty */
  placeholder?: string;
  /** Whether to focus the editor on mount */
  autofocus?: boolean;
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
export type Toolbar =
  | string
  | string[]
  | { include?: string[]; exclude?: string[] };

/**
 * Default toolbar layout, TinyMCE-style.
 * Space-separated button keys; `|` renders a group separator.
 * Keys are Tiptap extension names (e.g. "bold", "heading", "table", "image").
 */
export const defaultToolbar =
  "bold italic strike underline | code highlight subscript superscript | " +
  "heading horizontalRule blockquote textAlign | bulletList orderedList taskList | " +
  "link codeBlock details | image video youtube audio twitch | color fontFamily | " +
  "table | findAndReplace invisibleCharacters";

/**
 * Translation function compatible with the basic vue-i18n `t` signature.
 */
export type TranslateFn = (
  key: string,
  named?: Record<string, unknown> | number,
  plural?: number,
) => string;

/**
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps {
  /** Method triggered when action is performed */
  action?: (value?: unknown) => void;
  /** Whether it is in the active state */
  isActive?: () => boolean;
  /** Button icon */
  icon?: Component;
  /** Text displayed on hover */
  tooltip?: string;
}

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
  (options: ButtonViewParams): ButtonViewReturn | ButtonViewReturn[];
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
  /** Component slots */
  componentSlots?: ButtonViewReturnComponentSlots;
}

/**
 * Represents the slots for the ButtonView component.
 */
export interface ButtonViewReturnComponentSlots {
  /** Dialog slot */
  dialog?: () => any;
  [x: string]: (() => any) | undefined;
}
