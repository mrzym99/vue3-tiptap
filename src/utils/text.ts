import type { Editor } from "@tiptap/core";

/** Trim over-limit content once on editor-creation; cuts at the exact position of the limit-th character. */
export function checkLimit(editor: Editor, limit: number): boolean {
  if (!limit) return false;

  // Fast path: reuse the incremental CharacterCount storage
  const current = editor.storage.characterCount?.characters?.() ?? editor.getText({ blockSeparator: "" }).length;
  if (current <= limit) return false;

  const doc = editor.state.doc;
  let textLength = 0;
  let cutPos: number | null = null;

  doc.descendants((node, pos) => {
    // Stop walking once the cut position is found
    if (cutPos !== null) return false;

    if (node.isText) {
      const len = (node.text ?? "").length;
      if (textLength + len > limit) {
        cutPos = pos + (limit - textLength);
        return false;
      }
      textLength += len;
    }
    return true;
  });

  if (cutPos !== null && cutPos < doc.content.size) {
    editor.commands.deleteRange({ from: cutPos, to: doc.content.size });
    return true;
  }
  return false;
}
