import type { AiToolkitOptions, AiTool, AiToolResult, AiToolkit } from "./types";
import type { Editor } from "@tiptap/core";

import { queryTools, collectOutline } from "./tools/query";
import { contentTools } from "./tools/content";
import { formatTools } from "./tools/format";
import { structureTools } from "./tools/structure";
import { mediaTools } from "./tools/media";
import { findReplaceTools } from "./tools/find-replace";

const ALL_TOOLS: AiTool[] = [
  ...queryTools,
  ...contentTools,
  ...formatTools,
  ...structureTools,
  ...mediaTools,
  ...findReplaceTools,
];

/** Tools that never mutate the document. */
const READ_ONLY_TOOLS = new Set(queryTools.map((tool) => tool.name));

function isAvailable(editor: Editor, tool: AiTool): boolean {
  if (!tool.requires?.length) return true;
  const names = new Set(editor.extensionManager.extensions.map((extension) => extension.name));
  return tool.requires.some((name) => names.has(name));
}

/**
 * Headless AI tool layer: wraps editor capabilities as JSON-Schema tools an
 * LLM can call. All writes go through normal editor transactions (undoable),
 * danger tools require `confirmDangerous`, and a readonly editor rejects writes.
 */
export function createAiToolkit(editor: Editor, options: AiToolkitOptions = {}): AiToolkit {
  const { confirmDangerous, onlyAvailable = true } = options;

  const tools = onlyAvailable ? ALL_TOOLS.filter((tool) => isAvailable(editor, tool)) : [...ALL_TOOLS];

  const execute = async (name: string, args: unknown): Promise<AiToolResult> => {
    const tool = tools.find((candidate) => candidate.name === name);
    if (!tool) return { ok: false, message: `Unknown tool: ${name}` };

    if (!READ_ONLY_TOOLS.has(name) && !editor.isEditable) {
      return { ok: false, message: "The editor is read-only." };
    }
    if (tool.danger) {
      if (!confirmDangerous) return { ok: false, message: `Tool '${name}' is dangerous and no confirmation handler is configured.` };
      const allowed = await confirmDangerous(tool, args);
      if (!allowed) return { ok: false, message: "The operation was rejected by the user." };
    }
    try {
      return await tool.run(args ?? {}, { editor });
    } catch (error) {
      return { ok: false, message: `Tool '${name}' failed: ${(error as Error).message}` };
    }
  };

  return {
    tools,
    execute,
    getContent: () => editor.getHTML(),
    getOutline: () => collectOutline(editor),
  };
}
