import { describe, expect, it, vi } from "vitest";

import { createEditorAgent } from "./agent";
import { createAiToolkit } from "./toolkit";
import type { Editor } from "@tiptap/core";
import type { AgentEvent } from "./types";

/** Minimal editor stub: only what the toolkit touches. */
function fakeEditor(options: { extensions?: string[]; editable?: boolean; selectionEmpty?: boolean } = {}) {
  // mutable doc HTML — verifiedWrite compares getHTML() before/after a write
  let docHtml = "<p>doc</p>";
  const setContent = vi.fn((html: string) => {
    docHtml = html;
  });
  const chain = () => {
    const stub = new Proxy({} as Record<string, unknown>, {
      get(_target, prop) {
        if (prop === "run") return () => true;
        if (prop === "insertContent") {
          return (content: string | object) => {
            docHtml += typeof content === "string" ? content : JSON.stringify(content);
            return stub;
          };
        }
        return () => stub;
      },
    });
    return stub;
  };
  return {
    isEditable: options.editable ?? true,
    setContent,
    commands: { setContent },
    chain,
    getHTML: vi.fn(() => docHtml),
    state: { doc: { descendants: () => undefined }, selection: { empty: options.selectionEmpty ?? false } },
    extensionManager: {
      extensions: (options.extensions ?? []).map((name) => ({ name })),
    },
  } as unknown as Editor & { setContent: ReturnType<typeof vi.fn> };
}

describe("createAiToolkit", () => {
  it("rejects unknown tools", async () => {
    const toolkit = createAiToolkit(fakeEditor());
    await expect(toolkit.execute("nope", {})).resolves.toMatchObject({ ok: false });
  });

  it("rejects writes on a read-only editor but allows reads", async () => {
    const editor = fakeEditor({ editable: false });
    const toolkit = createAiToolkit(editor);
    await expect(toolkit.execute("set_document", { html: "<p>x</p>" })).resolves.toMatchObject({ ok: false });
    await expect(toolkit.execute("get_document", {})).resolves.toMatchObject({ ok: true });
  });

  it("gates danger tools behind confirmDangerous (fail-safe without one)", async () => {
    const editor = fakeEditor();
    const toolkit = createAiToolkit(editor);
    await expect(toolkit.execute("set_document", { html: "<p>x</p>" })).resolves.toMatchObject({ ok: false });
    expect(editor.setContent).not.toHaveBeenCalled();

    const allowed = createAiToolkit(editor, { confirmDangerous: () => true });
    await expect(allowed.execute("set_document", { html: "<p>x</p>" })).resolves.toMatchObject({ ok: true });
    expect(editor.setContent).toHaveBeenCalledWith("<p>x</p>", { emitUpdate: true });

    const denied = createAiToolkit(editor, { confirmDangerous: () => false });
    await expect(denied.execute("set_document", { html: "<p>x</p>" })).resolves.toMatchObject({ ok: false });
  });

  it("filters unavailable tools when onlyAvailable (default)", async () => {
    const editor = fakeEditor({ extensions: ["document", "paragraph", "text"] });
    const toolkit = createAiToolkit(editor);
    expect(toolkit.tools.map((tool) => tool.name)).not.toContain("insert_table");
    expect(toolkit.tools.map((tool) => tool.name)).toContain("set_document");

    const all = createAiToolkit(editor, { onlyAvailable: false });
    expect(all.tools.map((tool) => tool.name)).toContain("insert_table");
  });

  it("replace_node rewrites the node at the given position", async () => {
    let docHtml = "<p>old</p>";
    let inserted: unknown;
    const editor = {
      isEditable: true,
      chain: () => {
        const stub: Record<string, unknown> = new Proxy({} as Record<string, unknown>, {
          get(_target, prop) {
            if (prop === "run") return () => {
              docHtml = "<p>new</p>";
              return true;
            };
            if (prop === "insertContentAt") {
              return (range: unknown, html: string) => {
                inserted = [range, html];
                return stub;
              };
            }
            return () => stub;
          },
        });
        return stub;
      },
      getHTML: () => docHtml,
      state: { doc: { nodeAt: (pos: number) => (pos === 0 ? { nodeSize: 7 } : null) } },
      commands: {},
      extensionManager: { extensions: [{ name: "document" }, { name: "paragraph" }, { name: "text" }] },
    } as unknown as Editor;
    const toolkit = createAiToolkit(editor);

    // position with no node start → guided error, no write
    await expect(toolkit.execute("replace_node", { position: 3, html: "<p>x</p>" })).resolves.toMatchObject({
      ok: false,
    });

    await expect(toolkit.execute("replace_node", { position: 0, html: "<p>new</p>" })).resolves.toMatchObject({
      ok: true,
    });
    expect(inserted).toEqual([{ from: 0, to: 7 }, "<p>new</p>"]);
  });

  it("delete_node removes the node at the given position", async () => {
    let deleted: unknown;
    let docHtml = "<p>doc</p>";
    const editor = {
      isEditable: true,
      chain: () => {
        const stub: Record<string, unknown> = new Proxy({} as Record<string, unknown>, {
          get(_target, prop) {
            if (prop === "run") return () => true;
            if (prop === "deleteRange") {
              return (range: unknown) => {
                deleted = range;
                docHtml = ""; // verifiedWrite compares HTML before/after
                return stub;
              };
            }
            return () => stub;
          },
        });
        return stub;
      },
      getHTML: () => docHtml,
      state: { doc: { nodeAt: (pos: number) => (pos === 0 ? { nodeSize: 7 } : null) } },
      commands: {},
      extensionManager: { extensions: [{ name: "document" }, { name: "paragraph" }, { name: "text" }] },
    } as unknown as Editor;
    const toolkit = createAiToolkit(editor);

    await expect(toolkit.execute("delete_node", { position: 3 })).resolves.toMatchObject({ ok: false });
    await expect(toolkit.execute("delete_node", { position: 0 })).resolves.toMatchObject({ ok: true });
    expect(deleted).toEqual({ from: 0, to: 7 });
  });

  it("insert_code_block escapes HTML inside the code", async () => {
    const editor = fakeEditor({ extensions: ["codeBlock"] });
    const toolkit = createAiToolkit(editor);

    const res = await toolkit.execute("insert_code_block", { code: '<div>hi</div>' });
    expect(res.ok).toBe(true);
    // raw <div> would be parsed as a real element and shred the block
    expect(editor.getHTML()).toContain("&lt;div&gt;hi&lt;/div&gt;");
    expect(editor.getHTML()).not.toContain("<div>");
  });

  it("insert_link on an empty selection inserts a pre-marked text node", async () => {
    const editor = fakeEditor({ extensions: ["link"], selectionEmpty: true });
    const toolkit = createAiToolkit(editor);

    const res = await toolkit.execute("insert_link", { href: "https://example.com", text: "example" });
    expect(res.ok).toBe(true);
    // setLink alone would only write a stored mark and never reach the inserted text
    expect(editor.getHTML()).toContain('"type":"text"');
    expect(editor.getHTML()).toContain('"href":"https://example.com"');
  });
});

describe("createEditorAgent", () => {
  it("runs tool calls then returns the assistant reply", async () => {
    const editor = fakeEditor();
    const events: AgentEvent[] = [];
    const agent = createEditorAgent(editor, {
      baseURL: "https://llm.test/v1",
      apiKey: "sk-test",
      model: "test-model",
      onEvent: (event) => events.push(event),
    });

    const responses = [
      [
        { choices: [{ delta: { reasoning_content: "thinking " } }] },
        { choices: [{ delta: { reasoning_content: "hard…" } }] },
        {
          choices: [
            {
              delta: {
                tool_calls: [
                  { index: 0, id: "call_1", type: "function", function: { name: "append_content", arguments: "" } },
                ],
              },
            },
          ],
        },
        {
          choices: [
            { delta: { tool_calls: [{ index: 0, function: { arguments: JSON.stringify({ html: "<p>hi</p>" }) } }] } },
          ],
        },
      ],
      [{ choices: [{ delta: { content: "Done." } }] }],
    ];
    const sse = (deltas: object[]) =>
      new Response(deltas.map((delta) => `data: ${JSON.stringify(delta)}\n\n`).join("") + "data: [DONE]\n\n", {
        status: 200,
      });
    const fetchMock = vi.fn(async () => sse(responses[fetchMock.mock.calls.length - 1]));
    vi.stubGlobal("fetch", fetchMock);

    await agent.send("append hi");

    // request shape
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://llm.test/v1/chat/completions");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("test-model");
    expect(body.tools.some((tool: { function: { name: string } }) => tool.function.name === "append_content")).toBe(
      true,
    );

    // tool round-trip
    expect(editor.setContent).not.toHaveBeenCalled(); // append, not set
    expect(events.map((event) => event.type)).toEqual([
      "reasoning_delta",
      "reasoning_delta",
      "tool_call",
      "tool_result",
      "content_delta",
      "assistant_text",
    ]);
    expect(events[0]).toMatchObject({ type: "reasoning_delta", text: "thinking " });
    expect(events[1]).toMatchObject({ type: "reasoning_delta", text: "hard…" });
    expect(events[4]).toMatchObject({ type: "content_delta", text: "Done." });
    expect(events[3]).toMatchObject({ type: "tool_result", result: { ok: true } });
    expect(events[5]).toMatchObject({ type: "assistant_text", text: "Done." });
    const toolMessage = agent.history.find((message) => message.role === "tool");
    expect(toolMessage).toMatchObject({ tool_call_id: "call_1" });
    expect(agent.history.at(-1)?.content).toBe("Done.");

    vi.unstubAllGlobals();
  });

  it("supports multi-listener on() with unsubscribe, and onEvent stays registered", async () => {
    const viaOnEvent: AgentEvent[] = [];
    const agent = createEditorAgent(fakeEditor(), {
      baseURL: "https://llm.test/v1",
      apiKey: "sk-test",
      model: "test-model",
      onEvent: (event) => viaOnEvent.push(event),
    });
    const a: AgentEvent[] = [];
    const b: AgentEvent[] = [];
    const offA = agent.on((event) => a.push(event));
    agent.on((event) => b.push(event));

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(`data: ${JSON.stringify({ choices: [{ delta: { content: "hi" } }] })}\n\ndata: [DONE]\n\n`, {
            status: 200,
          }),
      ),
    );
    await agent.send("hello");
    const base = viaOnEvent.length; // 2 events per send: content_delta + assistant_text
    expect(base).toBeGreaterThan(0);
    expect(a.length).toBe(base);
    expect(b.length).toBe(base);

    offA();
    await agent.send("again");
    expect(a.length).toBe(base); // unsubscribed: unchanged
    expect(b.length).toBe(viaOnEvent.length); // still subscribed, grew with second send

    vi.unstubAllGlobals();
  });
});
