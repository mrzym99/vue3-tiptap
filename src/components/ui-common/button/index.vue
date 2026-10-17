<template>
  <button type="button" class="tiptap-btn" :class="`tiptap-btn--${variant}`" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
/** Shared text button (Notion Style): default variant deepens bg on hover; primary is accent-filled; danger marks destructive actions. */
const props = withDefaults(
  defineProps<{
    variant?: "default" | "primary" | "danger";
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
  transition:
    box-shadow 200ms ease-in-out,
    transform 200ms ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

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
  box-shadow: var(--tiptap-btn-primary-shadow);

  /* Cloud Float: lift + accent-tinted shadow bloom */
  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn-primary-bg-hover);
    box-shadow: var(--tiptap-btn-primary-shadow-hover);
    transform: translateY(-1px);
  }

  /* Pillow Press: press into the surface */
  &:active:not(:disabled) {
    background-color: var(--tiptap-btn-primary-bg-hover);
    box-shadow: var(--tiptap-btn-primary-shadow);
    transform: scale(0.97);
  }
}

.tiptap-btn--danger {
  background-color: var(--tiptap-btn-danger-bg);
  color: var(--tiptap-btn-danger-text);
  box-shadow: var(--tiptap-btn-danger-shadow);

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn-danger-bg-hover);
    box-shadow: var(--tiptap-btn-danger-shadow-hover);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background-color: var(--tiptap-btn-danger-bg-hover);
    box-shadow: var(--tiptap-btn-danger-shadow);
    transform: scale(0.97);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tiptap-btn {
    transition:
      box-shadow 200ms ease-in-out,
      border-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }

  .tiptap-btn--primary,
  .tiptap-btn--danger {
    &:hover:not(:disabled),
    &:active:not(:disabled) {
      transform: none;
    }
  }
}
</style>
