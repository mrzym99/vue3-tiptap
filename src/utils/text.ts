import type { Editor } from "@tiptap/core";

/**
 * Enforce a max text length by truncating the document at the exact document
 * position of the maxLength-th character.
 *
 * Note: plain text length cannot be used as a ProseMirror position — every
 * block node occupies an extra position in the document, so positions drift as
 * soon as the content has more than one paragraph. This walks the document and
 * computes the real cut position.
 *
 * Newlines (paragraph breaks) do not count towards the limit: Enter is allowed
 * at exactly `maxLength` visible characters and the count stays put, because
 * both the fast path here and the counter UI rely on the `editor.storage`
 * `characterCount` (textSize mode, which strips block separators).
 *
 * @param editor editor instance
 * @param maxLength max length (0 = unlimited)
 * @returns whether the document was truncated
 */
export function checkLimit(editor: Editor, maxLength: number): boolean {
  if (!maxLength) return false;

  // Fast path: nothing exceeds the limit. Reuse the incremental CharacterCount
  // storage instead of rescanning the whole document on every keystroke.
  const current =
    editor.storage.characterCount?.characters?.() ?? editor.getText({ blockSeparator: "" }).length;
  if (current <= maxLength) return false;

  const doc = editor.state.doc;
  let textLength = 0;
  let cutPos: number | null = null;

  doc.descendants((node, pos) => {
    // Stop walking once the cut position is found
    if (cutPos !== null) return false;

    if (node.isText) {
      const len = (node.text ?? "").length;
      if (textLength + len > maxLength) {
        // The maxLength-th character ends at pos + (maxLength - textLength)
        cutPos = pos + (maxLength - textLength);
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