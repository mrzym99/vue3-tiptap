<template>
  <button
    type="button"
    class="tiptap-btn"
    :class="`tiptap-btn--${variant}`"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
/** Shared text button (Notion Style): default variant deepens bg on hover; primary is accent-filled. */
const props = withDefaults(
  defineProps<{
    variant?: "default" | "primary";
    disabled?: boolean;
  }>(),
  {
    variant: "default",
    disabled: false,
  },
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

function onClick(event: MouseEvent) {
  if (props.disabled) return;
  emit("click", event);
}
</script>

<style lang="scss" scoped>
.tiptap-btn {
  background-color: var(--tiptap-btn-bg, transparent);
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  color: var(--tiptap-color-text);
  cursor: pointer;
  font-size: var(--tiptap-font-size);
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn-bg-hover);
  }

  &:active:not(:disabled) {
    background-color: var(--tiptap-btn-bg-active);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.tiptap-btn--primary {
  background-color: var(--tiptap-btn-primary-bg);
  color: var(--tiptap-btn-primary-text);

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn-primary-bg-hover);
  }

  &:active:not(:disabled) {
    background-color: var(--tiptap-btn-primary-bg-hover);
  }
}
</style>
