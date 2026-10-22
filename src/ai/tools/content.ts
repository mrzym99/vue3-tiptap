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
  {
    name: "replace_node",
    description:
      "Rewrite ONE block node (paragraph, heading, list, table…) in place, identified by its document position from get_outline. The node is fully replaced; the rest of the document is untouched.",
    parameters: {
      type: "object",
      properties: {
        position: {
          type: "number",
          description: "Position where the node starts (the `pos` value from get_outline).",
        },
        html: html("New content for that node as HTML fragment(s)."),
      },
      required: ["position", "html"],
    },
    run(args, { editor }) {
      const node = editor.state.doc.nodeAt(args.position);
      if (!node) {
        return {
          ok: false,
          message: `No node starts at position ${args.position} — call get_outline and pass one of its pos values.`,
        };
      }
      const to = args.position + node.nodeSize;
      return verifiedWrite(
        editor,
        () => editor.chain().focus().insertContentAt({ from: args.position, to }, args.html).run(),
        `Node at position ${args.position} replaced.`,
      );
    },
  },
  {
    name: "delete_node",
    description:
      "Delete ONE block node (paragraph, heading, list, table…) identified by its document position from get_outline. The rest of the document is untouched.",
    parameters: {
      type: "object",
      properties: {
        position: {
          type: "number",
          description: "Position where the node starts (the `pos` value from get_outline).",
        },
      },
      required: ["position"],
    },
    run(args, { editor }) {
      const node = editor.state.doc.nodeAt(args.position);
      if (!node) {
        return {
          ok: false,
          message: `No node starts at position ${args.position} — call get_outline and pass one of its pos values.`,
        };
      }
      const to = args.position + node.nodeSize;
      editor.chain().focus().deleteRange({ from: args.position, to }).run();
      return { ok: true, message: `Node at position ${args.position} deleted.` };
    },
  },
];
