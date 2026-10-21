import { describe, expect, it, vi } from "vitest";
import { computed } from "vue";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { Ai } from "./Ai";
import type { AiOptions } from "./Ai";

function createAiEditor() {
  return new Editor({
    content: "",
    extensions: [Document, Paragraph, Text, Ai.configure({ baseURL: "https://x/api", apiKey: "k", model: "m" })],
    element: document.createElement("div"),
  });
}

describe("Ai extension", () => {
  // The editor `create` event — where the agent is built — fires from a
  // setTimeout after mount, i.e. after the panel outlet is first evaluated.
  // A plain storage field would freeze `undefined` into the prop; the storage
  // ref must invalidate the consumer's computed instead.
  it("hands the agent to the panel outlet once it exists", async () => {
    const editor = createAiEditor();
    const panel = (editor.extensionManager.extensions.find((e) => e.name === "ai")!.options as AiOptions).panel!;
    const outlet = computed(() => panel({ editor, t: (key: string) => key }).componentProps?.agent);

    expect(outlet.value).toBeUndefined();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(outlet.value).toBeTruthy();
    expect(editor.storage.ai.agent.value).toBe(outlet.value);
    editor.destroy();
  });

  it("aborts and clears the agent on destroy", async () => {
    const editor = createAiEditor();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const storage = editor.storage.ai;
    const abort = vi.spyOn(storage.agent.value!, "abort");
    editor.destroy();
    expect(abort).toHaveBeenCalled();
    expect(storage.agent.value).toBeUndefined();
  });
});
