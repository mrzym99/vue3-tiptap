import type { Editor } from "@tiptap/vue-3";

/**
 * check limit
 */
export function checkLimit(editor: Editor, maxLength: number) {
  const textLength = editor.getText().length;
  if (maxLength && textLength > maxLength) {
    editor.commands.deleteRange({
      from: maxLength + 1,
      to: textLength + 1,
    });
  }
}
