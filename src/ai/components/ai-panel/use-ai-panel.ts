import { onBeforeUnmount, ref, watch, type Ref } from "vue";
import type { AgentEvent, EditorAgent } from "../../types";

export interface PanelItem {
  role: "user" | "assistant" | "error" | "tool" | "thinking";
  text: string;
  done?: boolean;
  failed?: boolean;
  // thinking blocks only: when reasoning started / how long it took (seconds)
  startedAt?: number;
  duration?: number;
}

/**
 * Chat state for AiPanel: accumulates the agent's event stream into renderable
 * items and drives send/abort. Rendering and scroll behavior live in the child
 * components; this composable is pure state.
 */
export function useAiPanel(agent: Ref<EditorAgent | undefined>) {
  const messages = ref<PanelItem[]>([]);
  const draft = ref("");
  const busy = ref(false);

  // Subscribe to the agent's event stream for as long as this agent prop is set.
  // The Ai extension creates the agent asynchronously (editor `create` event), so
  // the first run can see `undefined` — returning without onCleanup() keeps Vue
  // from warning about a non-function cleanup.
  watch(
    agent,
    (agent, _prev, onCleanup) => {
      if (!agent) return;
      onCleanup(agent.on(handleEvent));
    },
    { immediate: true },
  );

  function handleEvent(event: AgentEvent) {
    // Any non-reasoning event ends the current thinking block — stamp its duration.
    if (event.type !== "reasoning_delta") closeThinking();
    if (event.type === "reasoning_delta") {
      // append into the current round's thinking block
      const last = messages.value.at(-1);
      if (last?.role === "thinking") last.text += event.text;
      else messages.value.push({ role: "thinking", text: event.text, startedAt: Date.now() });
    } else if (event.type === "content_delta") {
      const last = messages.value.at(-1);
      if (last?.role === "assistant") last.text += event.text;
      // Models often emit leading blank lines before a tool call; don't build a
      // blank bubble out of them.
      else messages.value.push({ role: "assistant", text: event.text.replace(/^\s+/, "") });
    } else if (event.type === "tool_call") {
      messages.value.push({ role: "tool", text: event.name });
    } else if (event.type === "tool_result") {
      const pending = [...messages.value].reverse().find((item) => item.role === "tool" && !item.done);
      if (pending) {
        pending.done = true;
        pending.failed = !event.result.ok;
      }
    } else if (event.type === "assistant_text") {
      // content already streamed in via content_delta — skip/replace duplicates
      const last = messages.value.at(-1);
      if (last?.role === "assistant") {
        if (last.text !== event.text) last.text = event.text;
      } else if (event.text) {
        messages.value.push({ role: "assistant", text: event.text });
      }
    } else {
      messages.value.push({ role: "error", text: event.message });
    }
  }

  /** Freeze the open thinking block's timer (next event, run end or abort). */
  function closeThinking() {
    const last = messages.value.at(-1);
    if (last?.role === "thinking" && last.duration == null && last.startedAt != null) {
      last.duration = Math.max(1, Math.round((Date.now() - last.startedAt) / 1000));
    }
  }

  async function send() {
    const text = draft.value.trim();
    if (!text || busy.value || !agent.value) return;
    draft.value = "";
    messages.value.push({ role: "user", text });
    busy.value = true;
    try {
      await agent.value.send(text);
    } finally {
      closeThinking(); // abort/errors mid-reasoning: freeze the timer at stop time
      busy.value = false;
    }
  }

  onBeforeUnmount(() => agent.value?.abort());

  return { messages, draft, busy, send };
}
