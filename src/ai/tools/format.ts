import type { AiTool } from "../types";

const FORMATS = {
  bold: "toggleBold",
  italic: "toggleItalic",
  underline: "toggleUnderline",
  strike: "toggleStrike",
  code: "toggleCode",
  subscript: "toggleSubscript",
  superscript: "toggleSuperscript",
} as const;

/** Selection-scoped formatting tools. */
export const formatTools: AiTool[] = [
  {
    name: "format_text",
    description:
      "Toggle inline formatting on the selection: bold, italic, underline, strike, code, subscript, superscript or highlight.",
    requires: ["bold", "italic", "underline", "strike", "code", "subscript", "superscript", "highlight"],
    parameters: {
      type: "object",
      properties: {
        format: {
          type: "string",
          enum: [...Object.keys(FORMATS), "highlight"],
        },
        /** Highlight color when format is `highlight` (any CSS color). */
        color: { type: "string", description: "Highlight color, e.g. '#FDE68A'." },
        /** false removes the format instead of applying it. Default: true. */
        toggle: { type: "boolean", description: "Default true (apply); false removes." },
      },
      required: ["format"],
    },
    run(args, { editor }) {
      const chain = editor.chain().focus();
      const command = FORMATS[args.format as keyof typeof FORMATS];
      const on = args.toggle !== false;
      if (command) {
        if (on) (chain as any)[command]().run();
        else (chain as any)[command](); // eslint-disable-line @typescript-eslint/no-unused-expressions
      } else if (args.format === "highlight") {
        if (on) chain.toggleHighlight(args.color ? { color: args.color } : undefined).run();
        else chain.unsetHighlight().run();
      } else {
        return { ok: false, message: `Unknown format: ${args.format}` };
      }
      return { ok: true, message: `Format '${args.format}' ${on ? "applied" : "removed"}.` };
    },
  },
  {
    name: "set_heading",
    description: "Turn the current block into a heading (level 1-6) or back into a paragraph (level 0).",
    requires: ["heading"],
    parameters: {
      type: "object",
      properties: { level: { type: "integer", minimum: 0, maximum: 6 } },
      required: ["level"],
    },
    run(args, { editor }) {
      const level = Number(args.level) || 0;
      const chain = editor.chain().focus();
      if (level === 0) chain.setParagraph().run();
      else chain.toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
      return { ok: true, message: level ? `Heading level ${level} set.` : "Paragraph set." };
    },
  },
  {
    name: "set_text_align",
    description: "Set text alignment of the current block(s): left, center, right or justify.",
    requires: ["textAlign"],
    parameters: {
      type: "object",
      properties: { align: { type: "string", enum: ["left", "center", "right", "justify"] } },
      required: ["align"],
    },
    run(args, { editor }) {
      editor.chain().focus().setTextAlign(args.align).run();
      return { ok: true, message: `Alignment set to ${args.align}.` };
    },
  },
  {
    name: "set_color",
    description: "Set the text color of the selection (any CSS color).",
    requires: ["textStyle", "color"],
    parameters: {
      type: "object",
      properties: { color: { type: "string" } },
      required: ["color"],
    },
    run(args, { editor }) {
      editor.chain().focus().setColor(args.color).run();
      return { ok: true, message: `Color set to ${args.color}.` };
    },
  },
  {
    name: "set_font_size",
    description: "Set the font size of the selection, e.g. '16px'.",
    requires: ["fontSize"],
    parameters: {
      type: "object",
      properties: { size: { type: "string", description: "CSS size, e.g. '18px'." } },
      required: ["size"],
    },
    run(args, { editor }) {
      editor.chain().focus().setFontSize(args.size).run();
      return { ok: true, message: `Font size set to ${args.size}.` };
    },
  },
  {
    name: "clear_formatting",
    description: "Remove all inline marks and reset the current block(s) to plain paragraphs.",
    parameters: { type: "object", properties: {} },
    run(_args, { editor }) {
      editor.chain().focus().unsetAllMarks().clearNodes().run();
      return { ok: true, message: "Formatting cleared." };
    },
  },
];
