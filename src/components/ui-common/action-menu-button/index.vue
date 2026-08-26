<template>
  <Popover trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton
        :is-active="() => isActive"
        :disabled="disabled"
        :icon="active.icon"
        :tooltip="active.label"
      >
        <template #suffix>
          <slot name="suffix" />
        </template>
      </ActionButton>
    </template>
    <div class="tiptap-action-menu">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="tiptap-menu-item"
        :class="{ active: item.isActive() }"
        :disabled="item.disabled"
        @click="item.action?.()"
      >
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import ActionButton from "../action-button/index.vue";
import Popover from "@/components/ui-common/popover/index.vue";
import type { ActionButtonMenuProps } from "./props.ts";
import type { ActionMenuButtonItem } from "./type.ts";

const props = defineProps<ActionButtonMenuProps>();

const active = computed<ActionMenuButtonItem>(() => {
  const find = props.items.find((k) => k.isActive());
  if (find) {
    return {
      ...find,
      icon: find.icon ? find.icon : props.icon,
    };
  }

  const item: ActionMenuButtonItem = {
    label: props.tooltip,
    icon: props.icon,
    isActive: () => false,
  };

  return item;
});
</script>

<style lang="scss" scoped>
.tiptap-action-menu {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap-xs);
  min-width: 100px;
}

.tiptap-menu-item {
  align-items: center;
  background: none;
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  color: var(--tiptap-color-text);
  cursor: pointer;
  display: flex;
  font-size: var(--tiptap-font-size);
  gap: var(--tiptap-gap);
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);
  text-align: left;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--tiptap-menu-item-hover);
  }

  &.active {
    background-color: var(--tiptap-menu-item-active);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
