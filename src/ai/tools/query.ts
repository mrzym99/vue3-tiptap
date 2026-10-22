import { getHTMLFromFragment } from "@tiptap/core";

import type { Editor } from "@tiptap/core";
import type { AiTool, OutlineItem } from "../types";

/**
 * Top-level blocks of the document with their positions — the shared locator
 * behind `get_outline` and `toolkit.getOutline()`, consumed by replace_node / delete_node.
 */
export function collectOutline(editor: Editor): OutlineItem[] {
  const outline: OutlineItem[] = [];
  editor.state.doc.forEach((node, offset) => {
    const text = node.textContent;
    outline.push({
      type: node.type.name,
      text: text.length > 80 ? `${text.slice(0, 77)}...` : text,
      ...(node.type.name === "heading" ? { level: node.attrs.level as number } : {}),
      pos: offset,
    });
  });
  return outline;
}

/** Read-only tools — never gated by readonly/confirmDangerous. */
export const queryTools: AiTool[] = [
  {
    name: "get_document",
    description: "Get the current document content as HTML plus its character count.",
    parameters: { type: "object", properties: {} },
    run(_args, { editor }) {
      return { ok: true, message: editor.getHTML() };
    },
  },
  {
    name: "get_selection",
    description: "Get the text and HTML currently selected in the editor.",
    parameters: { type: "object", properties: {} },
    run(_args, { editor }) {
      const { from, to, empty } = editor.state.selection;
      if (empty) return { ok: true, message: "The selection is empty." };
      return {
        ok: true,
        message: JSON.stringify({
          text: editor.state.doc.textBetween(from, to, "\n"),
          html: getHTMLFromFragment(editor.state.doc.cut(from, to).content, editor.schema),
        }),
      };
    },
  },
  {
    name: "get_outline",
    description:
      "Get the document outline: EVERY top-level block (heading, paragraph, list, table…) with its type, a text preview and its document position (pos). Use pos with replace_node / delete_node to target a block.",
    parameters: { type: "object", properties: {} },
    run(_args, { editor }) {
      return { ok: true, message: JSON.stringify(collectOutline(editor)) };
    },
  },
];
