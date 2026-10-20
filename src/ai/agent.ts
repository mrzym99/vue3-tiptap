import type {
  AgentConfig,
  AgentEvent,
  ChatCompletionTool,
  ChatMessage,
  EditorAgent,
} from "./types";
import type { Editor } from "@tiptap/core";

import { createAiToolkit } from "./toolkit";
import { buildSystemPrompt } from "./prompt";

interface ToolCallChunk {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface RawDelta {
  content?: string;
  reasoning_content?: string;
  tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string } }[];
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

  const history: ChatMessage[] = [
    { role: "system", content: buildSystemPrompt(toolkit.tools, config.systemPrompt) },
  ];
  let controller: AbortController | undefined;

  const emit = (event: AgentEvent) => config.onEvent?.(event);

  const chatCompletions = async (): Promise<ChatMessage> => {
    const response = await fetch(`${config.baseURL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        model: config.model,
        messages: history,
        tools: toolkit.tools.map(
          (tool): ChatCompletionTool => ({
            type: "function",
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          }),
        ),
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
    let buffer = "";
    let content = "";
    const toolCalls: ToolCallChunk[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop()!;
      for (const chunk of chunks) {
        const line = chunk.split("\n").find((candidate) => candidate.startsWith("data:"));
        if (!line) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") continue;
        const delta = (JSON.parse(payload) as { choices?: { delta?: RawDelta }[] }).choices?.[0]?.delta;
        if (!delta) continue;
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
      }
    }
    const message: ChatMessage = { role: "assistant", content };
    if (toolCalls.length) message.tool_calls = toolCalls;
    return message;
  };

  const send = async (userText: string): Promise<void> => {
    controller = new AbortController();
    history.push({ role: "user", content: userText });
    try {
      const maxRounds = config.maxRounds ?? 10;
      for (let round = 0; round < maxRounds; round++) {
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
    }
  };

  return {
    send,
    abort: () => controller?.abort(),
    history,
  };
}
