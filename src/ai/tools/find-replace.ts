import type { AiTool } from "../types";

/** Find & replace across the document (uses the FindAndReplace extension commands). */
export const findReplaceTools: AiTool[] = [
  {
    name: "find_replace",
    description: "Find text in the document and replace all occurrences.",
    requires: ["findAndReplace"],
    parameters: {
      type: "object",
      properties: {
        find: { type: "string", description: "Search term." },
        replace: { type: "string", description: "Replacement text." },
        caseSensitive: { type: "boolean", description: "Default false." },
      },
      required: ["find", "replace"],
    },
    run(args, { editor }) {
      const chain = editor.chain().focus();
      chain.setSearchTerm(args.find).setReplaceTerm(args.replace);
      if (typeof args.caseSensitive === "boolean") chain.setCaseSensitive(args.caseSensitive);
      chain.replaceAll().run();
      // clear the highlight left behind
      editor.commands.setSearchTerm("");
      return { ok: true, message: `Replaced all occurrences of '${args.find}'.` };
    },
  },
];
