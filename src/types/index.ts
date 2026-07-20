import type { IconsOptions } from "@/constants";
import type { Editor, Extension } from "@tiptap/core";

export * from "./theme";

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
 * Represents the props for the ButtonView component.
 */
export interface ButtonViewReturnComponentProps {
  /** Method triggered when action is performed */
  action?: (value?: unknown) => void;
  /** Whether it is in the active state */
  isActive?: () => boolean;
  /** Button icon */
  icon?: keyof IconsOptions;
  /** Text displayed on hover */
  tooltip?: string;
  [x: string]: any;
}

/**
 * Represents the general options for Tiptap extensions.
 */
export interface GeneralOptions<T> {
  /** Button view function */
  button: ButtonView<T>;
}

/**
 * Represents the ButtonView function.
 */
export interface ButtonView<T = any> {
  (options: ButtonViewParams<T>): ButtonViewReturn | ButtonViewReturn[];
}

/**
 * Represents the parameters for the ButtonView function.
 */
export interface ButtonViewParams<T = any> {
  /** Editor object */
  editor: Editor;
  /** Extension object */
  extension: Extension<T>;
  /** Translation function */
  t: (path: string) => string;
}

/**
 * Represents the return value for the ButtonView component.
 */
export interface ButtonViewReturn {
  /** Component */
  component: unknown;
  /** Component props */
  componentProps: ButtonViewReturnComponentProps;
  /** Component slots */
  componentSlots?: ButtonViewReturnComponentSlots;
}

/**
 * Represents the slots for the ButtonView component.
 */
export interface ButtonViewReturnComponentSlots {
  /** Dialog slot */
  dialog: () => any;
  [x: string]: () => any;
}
