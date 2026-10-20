<template>
  <Teleport to="body">
    <!-- Soft UI FAB: floats at bottom-right, never affects host layout -->
    <button v-if="!open" type="button" class="tiptap-ai-fab" @click="open = true">
      <SparklesIcon />
    </button>

    <Transition name="tiptap-ai-drawer">
      <aside v-if="open" ref="drawerEl" class="tiptap-ai-drawer">
        <div class="tiptap-ai-drawer__header">
          <span class="tiptap-ai-drawer__title"><SparklesIcon /> {{ t("aiTitle") }}</span>
          <button type="button" class="tiptap-ai-drawer__close" @click="open = false">
            <XIcon />
          </button>
        </div>

        <div ref="listEl" class="tiptap-ai-drawer__list">
          <p v-if="!messages.length" class="tiptap-ai-drawer__empty">{{ t("aiEmpty") }}</p>
          <template v-for="(item, index) in messages" :key="index">
            <details
              v-if="item.role === 'thinking'"
              class="tiptap-ai-drawer__thinking"
              :open="busy && index === messages.length - 1"
            >
              <summary>{{ t("aiThinking") }}</summary>
              <p>{{ item.text }}</p>
            </details>
            <div v-else-if="item.role === 'tool'" class="tiptap-ai-drawer__tool" :class="{ done: item.done, failed: item.failed }">
              <span>{{ !item.done ? t("aiToolRunning") : item.failed ? t("aiToolFailed") : t("aiToolDone") }}</span>
              <code>{{ item.text }}</code>
            </div>
            <p v-else class="tiptap-ai-drawer__msg" :class="`tiptap-ai-drawer__msg--${item.role}`">{{ item.text }}</p>
          </template>
          <p v-if="busy" class="tiptap-ai-drawer__msg tiptap-ai-drawer__msg--assistant">{{ t("aiThinking") }}</p>
        </div>

        <div class="tiptap-ai-drawer__input">
          <TiptapInput
            v-model="draft"
            :placeholder="t('aiPlaceholder')"
            :disabled="busy"
            @keydown.enter.prevent="send"
          />
          <TiptapButton v-if="busy" variant="primary" @click="agent?.abort()">{{ t("aiStop") }}</TiptapButton>
          <TiptapButton v-else variant="primary" :disabled="!draft.trim()" @click="send">
            {{ t("aiSend") }}
          </TiptapButton>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { inject, nextTick, onBeforeUnmount, ref, toRef, useTemplateRef, watch } from "vue";
import type { Editor } from "@tiptap/core";
import SparklesIcon from "~icons/lucide/sparkles";
import XIcon from "~icons/lucide/x";

import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import { useEditorLocale } from "@/composables/useEditorLocale";
import type { LocaleTranslations } from "@/locales";
import { applyTheme } from "@/theme";
import { themeSyncKey } from "@/components/ui-common/theme-provider/context";
import { createEditorAgent } from "../../agent";
import type { AgentConfig, EditorAgent } from "../../types";

/**
 * Soft-UI AI assistant: a floating FAB (fixed bottom-right, out of layout flow)
 * toggling a right-side chat drawer that drives `createEditorAgent`. The host
 * provides the agent config (endpoint/key) — API keys never pass through the toolkit.
 */
const props = defineProps<{
  editor: Editor;
  locale?: "zh" | "en" | (string & {});
  translations?: LocaleTranslations;
  config: Omit<AgentConfig, "onEvent">;
}>();

const open = defineModel<boolean>("open", { default: false });

const { t } = useEditorLocale(toRef(() => props.locale), toRef(() => props.translations));

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
let agent: EditorAgent | undefined;

// Teleport leaves the ThemeProvider subtree — re-apply the theme vars.
// Standalone use (no editor root above): follow the host page's `html.dark`.
const syncTheme = inject(themeSyncKey, null) ?? ((el: HTMLElement) => {
  applyTheme(document.documentElement.classList.contains("dark") ? "dark" : "light", el);
});

watch(open, async (visible) => {
  if (!visible) return;
  await nextTick();
  if (drawerEl.value) syncTheme(drawerEl.value);
  scrollToEnd();
});

function confirmDangerous(tool: { name: string }): boolean {
  return window.confirm(t("aiConfirmDanger").replace("{name}", tool.name));
}

function scrollToEnd() {
  nextTick(() => listEl.value?.scrollTo({ top: listEl.value.scrollHeight }));
}

watch(
  () => props.config,
  (config) => {
    agent = createEditorAgent(props.editor, {
      ...config,
      confirmDangerous,
      onEvent(event) {
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
      },
    });
  },
  { immediate: true, deep: true },
);

async function send() {
  const text = draft.value.trim();
  if (!text || busy.value || !agent) return;
  draft.value = "";
  messages.value.push({ role: "user", text });
  busy.value = true;
  scrollToEnd();
  try {
    await agent.send(text);
  } finally {
    busy.value = false;
    scrollToEnd();
  }
}

onBeforeUnmount(() => agent?.abort());
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
    transition: background-color 300ms ease-in-out;

    // icon-chip feel: soft tinted chip, no hard border
    &--user {
      align-self: flex-end;
      background: var(--tiptap-accent-primary-bg);
      color: var(--tiptap-color-text);
      border-bottom-right-radius: 4px;
    }

    &--assistant {
      align-self: flex-start;
      background: var(--tiptap-color-bg-subtle);
      color: var(--tiptap-color-text);
      border-bottom-left-radius: 4px;
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

    code {
      font-size: var(--tiptap-font-size-sm);
    }
  }

  &__input {
    display: flex;
    gap: var(--tiptap-gap-sm);
    padding: var(--tiptap-padding-lg) var(--tiptap-content-padding) var(--tiptap-content-padding);

    > :first-child {
      flex: 1;
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
