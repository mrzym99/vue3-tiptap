import type { Editor } from "@tiptap/core";

import type { AiToolResult } from "../types";

/** Escape user/model-provided plain text for safe embedding in HTML. */
export const escHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Runs a write and reports failure when the document schema silently rejected
 * the content (HTML unchanged) — insert failures used to surface as ok:true.
 */
export function verifiedWrite(editor: Editor, write: () => void, okMessage: string): AiToolResult {
  const before = editor.getHTML();
  write();
  if (editor.getHTML() === before) {
    return {
      ok: false,
      message:
        "Nothing was inserted — the editor rejected the change. Common causes: content invalid for the document schema, or a character-count limit blocking transactions that would exceed it.",
    };
  }
  return { ok: true, message: okMessage };
}
