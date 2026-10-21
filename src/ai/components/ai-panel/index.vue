<template>
  <Teleport to="body">
    <!-- Soft UI FAB: floats at bottom-right, never affects host layout -->
    <button v-if="!open" type="button" class="tiptap-ai-fab" @click="open = true">
      <BotIcon />
    </button>

    <Transition name="tiptap-ai-drawer">
      <aside v-if="open" ref="drawerEl" class="tiptap-ai-drawer">
        <div class="tiptap-ai-drawer__header">
          <span class="tiptap-ai-drawer__title"><BotIcon /> {{ t("aiTitle") }}</span>
          <button type="button" class="tiptap-ai-drawer__close" @click="open = false">
            <XIcon />
          </button>
        </div>

        <div ref="listEl" class="tiptap-ai-drawer__list" @scroll="onListScroll">
          <p v-if="!messages.length" class="tiptap-ai-drawer__empty">{{ t("aiEmpty") }}</p>
          <template v-for="(item, index) in messages" :key="index">
            <details
              v-if="item.role === 'thinking'"
              class="tiptap-ai-drawer__thinking"
              :open="busy && index === messages.length - 1"
            >
              <summary><BrainIcon /> {{ t("aiThinking") }}</summary>
              <p>{{ item.text }}</p>
            </details>
            <div
              v-else-if="item.role === 'tool'"
              class="tiptap-ai-drawer__tool"
              :class="{ done: item.done, failed: item.failed }"
            >
              <span>{{ toolName(item.text) }}</span>
              <span v-if="item.failed">{{ t("aiToolFailed") }}</span>
            </div>
            <p v-else class="tiptap-ai-drawer__msg" :class="`tiptap-ai-drawer__msg--${item.role}`">{{ item.text }}</p>
          </template>
          <p v-if="busy" class="tiptap-ai-drawer__msg tiptap-ai-drawer__msg--assistant">{{ t("aiThinking") }}</p>
        </div>

        <div class="tiptap-ai-drawer__input">
          <textarea
            v-model="draft"
            class="tiptap-ai-drawer__textarea"
            rows="2"
            :placeholder="t('aiPlaceholder')"
            :disabled="busy"
            @keydown="onKeydown"
          />
          <button
            type="button"
            class="tiptap-ai-drawer__send"
            :class="{ 'tiptap-ai-drawer__send--stop': busy }"
            :disabled="!busy && !draft.trim()"
            :aria-label="busy ? t('aiStop') : t('aiSend')"
            :title="busy ? t('aiStop') : t('aiSend')"
            @click="busy ? agent?.abort() : send()"
          >
            <SquareIcon v-if="busy" />
            <ArrowUpIcon v-else />
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, ref, toRef, useTemplateRef, watch } from "vue";
import type { Editor } from "@tiptap/core";
import ArrowUpIcon from "~icons/lucide/arrow-up";
import BotIcon from "~icons/lucide/bot";
import BrainIcon from "~icons/lucide/brain";
import SquareIcon from "~icons/lucide/square";
import XIcon from "~icons/lucide/x";

import { useEditorLocale } from "@/composables/useEditorLocale";
import type { LocaleTranslations } from "@/locales";
import type { TranslateFn } from "@/types";
import { applyTheme } from "@/theme";
import { themeSyncKey } from "@/components/ui-common/theme-provider/context";
import type { AgentEvent, EditorAgent } from "../../types";

/**
 * Soft-UI AI assistant: a floating FAB (fixed bottom-right, out of layout flow)
 * toggling a right-side chat drawer that renders an externally supplied
 * `EditorAgent`'s event stream. The host creates the agent (endpoint/key,
 * `confirmDangerous`) — the panel is pure UI.
 */
const props = defineProps<{
  editor: Editor;
  locale?: "zh" | "en" | (string & {});
  translations?: LocaleTranslations;
  agent?: EditorAgent;
  /** Pre-resolved translate from the editor shell (extension mount); wins over `locale`. */
  translate?: TranslateFn;
}>();

const open = defineModel<boolean>("open", { default: false });

const { t: localeT } = useEditorLocale(
  toRef(() => props.locale),
  toRef(() => props.translations),
);
const t: TranslateFn = (key, named, plural) => (props.translate ?? localeT)(key, named, plural);

interface PanelItem {
  role: "user" | "assistant" | "error" | "tool" | "thinking";
  text: string;
  done?: boolean;
  failed?: boolean;
}

const messages = ref<PanelItem[]>([]);
const draft = ref("");
const busy = ref(false);
const listEl = useTemplateRef<HTMLElement>("listEl");
const drawerEl = useTemplateRef<HTMLElement>("drawerEl");
const agent = toRef(() => props.agent);

// Teleport leaves the ThemeProvider subtree — re-apply the theme vars.
// Standalone use (no editor root above): follow the host page's `html.dark`.
const syncTheme =
  inject(themeSyncKey, null) ??
  ((el: HTMLElement) => {
    applyTheme(document.documentElement.classList.contains("dark") ? "dark" : "light", el);
  });

watch(open, async (visible) => {
  if (!visible) return;
  await nextTick();
  if (drawerEl.value) syncTheme(drawerEl.value);
  stickToBottom.value = true;
  scrollToEnd();
});

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
  if (event.type === "reasoning_delta") {
    // append into the current round's thinking block
    const last = messages.value.at(-1);
    if (last?.role === "thinking") last.text += event.text;
    else messages.value.push({ role: "thinking", text: event.text });
  } else if (event.type === "content_delta") {
    const last = messages.value.at(-1);
    if (last?.role === "assistant") last.text += event.text;
    else messages.value.push({ role: "assistant", text: event.text });
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
  scrollToEnd();
}

async function send() {
  const text = draft.value.trim();
  if (!text || busy.value || !agent.value) return;
  draft.value = "";
  messages.value.push({ role: "user", text });
  busy.value = true;
  stickToBottom.value = true;
  scrollToEnd();
  try {
    await agent.value.send(text);
  } finally {
    busy.value = false;
    scrollToEnd();
  }
}

/** Tool names are locale keys (`tool.insert_table`); unknown tools fall back to the raw name. */
function toolName(name: string) {
  const key = `tool.${name}`;
  const label = t(key);
  return label === key ? name : label;
}

// Stick to the bottom while an answer streams, but stop following once the user
// scrolls up. A new question (send) or (re)opening the drawer pins it again.
const stickToBottom = ref(true);

function onListScroll() {
  const el = listEl.value;
  if (!el) return;
  stickToBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
}

/** Enter sends, Ctrl/Cmd+Enter inserts a newline (IME commits must not send). */
function onKeydown(event: KeyboardEvent) {
  if (event.isComposing || event.key !== "Enter") return;
  event.preventDefault();
  if (!event.ctrlKey && !event.metaKey) {
    send();
    return;
  }
  const el = event.target as HTMLTextAreaElement;
  el.setRangeText("\n", el.selectionStart, el.selectionEnd, "end");
  draft.value = el.value;
}

function scrollToEnd() {
  if (!stickToBottom.value) return;
  nextTick(() => listEl.value?.scrollTo({ top: listEl.value.scrollHeight }));
}

onBeforeUnmount(() => agent.value?.abort());
</script>

<style lang="scss" scoped>
/* Soft UI (docs/style/soft-ui-hard-prompt.md): large radii, tinted soft shadows,
   generous gaps, 300ms ease-in-out, Cloud Float hover / Pillow Press active. */

.tiptap-ai-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: var(--tiptap-z-dialog);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--tiptap-btn-primary-bg);
  color: var(--tiptap-btn-primary-text);
  font-size: 22px;
  cursor: pointer;
  box-shadow: var(--tiptap-btn-primary-shadow);
  transition:
    transform 300ms ease-in-out,
    box-shadow 300ms ease-in-out;

  // Cloud Float
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--tiptap-btn-primary-shadow-hover);
  }

  // Pillow Press
  &:active {
    transform: scale(0.95);
  }
}

.tiptap-ai-drawer {
  position: fixed;
  top: 16px;
  right: 16px;
  bottom: 16px;
  z-index: var(--tiptap-z-dialog);
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: 90vw;
  background: var(--tiptap-color-bg);
  border-radius: 24px; // rounded-2xl
  box-shadow: var(--tiptap-popover-shadow);
  overflow: hidden;
  transition:
    background-color 300ms ease-in-out,
    box-shadow 300ms ease-in-out;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--tiptap-padding-lg) var(--tiptap-content-padding);
  }

  &__title {
    display: flex;
    align-items: center;
    gap: var(--tiptap-gap-sm);
    font-size: var(--tiptap-font-size);
    font-weight: 600;
    color: var(--tiptap-color-text);
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--tiptap-color-text-muted);
    font-size: 16px;
    cursor: pointer;
    transition:
      background-color 300ms ease-in-out,
      color 300ms ease-in-out;

    &:hover {
      background: var(--tiptap-btn-bg-hover);
      color: var(--tiptap-color-text);
    }
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--tiptap-content-padding) var(--tiptap-padding-lg);
    display: flex;
    flex-direction: column;
    gap: var(--tiptap-gap);
  }

  &__empty {
    color: var(--tiptap-color-text-muted);
    font-size: var(--tiptap-font-size-sm);
  }

  &__msg {
    margin: 0;
    max-width: 90%;
    padding: var(--tiptap-padding-lg) var(--tiptap-content-padding);
    border-radius: var(--tiptap-border-radius-lg);
    font-size: var(--tiptap-font-size-sm);
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;

    // icon-chip feel: soft tinted chip, no hard border
    &--user {
      align-self: flex-end;
      background: var(--tiptap-accent-primary-bg);
      color: var(--tiptap-color-text);
    }

    // Assistant replies sit on the panel surface: no chip, no tint.
    &--assistant {
      align-self: flex-start;
      color: var(--tiptap-color-text);
      padding-inline: 0;
    }

    &--error {
      align-self: stretch;
      background: color-mix(in srgb, var(--tiptap-accent-danger) 12%, transparent);
      color: var(--tiptap-accent-danger);
    }
  }

  &__thinking {
    align-self: stretch;
    margin: 0;
    padding: var(--tiptap-padding-sm) var(--tiptap-padding-lg);
    border-radius: var(--tiptap-border-radius-md);
    background: var(--tiptap-color-bg-subtle);
    font-size: var(--tiptap-font-size-sm);
    color: var(--tiptap-color-text-muted);

    summary {
      cursor: pointer;
      user-select: none;

      svg {
        vertical-align: -0.15em; // keep the disclosure triangle, nudge the inline icon onto the baseline
      }
    }

    p {
      margin: var(--tiptap-gap-sm) 0 0;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  &__tool {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: var(--tiptap-gap-sm);
    padding: var(--tiptap-padding-sm) var(--tiptap-padding-lg);
    border-radius: 999px;
    background: var(--tiptap-color-bg-subtle);
    color: var(--tiptap-color-text-muted);
    font-size: var(--tiptap-font-size-sm);

    &.done {
      color: var(--tiptap-accent-success);
    }

    &.failed {
      color: var(--tiptap-accent-danger);
    }

    &::before {
      content: "\25CB"; // ○ running
      font-size: 0.75em;
      line-height: 1;
    }

    &.done::before {
      content: "\25CF"; // ● done
    }

    &.failed::before {
      content: "\25B2"; // ▲ failed
    }
  }

  &__input {
    position: relative;
    padding: var(--tiptap-padding-lg) var(--tiptap-content-padding) var(--tiptap-content-padding);
  }

  // Mirrors ui-common/input styling — that component only renders a single-line <input>.
  &__textarea {
    background-color: var(--tiptap-input-bg);
    border: 1px solid var(--tiptap-input-border);
    border-radius: var(--tiptap-input-radius);
    box-sizing: border-box;
    color: var(--tiptap-input-text);
    font-family: inherit;
    font-size: var(--tiptap-font-size);
    outline: none;
    padding: var(--tiptap-input-padding);
    padding-bottom: 44px; // room for the round send button in the corner
    resize: none;
    transition:
      border-color 200ms ease-in-out,
      box-shadow 200ms ease-in-out;
    width: 100%;

    &::placeholder {
      color: var(--tiptap-input-placeholder);
    }

    &:focus {
      border-color: var(--tiptap-input-border-hover);
      background-color: var(--tiptap-color-bg);
      box-shadow: 0 0 0 3px var(--tiptap-focus-ring);
    }
  }

  // Round icon button pinned to the textarea's bottom-right corner.
  &__send {
    position: absolute;
    right: calc(var(--tiptap-content-padding) + var(--tiptap-padding-md));
    bottom: calc(var(--tiptap-content-padding) + var(--tiptap-padding-md));
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: var(--tiptap-btn-primary-bg);
    color: var(--tiptap-btn-primary-text);
    font-size: 18px;
    cursor: pointer;
    box-shadow: var(--tiptap-btn-primary-shadow);
    transition:
      transform 200ms ease-in-out,
      box-shadow 200ms ease-in-out,
      background-color 200ms ease-in-out;

    &:hover:not(:disabled) {
      background: var(--tiptap-btn-primary-bg-hover);
      box-shadow: var(--tiptap-btn-primary-shadow-hover);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    // Stop state reads as destructive: the abort kills the running answer.
    &--stop {
      background: var(--tiptap-btn-danger-bg);
      color: var(--tiptap-btn-danger-text);
      box-shadow: var(--tiptap-btn-danger-shadow);

      svg {
        font-size: 14px; // lucide/square's rect is 18/24 of its viewBox: this makes its ink ~14px, same as the arrow's
      }

      &:hover:not(:disabled) {
        background: var(--tiptap-btn-danger-bg-hover);
        box-shadow: var(--tiptap-btn-danger-shadow-hover);
      }
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

.tiptap-ai-drawer-enter-active,
.tiptap-ai-drawer-leave-active {
  transition:
    transform 300ms ease-in-out,
    opacity 300ms ease-in-out;
}

.tiptap-ai-drawer-enter-from,
.tiptap-ai-drawer-leave-to {
  transform: translateX(calc(100% + 16px));
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .tiptap-ai-fab,
  .tiptap-ai-drawer,
  .tiptap-ai-drawer-enter-active,
  .tiptap-ai-drawer-leave-active {
    transition: none;
  }
}
</style>
