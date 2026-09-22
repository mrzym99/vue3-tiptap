import type { Editor } from "@tiptap/core";

/**
 * Trim over-limit content once on editor-creation (typing past the limit while
 * editing is handled by the official `CharacterCount.limit` plugin). Cuts at
 * the exact document position of the limit-th character — plain text length
 * can't be used as a position, since block nodes occupy extra positions.
 * Newlines don't count towards the limit, matching the characterCount storage.
 */
export function checkLimit(editor: Editor, limit: number): boolean {
  if (!limit) return false;

  // Fast path: reuse the incremental CharacterCount storage
  const current =
    editor.storage.characterCount?.characters?.() ?? editor.getText({ blockSeparator: "" }).length;
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