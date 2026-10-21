import { Extension } from "@tiptap/core";
import { shallowRef } from "vue";
import type { ShallowRef } from "vue";

import type { ButtonView } from "@/types";
import { createEditorAgent } from "@/ai/agent";
import AiPanel from "@/ai/components/ai-panel/index.vue";
import type { AgentConfig, EditorAgent } from "@/ai/types";

export interface AiOptions extends AgentConfig {
  /**
   * Floating UI outlet declared like other extensions' `bubbleMenu` option —
   * the editor shell mounts it, so there is nothing to wire by hand.
   * No `button`, so the AI never shows up in the toolbar.
   */
  panel?: ButtonView;
}

declare module "@tiptap/core" {
  interface Storage {
    // ref, not a plain field: the editor `create` event — and therefore the agent —
    // lands in a setTimeout after mount, so the panel outlet has to react to it.
    ai: { agent: ShallowRef<EditorAgent | undefined> };
  }
}

/**
 * AI assistant as a regular extension: add `Ai.configure({ baseURL, apiKey, model })`
 * to the editor's `extensions` — the chat FAB/drawer mounts itself and the agent
 * (conversation history, abort) is owned by the editor's lifecycle.
 * NOT part of StarterKit (opt-in only — it needs an API key).
 */
export const Ai = Extension.create<AiOptions>({
  name: "ai",

  addOptions(): AiOptions {
    return {
      baseURL: "",
      apiKey: "",
      model: "",
      panel: ({ editor, t }) => ({
        component: AiPanel,
        componentProps: { editor, agent: editor.storage.ai.agent.value, translate: t },
      }),
    };
  },

  addStorage() {
    return { agent: shallowRef<EditorAgent | undefined>() };
  },

  onCreate() {
    this.storage.agent.value = createEditorAgent(this.editor, this.options);
  },

  onDestroy() {
    this.storage.agent.value?.abort();
    this.storage.agent.value = undefined;
  },
});
