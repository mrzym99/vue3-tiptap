<template>
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
      @click="busy ? emit('stop') : emit('send')"
    >
      <SquareIcon v-if="busy" />
      <ArrowUpIcon v-else />
    </button>
  </div>
</template>

<script setup lang="ts">
import ArrowUpIcon from "~icons/lucide/arrow-up";
import SquareIcon from "~icons/lucide/square";
import type { TranslateFn } from "@/types";

defineProps<{
  busy: boolean;
  t: TranslateFn;
}>();

const emit = defineEmits<{
  send: [];
  stop: [];
}>();

const draft = defineModel<string>("draft", { default: "" });

/** Enter sends, Ctrl/Cmd+Enter inserts a newline (IME commits must not send). */
function onKeydown(event: KeyboardEvent) {
  if (event.isComposing || event.key !== "Enter") return;
  event.preventDefault();
  if (!event.ctrlKey && !event.metaKey) {
    emit("send");
    return;
  }
  const el = event.target as HTMLTextAreaElement;
  el.setRangeText("\n", el.selectionStart, el.selectionEnd, "end");
  draft.value = el.value;
}
</script>

<style lang="scss" scoped>
/* Soft UI (docs/style/soft-ui-hard-prompt.md): large radii, tinted soft shadows,
   generous gaps, 300ms ease-in-out, Cloud Float hover / Pillow Press active. */

.tiptap-ai-drawer__input {
  position: relative;
  padding: var(--tiptap-padding-lg) var(--tiptap-content-padding) var(--tiptap-content-padding);
}

// Mirrors ui-common/input styling — that component only renders a single-line <input>.
.tiptap-ai-drawer__textarea {
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
.tiptap-ai-drawer__send {
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
</style>
