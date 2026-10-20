import type { AiTool } from "../types";

const html = (description: string) => ({
  type: "string",
  description,
});

/** Whole-document and insertion tools. Content is always HTML (tiptap-native). */
import { verifiedWrite } from "./util";

export const contentTools: AiTool[] = [
  {
    name: "set_document",
    description: "Replace the ENTIRE document with new HTML. Destructive — undoable via Ctrl+Z.",
    danger: true,
    parameters: {
      type: "object",
      properties: { html: html("Complete HTML document content.") },
      required: ["html"],
    },
    run(args, { editor }) {
      return verifiedWrite(editor, () => editor.commands.setContent(args.html, { emitUpdate: true }), "Document replaced.");
    },
  },
  {
    name: "insert_content",
    description: "Insert HTML at the cursor (or at the end of the document).",
    parameters: {
      type: "object",
      properties: {
        html: html("HTML fragment to insert."),
        at: { type: "string", enum: ["cursor", "end"], description: "Default: cursor." },
      },
      required: ["html"],
    },
    run(args, { editor }) {
      return verifiedWrite(
        editor,
        () => editor.chain().focus(args.at === "end" ? "end" : undefined).insertContent(args.html).run(),
        "Content inserted.",
      );
    },
  },
  {
    name: "append_content",
    description: "Append HTML at the very end of the document.",
    parameters: {
      type: "object",
      properties: { html: html("HTML fragment to append.") },
      required: ["html"],
    },
    run(args, { editor }) {
      return verifiedWrite(editor, () => editor.chain().focus("end").insertContent(args.html).run(), "Content appended.");
    },
  },
];
