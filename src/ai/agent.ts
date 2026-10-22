import type { AgentConfig, AgentEvent, ChatCompletionTool, ChatMessage, EditorAgent } from "./types";
import type { Editor } from "@tiptap/core";

import { createAiToolkit } from "./toolkit";
import { buildSystemPrompt } from "./prompt";
import { createSseParser } from "./sse";

interface ToolCallChunk {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

/**
 * OpenAI-compatible agent loop on top of `createAiToolkit` — native fetch, no
 * dependencies. `send()` runs LLM → tool calls → results → LLM … until a plain
 * text reply (bounded by `maxRounds`).
 */
export function createEditorAgent(editor: Editor, config: AgentConfig): EditorAgent {
  const toolkit = createAiToolkit(editor, {
    confirmDangerous: config.confirmDangerous,
  });

  const history: ChatMessage[] = [{ role: "system", content: buildSystemPrompt(toolkit.tools, config.systemPrompt) }];
  let controller: AbortController | undefined;

  /**
   * Trim token bloat before each request: fold tool results from earlier rounds
   * (a single get_document can carry the whole document HTML) and drop complete
   * rounds from the front when history exceeds maxHistoryMessages. Never splits a
   * tool_call/tool pair — cuts land on user-message boundaries.
   */
  const compactHistory = () => {
    let roundStart = history.length;
    for (let i = history.length - 1; i >= 1; i--) {
      if (history[i].role === "user") {
        roundStart = i;
        break;
      }
    }
    for (let i = 1; i < roundStart; i++) {
      if (history[i].role === "tool" && history[i].content.length > 200) {
        history[i].content = "[tool result omitted to save context]";
      }
    }
    const maxHistory = config.maxHistoryMessages ?? 60;
    while (history.length > maxHistory) {
      let prevUser = 0;
      let lastUser = 0;
      for (let i = 1; i < history.length; i++) {
        if (history[i].role === "user") {
          prevUser = lastUser;
          lastUser = i;
        }
      }
      if (prevUser <= 0) break; // fewer than two complete rounds — nothing safe to drop
      history.splice(1, prevUser - 1);
    }
  };

  // Multi-listener event stream: `config.onEvent` auto-registers (back-compat),
  // UI consumers like AiPanel subscribe via `on()`.
  const listeners: ((event: AgentEvent) => void)[] = [];
  if (config.onEvent) listeners.push(config.onEvent);
  const emit = (event: AgentEvent) => {
    for (const listener of [...listeners]) listener(event);
  };

  const chatCompletions = async (): Promise<ChatMessage> => {
    const response = await fetch(`${config.baseURL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        model: config.model,
        messages: history,
        tools: toolkit.tools.map((tool): ChatCompletionTool => ({
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          },
        })),
        tool_choice: "auto",
        // stream so the host can show the model's live thinking/content
        stream: true,
      }),
      signal: controller?.signal,
    });
    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status} ${await response.text()}`);
    }

    // Consume the SSE stream: reasoning/content deltas are emitted as they
    // arrive; tool_call chunks are stitched back together by array index.
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let content = "";
    const toolCalls: ToolCallChunk[] = [];
    const parser = createSseParser((delta) => {
      if (delta.reasoning_content) emit({ type: "reasoning_delta", text: delta.reasoning_content });
      if (delta.content) {
        content += delta.content;
        emit({ type: "content_delta", text: delta.content });
      }
      for (const piece of delta.tool_calls ?? []) {
        const index = piece.index ?? 0;
        toolCalls[index] ??= { id: "", type: "function", function: { name: "", arguments: "" } };
        if (piece.id) toolCalls[index].id = piece.id;
        if (piece.function?.name) toolCalls[index].function.name = piece.function.name;
        if (piece.function?.arguments) toolCalls[index].function.arguments += piece.function.arguments;
      }
    });
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.push(decoder.decode(value, { stream: true }));
    }
    parser.end();
    const message: ChatMessage = { role: "assistant", content };
    if (toolCalls.length) message.tool_calls = toolCalls;
    return message;
  };

  const send = async (userText: string): Promise<void> => {
    // ignore concurrent sends — a host bypassing the panel's busy state would
    // otherwise interleave two loops writing into the same history
    if (controller) return;
    controller = new AbortController();
    history.push({ role: "user", content: userText });
    try {
      const maxRounds = config.maxRounds ?? 25;
      for (let round = 0; round < maxRounds; round++) {
        compactHistory();
        const message = await chatCompletions();
        history.push(message);

        const toolCalls: ToolCallChunk[] | undefined = message.tool_calls;
        if (!toolCalls?.length) {
          if (message.content) emit({ type: "assistant_text", text: message.content });
          return;
        }
        for (const call of toolCalls) {
          let args: unknown = {};
          try {
            args = JSON.parse(call.function.arguments || "{}");
          } catch {
            // malformed JSON → execute() will fail the tool gracefully
          }
          emit({ type: "tool_call", name: call.function.name, args });
          const result = await toolkit.execute(call.function.name, args);
          emit({ type: "tool_result", name: call.function.name, result });
          history.push({ role: "tool", content: JSON.stringify(result), tool_call_id: call.id });
        }
      }
      emit({ type: "error", message: `Stopped after ${maxRounds} tool rounds without a final reply.` });
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      emit({ type: "error", message: (error as Error).message });
    } finally {
      controller = undefined;
    }
  };

  return {
    send,
    abort: () => controller?.abort(),
    history,
    on(listener) {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) listeners.splice(index, 1);
      };
    },
  };
}
