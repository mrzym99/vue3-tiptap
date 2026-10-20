import { getHTMLFromFragment } from "@tiptap/core";

import type { AiTool } from "../types";

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
    description: "Get the heading outline (level, text, document position) of the document.",
    parameters: { type: "object", properties: {} },
    run(_args, { editor }) {
      const outline: { level: number; text: string; pos: number }[] = [];
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === "heading") {
          outline.push({ level: node.attrs.level as number, text: node.textContent, pos });
        }
      });
      return { ok: true, message: JSON.stringify(outline) };
    },
  },
];
