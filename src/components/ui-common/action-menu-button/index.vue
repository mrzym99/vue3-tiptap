<template>
  <Popover trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton
        :editor="editor"
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
    <div class="action-menu">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="tiptap-menu-item"
        :class="{ active: item.isActive() }"
        :disabled="item.disabled"
        @click="item.action?.()"
      >
        <component :is="item.icon" size="24px" />
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
.action-menu {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap-xs);
  min-width: 160px;
}
</style>
