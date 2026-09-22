import { Focus as TiptapFocus } from "@tiptap/extension-focus";

/** Highlights the focused block (no button; see the `.has-focus` styles). */
export const Focus = TiptapFocus.configure({
  className: "has-focus",
  mode: "shallowest",
});
