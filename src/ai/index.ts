/**
 * AI add-on entry (`@yumine9/vue3-tiptap/ai`): headless toolkit + OpenAI-compatible
 * agent + chat panel. Imported separately from the main entry so the editor core
 * stays AI-free.
 */
export { createAiToolkit } from "./toolkit";
export { createEditorAgent } from "./agent";
export { buildSystemPrompt } from "./prompt";
export { default as AiPanel } from "./components/ai-panel/index.vue";

export type {
  AiToolkitOptions,
  AiToolkit,
  AiTool,
  AiToolResult,
  AiToolContext,
  OutlineItem,
  AgentConfig,
  AgentEvent,
  EditorAgent,
  ChatMessage,
  ChatCompletionTool,
} from "./types";
