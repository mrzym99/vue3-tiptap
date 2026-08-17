import { Focus as TiptapFocus } from "@tiptap/extension-focus";

/**
 * Highlights the currently focused block and dims the rest.
 * No toolbar button — pure behavior (see editor-content styles for .has-focus).
 */
export const Focus = TiptapFocus.configure({
  className: "has-focus",
  mode: "all",
});
