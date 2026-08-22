<template>
  <Tooltip :disabled="disabled || !tooltip">
    <template #trigger>
      <button
        type="button"
        class="action-button"
        :class="{ 'is-active': isActive?.() }"
        :disabled="disabled"
        @click="handleClick"
      >
        <span class="icon-container">
          <component :is="icon" />
          <slot name="suffix" />
        </span>
      </button>
    </template>
    {{ tooltip }}
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from "@/components/ui-common/tooltip/index.vue";
import type { ActionButtonProps } from "./props";

const props = defineProps<ActionButtonProps>();

const handleClick = () => {
  if (props.action) {
    props.action();
  }
};
</script>

<style lang="scss" scoped>
.action-button {
  align-items: center;
  background: none;
  color: var(--tiptap-color-text);
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  cursor: pointer;
  display: inline-flex;
  height: var(--tiptap-btn-size);
  justify-content: center;
  min-width: var(--tiptap-btn-size);
  outline: none;
  padding: var(--tiptap-padding-sm);
  font-size: var(--tiptap-font-size);

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn--bg-hover);
  }

  &.is-active {
    background-color: var(--tiptap-btn--bg-active);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.icon-container {
  display: flex;
  align-items: center;
  gap: var(--tiptap-gap-sm, var(--tiptap-gap));
  justify-content: center;
}
</style>
