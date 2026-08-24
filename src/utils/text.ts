import type { Editor } from "@tiptap/core";

/**
 * Plain text length of the editor, excluding block separators (newlines).
 *
 * This is the canonical "character count" used by both the counter UI and the
 * max-length enforcement. Do NOT use `editor.getText().length` here — `getText`
 * inserts a `\n\n` separator between blocks by default, so pressing Enter would
 * inflate the count and make the limit impossible to converge.
 *
 * @param editor editor instance
 */
export function getEditorTextLength(editor: Editor) {
  return editor.getText({ blockSeparator: "" }).length;
}

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
 * both the check here and the counter UI use {@link getEditorTextLength}.
 *
 * @param editor editor instance
 * @param maxLength max length (0 = unlimited)
 */
export function checkLimit(editor: Editor, maxLength: number) {
  if (!maxLength) return;

  // Fast path: nothing exceeds the limit (visible characters only)
  if (getEditorTextLength(editor) <= maxLength) return;

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
  }
}
