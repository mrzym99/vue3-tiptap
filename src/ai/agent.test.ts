import { afterEach, describe, expect, it, vi } from "vitest";

import { createEditorAgent } from "./agent";
import { createSseParser } from "./sse";
import type { Editor } from "@tiptap/core";
import type { AgentEvent, AgentConfig } from "./types";

/** One SSE frame carrying a single choice delta. */
const sseFrame = (delta: unknown) => `data: ${JSON.stringify({ choices: [{ delta }] })}\n\n`;

/** A 200 Response whose body streams the given string chunks verbatim. */
function sseResponse(chunks: string[]): Response {
  const encoder = new TextEncoder();
  let i = 0;
  const stream = new ReadableStream({
    pull(controller) {
      if (i < chunks.length) controller.enqueue(encoder.encode(chunks[i++]));
      else controller.close();
    },
  });
  return new Response(stream, { status: 200 });
}

/** Minimal editor stub — only what createAiToolkit touches. */
function fakeEditor(html = "<p>doc</p>") {
  let docHtml = html;
  return {
    isEditable: true,
    chain: () => {
      const stub = new Proxy({} as Record<string, unknown>, {
        get(_target, prop) {
          if (prop === "run") return () => true;
          if (prop === "insertContent") {
            return (content: string) => {
              docHtml += content;
              return stub;
            };
          }
          return () => stub;
        },
      });
      return stub;
    },
    getHTML: () => docHtml,
    state: { doc: { descendants: () => undefined } },
    extensionManager: { extensions: [] },
  } as unknown as Editor;
}

function makeAgent(editor: Editor, overrides: Partial<AgentConfig> = {}) {
  const events: AgentEvent[] = [];
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const agent = createEditorAgent(editor, {
    baseURL: "https://api.example.com/v1",
    apiKey: "key",
    model: "test-model",
    onEvent: (event) => events.push(event),
    ...overrides,
  });
  return { agent, events, fetchMock };
}

const toolCallChunks = (calls: { name: string; args: string }[]) =>
  sseFrame({
    tool_calls: calls.map((call, index) => ({
      index,
      id: `call_${index}`,
      function: { name: call.name, arguments: call.args },
    })),
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createSseParser", () => {
  it("reassembles frames split across network chunks", () => {
    const deltas: unknown[] = [];
    const parser = createSseParser((delta) => deltas.push(delta));
    const frame = sseFrame({ content: "hi" });
    parser.push(frame.slice(0, 10));
    parser.push(frame.slice(10));
    parser.push(sseFrame({ content: "!" }));
    parser.end();
    expect(deltas).toEqual([{ content: "hi" }, { content: "!" }]);
  });

  it("ignores [DONE], comments and malformed JSON instead of throwing", () => {
    const deltas: unknown[] = [];
    const parser = createSseParser((delta) => deltas.push(delta));
    parser.push(`: keep-alive\n\ndata: [DONE]\n\ndata: not-json\n\ndata: {"choices":[]}\n\n${sseFrame({ content: "ok" })}`);
    parser.end();
    expect(deltas).toEqual([{ content: "ok" }]);
  });

  it("flushes a trailing frame without its blank line on end()", () => {
    const deltas: unknown[] = [];
    const parser = createSseParser((delta) => deltas.push(delta));
    parser.push('data: {"choices":[{"delta":{"content":"tail"}}]}');
    parser.end();
    expect(deltas).toEqual([{ content: "tail" }]);
  });
});

describe("createEditorAgent", () => {
  it("streams reasoning/content deltas and finishes with the assistant reply", async () => {
    const { agent, events, fetchMock } = makeAgent(fakeEditor());
    fetchMock.mockResolvedValue(
      sseResponse([sseFrame({ reasoning_content: "think" }), sseFrame({ content: "Hel" }), sseFrame({ content: "lo" }), "data: [DONE]\n\n"]),
    );

    await agent.send("hi");

    expect(events.map((event) => event.type)).toEqual(["reasoning_delta", "content_delta", "content_delta", "assistant_text"]);
    expect((events.at(-1) as { text: string }).text).toBe("Hello");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("stitches tool_call chunks split inside one frame, runs the tool, then replies", async () => {
    const { agent, events, fetchMock } = makeAgent(fakeEditor());
    // one SSE frame, deliberately split mid-JSON across two network chunks
    const frame = sseFrame({
      tool_calls: [{ index: 0, id: "call_0", function: { name: "insert_content", arguments: '{"html":"<p>hi</p>"}' } }],
    });
    fetchMock.mockResolvedValueOnce(sseResponse([frame.slice(0, 40), frame.slice(40)]));
    fetchMock.mockResolvedValueOnce(sseResponse([sseFrame({ content: "done" })]));

    await agent.send("insert hi");

    const types = events.map((event) => event.type);
    expect(types).toContain("tool_call");
    expect(types).toContain("tool_result");
    expect(events.at(-1)).toMatchObject({ type: "assistant_text", text: "done" });
    // the tool actually wrote to the stub document
    expect((fetchMock.mock.instances as unknown[]).length).toBe(2);
  });

  it("aborts silently: no error event, and a new send works afterwards", async () => {
    const { agent, events, fetchMock } = makeAgent(fakeEditor());
    fetchMock.mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        }),
    );

    const first = agent.send("hi");
    agent.abort();
    await first;
    expect(events.filter((event) => event.type === "error")).toEqual([]);

    fetchMock.mockResolvedValueOnce(sseResponse([sseFrame({ content: "ok" })]));
    await agent.send("again");
    expect(events.at(-1)).toMatchObject({ type: "assistant_text", text: "ok" });
  });

  it("stops with an error event after maxRounds tool rounds", async () => {
    const { agent, events, fetchMock } = makeAgent(fakeEditor(), { maxRounds: 2 });
    // fresh Response per call — a reused one would fail with "ReadableStream is locked"
    fetchMock.mockImplementation(() => sseResponse([toolCallChunks([{ name: "insert_content", args: '{"html":"<p>x</p>"}' }])]));

    await agent.send("loop forever");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(events.at(-1)).toMatchObject({ type: "error", message: "Stopped after 2 tool rounds without a final reply." });
  });

  it("ignores a concurrent send instead of interleaving history", async () => {
    const { agent, fetchMock } = makeAgent(fakeEditor());
    let release!: (response: Response) => void;
    fetchMock.mockReturnValue(new Promise((resolve) => (release = resolve)));

    const first = agent.send("first");
    await agent.send("second");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    release(sseResponse([sseFrame({ content: "ok" })]));
    await first;
  });

  it("folds large tool results from earlier rounds before the next request", async () => {
    const bigDoc = `<p>${"x".repeat(300)}</p>`;
    const { agent, fetchMock } = makeAgent(fakeEditor(bigDoc));
    fetchMock.mockResolvedValueOnce(sseResponse([toolCallChunks([{ name: "get_document", args: "{}" }])]));
    fetchMock.mockResolvedValueOnce(sseResponse([sseFrame({ content: "done" })]));
    await agent.send("read the doc");

    fetchMock.mockResolvedValueOnce(sseResponse([sseFrame({ content: "ok" })]));
    await agent.send("again");

    const body = JSON.parse(fetchMock.mock.calls[2][1].body as string) as { messages: { role: string; content: string }[] };
    const toolMessage = body.messages.find((message) => message.role === "tool");
    expect(toolMessage?.content).toBe("[tool result omitted to save context]");
    expect(JSON.stringify(body.messages)).not.toContain(bigDoc);
  });
});
