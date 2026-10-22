import type { Editor } from "@tiptap/core";

/** Result of a single AI tool execution. */
export interface AiToolResult {
  ok: boolean;
  message?: string;
}

/** Execution context handed to every tool. */
export interface AiToolContext {
  editor: Editor;
}

/** One editor capability exposed to an LLM (JSON-Schema params + executor). */
export interface AiTool {
  name: string;
  /** English description shown to the LLM. */
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  /** Destructive operation — runs only after `confirmDangerous` accepts it. */
  danger?: boolean;
  /** Extension names that must be registered for this tool to exist. */
  requires?: string[];
  run(args: any, ctx: AiToolContext): Promise<AiToolResult> | AiToolResult;
}

/** Top-level block entry returned by `getOutline` (headings, paragraphs, lists, tables…). */
export interface OutlineItem {
  /** Block node type name, e.g. "heading", "paragraph", "table". */
  type: string;
  /** Node text content, truncated to a preview. */
  text: string;
  /** Heading level — only present for "heading" nodes. */
  level?: number;
  /** Document position, usable with replace_node / delete_node. */
  pos: number;
}

export interface AiToolkitOptions {
  /**
   * Confirmation gate for `danger` tools; returning false skips execution.
   * Not provided → danger tools are rejected (fail-safe).
   */
  confirmDangerous?: (tool: AiTool, args: unknown) => Promise<boolean> | boolean;
  /** Only register tools whose extensions are actually enabled. Default true. */
  onlyAvailable?: boolean;
}

export interface AiToolkit {
  tools: AiTool[];
  execute(name: string, args: unknown): Promise<AiToolResult>;
  /** Current document HTML (context for the LLM). */
  getContent(): string;
  getOutline(): OutlineItem[];
}

/** One chat message in the agent's history. */
export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
  tool_call_id?: string;
}

/** OpenAI-compatible tool definition sent to the endpoint. */
export interface ChatCompletionTool {
  type: "function";
  function: { name: string; description: string; parameters: unknown };
}

export type AgentEvent =
  | { type: "tool_call"; name: string; args: unknown }
  | { type: "tool_result"; name: string; result: AiToolResult }
  | { type: "reasoning_delta"; text: string }
  | { type: "content_delta"; text: string }
  | { type: "assistant_text"; text: string }
  | { type: "error"; message: string };

export interface AgentConfig {
  /** OpenAI-compatible endpoint base, e.g. `https://api.openai.com/v1`. */
  baseURL: string;
  apiKey: string;
  model: string;
  /** Appended after the built-in system prompt. */
  systemPrompt?: string;
  confirmDangerous?: AiToolkitOptions["confirmDangerous"];
  /** Max tool-call round trips per `send()` (runaway guard). Default 10. */
  maxRounds?: number;
  onEvent?: (event: AgentEvent) => void;
}

export interface EditorAgent {
  /** One full turn: LLM → tool calls → results back → LLM … until plain text. */
  send(userText: string): Promise<void>;
  abort(): void;
  history: ChatMessage[];
  /**
   * Subscribe to the agent event stream (multiple listeners allowed); returns an
   * unsubscribe fn. Custom agent implementations must implement this so UI
   * consumers (e.g. AiPanel) can observe events alongside the host's own.
   */
  on(listener: (event: AgentEvent) => void): () => void;
}
