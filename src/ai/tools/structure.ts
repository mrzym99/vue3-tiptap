import type { AiTool } from "../types";
import { escHtml, verifiedWrite } from "./util";

/** Block-level structure tools. */
export const structureTools: AiTool[] = [
  {
    name: "insert_list",
    description: "Insert a list at the cursor: bullet, ordered or task (checkbox) list.",
    requires: ["bulletList", "orderedList", "taskList"],
    parameters: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["bullet", "ordered", "task"] },
        /** Optional list item texts; omitted → an empty list item. */
        items: { type: "array", items: { type: "string" } },
      },
      required: ["kind"],
    },
    run(args, { editor }) {
      const items: string[] = Array.isArray(args.items) && args.items.length ? args.items : [""];
      let html: string;
      if (args.kind === "task") {
        // taskItem requires data-type + data-checked attrs or the schema rejects the fragment
        html = `<ul data-type="taskList">${items
          .map((item) => `<li data-checked="false" data-type="taskItem"><p>${escHtml(item)}</p></li>`)
          .join("")}</ul>`;
      } else {
        const tag = args.kind === "ordered" ? "ol" : "ul";
        const type = args.kind === "ordered" ? "orderedList" : "bulletList";
        html = `<${tag} data-type="${type}">${items
          .map((item) => `<li><p>${escHtml(item)}</p></li>`)
          .join("")}</${tag}>`;
      }
      return verifiedWrite(
        editor,
        () => editor.chain().focus().insertContent(html).run(),
        `${args.kind} list inserted with ${items.length} item(s).`,
      );
    },
  },
  {
    name: "insert_blockquote",
    description: "Insert a blockquote with the given HTML content.",
    requires: ["blockquote"],
    parameters: {
      type: "object",
      properties: { html: { type: "string", description: "Quoted content as HTML." } },
      required: ["html"],
    },
    run(args, { editor }) {
      return verifiedWrite(editor, () => editor.chain().focus().insertContent(`<blockquote><p>${args.html}</p></blockquote>`).run(), "Blockquote inserted.");
    },
  },
  {
    name: "insert_code_block",
    description: "Insert a fenced code block, optionally with a language tag.",
    requires: ["codeBlock"],
    parameters: {
      type: "object",
      properties: {
        code: { type: "string", description: "Raw source code." },
        language: { type: "string", description: "Language tag, e.g. 'ts'." },
      },
      required: ["code"],
    },
    run(args, { editor }) {
      const cls = args.language ? ` class="language-${args.language}"` : "";
      return verifiedWrite(editor, () => editor.chain().focus().insertContent(`<pre><code${cls}>${escHtml(args.code)}</code></pre>`).run(), "Code block inserted.");
    },
  },
  {
    name: "insert_horizontal_rule",
    description: "Insert a horizontal divider.",
    requires: ["horizontalRule"],
    parameters: { type: "object", properties: {} },
    run(_args, { editor }) {
      return verifiedWrite(editor, () => editor.chain().focus().setHorizontalRule().run(), "Horizontal rule inserted.");
    },
  },
  {
    name: "insert_table",
    description: "Insert a table at the cursor.",
    requires: ["table"],
    parameters: {
      type: "object",
      properties: {
        rows: { type: "integer", minimum: 1, maximum: 20 },
        cols: { type: "integer", minimum: 1, maximum: 10 },
        withHeaderRow: { type: "boolean", description: "Default true." },
        /** Row-major cell texts; first row is the header when withHeaderRow. */
        data: { type: "array", items: { type: "array", items: { type: "string" } } },
      },
      required: ["rows", "cols"],
    },
    run(args, { editor }) {
      const withHeader = args.withHeaderRow !== false;
      const data: string[][] = Array.isArray(args.data) ? args.data : [];
      // Compact HTML only: whitespace text nodes between cells are parsed as
      // content by the table schema and blow up into empty rows/columns.
      const rowsHtml: string[] = [];
      for (let r = 0; r < args.rows; r++) {
        const cells: string[] = [];
        for (let c = 0; c < args.cols; c++) {
          const tag = r === 0 && withHeader ? "th" : "td";
          cells.push(`<${tag}><p>${escHtml(String(data[r]?.[c] ?? "").trim())}</p></${tag}>`);
        }
        rowsHtml.push(`<tr>${cells.join("")}</tr>`);
      }
      const html = `<table>${rowsHtml.join("")}</table>`;
      return verifiedWrite(editor, () => editor.chain().focus().insertContent(html).run(), "Table inserted.");
    },
  },
  {
    name: "insert_link",
    description: "Turn the current selection into a hyperlink (or insert linked text if selection is empty).",
    requires: ["link"],
    parameters: {
      type: "object",
      properties: {
        href: { type: "string" },
        text: { type: "string", description: "Link text when the selection is empty." },
      },
      required: ["href"],
    },
    run(args, { editor }) {
      const { selection } = editor.state;
      if (selection.empty && args.text) {
        return verifiedWrite(
          editor,
          () => editor.chain().focus().insertContent({ type: "text", text: args.text, marks: [{ type: "link", attrs: { href: args.href } }] }).run(),
          "Link inserted.",
        );
      }
      return verifiedWrite(editor, () => editor.chain().focus().setLink({ href: args.href }).run(), "Link inserted.");
    },
  },
  {
    name: "insert_details",
    description: "Insert a collapsible details block (summary + content).",
    requires: ["details"],
    parameters: {
      type: "object",
      properties: {
        summary: { type: "string", description: "Visible summary/title." },
        content: { type: "string", description: "Hidden content as HTML." },
      },
      required: ["summary", "content"],
    },
    run(args, { editor }) {
      return verifiedWrite(
        editor,
        () =>
          editor
            .chain()
            .focus()
            .insertContent(
              `<div data-type="details"><summary>${escHtml(args.summary)}</summary><div data-type="details-content">${args.content}</div></div>`,
            )
            .run(),
        "Details block inserted.",
      );
    },
  },
];
