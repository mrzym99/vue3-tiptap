<template>
  <div ref="listEl" class="tiptap-ai-drawer__list" @scroll="onScroll">
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
      <!-- whitespace-only replies render as a blank bubble — hide them -->
      <p v-else-if="item.text.trim()" class="tiptap-ai-drawer__msg" :class="`tiptap-ai-drawer__msg--${item.role}`">{{ item.text }}</p>
    </template>
    <p v-if="busy" class="tiptap-ai-drawer__msg tiptap-ai-drawer__msg--assistant">{{ t("aiThinking") }}</p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from "vue";
import BrainIcon from "~icons/lucide/brain";
import type { AiMessageProps } from "./props";

const props = defineProps<AiMessageProps>();

const listEl = useTemplateRef<HTMLElement>("listEl");

// Stick to the bottom while an answer streams, but stop following once the user
// scrolls up. The parent re-pins via pinToBottom() when the drawer opens or a
// new question is sent.
const stick = ref(true);

function onScroll() {
  const el = listEl.value;
  if (!el) return;
  stick.value = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
}

/** Re-pins the view to the bottom (used by the parent on open / send). */
function pinToBottom() {
  stick.value = true;
  scrollToEnd();
}

function scrollToEnd() {
  if (!stick.value) return;
  nextTick(() => listEl.value?.scrollTo({ top: listEl.value.scrollHeight }));
}

// Any visible change (new item, streamed delta, busy flip) keeps the view pinned.
watch(
  () => [props.messages.length, props.messages.at(-1)?.text.length, props.busy] as const,
  scrollToEnd,
);

/** Tool names are locale keys (`tool.insert_table`); unknown tools fall back to the raw name. */
function toolName(name: string) {
  const key = `tool.${name}`;
  const label = props.t(key);
  return label === key ? name : label;
}

defineExpose({ pinToBottom });
</script>

<style lang="scss" scoped>
/* Soft UI (docs/style/soft-ui-hard-prompt.md): large radii, tinted soft shadows,
   generous gaps, 300ms ease-in-out, Cloud Float hover / Pillow Press active. */

.tiptap-ai-drawer__list {
  flex: 1;
  overflow-y: auto;
  padding: 0 var(--tiptap-content-padding) var(--tiptap-padding-lg);
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}

.tiptap-ai-drawer__empty {
  color: var(--tiptap-color-text-muted);
  font-size: var(--tiptap-font-size-sm);
}

.tiptap-ai-drawer__msg {
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

.tiptap-ai-drawer__thinking {
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

.tiptap-ai-drawer__tool {
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
</style>
