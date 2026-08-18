<template>
  <NButton
    :class="['action-button', { 'is-active': isActive?.() }]"
    :disabled="disabled"
    :tooltip="tooltip"
    @click="handleClick"
  >
    <NTooltip trigger="hover" size="small" :disabled="disabled">
      <template #trigger>
        <div class="icon-container">
          <component :is="icon" size="24px" />
          <slot name="suffix" />
        </div>
      </template>
      {{ tooltip }}
    </NTooltip>
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NTooltip } from "naive-ui";
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
  min-width: var(--naive-tiptap-btn-size);
  height: var(--naive-tiptap-btn-size);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--naive-tiptap-padding-sm);
  border-radius: var(--naive-tiptap-border-radius-sm);
  outline: none;
}

.action-button:hover:not(:disabled) {
  background-color: var(--naive-tiptap-btn--bg-hover);
}

.action-button.is-active {
  background-color: var(--naive-tiptap-btn--bg-active);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--naive-tiptap-gap-sm);
}
</style>
