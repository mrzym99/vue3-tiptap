<template>
  <NPopover trigger="click" size="small" :show-arrow="false" placement="bottom-start">
    <template #trigger>
      <ActionButton :editor="editor" :disabled="disabled" :icon="active.icon" :tooltip="active.label">
        <template #suffix>
          <slot name="suffix" />
        </template>
      </ActionButton>
    </template>
    <NList hoverable clickable :show-divider="false">
      <NListItem
        :class="['action-menu-item', { active: item.isActive() }]"
        v-for="(item, i) in items"
        :key="i"
        :disabled="item.disabled"
        :active="item.isActive()"
        @click="item.action?.()"
      >
        <SvgIcon :path="getIcon(item.icon)" size="24" />
        <span>{{ item.label }}</span>
      </NListItem>
    </NList>
  </NPopover>
</template>

<script setup lang="ts">
import ActionButton from '../ActionButton/index.vue'
import { NList, NPopover, NListItem } from 'naive-ui'
import SvgIcon from '../SvgIcon/index.vue'
import type { ActionButtonMenuProps } from './props.ts'
import { getIcon } from '@/components/utils.ts'
import type { ActionMenuButtonItem } from './type.ts'

const props = defineProps<ActionButtonMenuProps>()

const active = computed<ActionMenuButtonItem>(() => {
  const find = props.items.find((k) => k.isActive())
  if (find) {
    return {
      ...find,
      icon: find.icon ? find.icon : props.icon,
    }
  }

  const item: ActionMenuButtonItem = {
    label: props.tooltip,
    icon: props.icon,
    isActive: () => false,
  }

  return item
})
</script>

<style scoped>
:deep(.n-list-item__main) {
  display: flex;
  align-items: center;
  gap: var(--naive-tiptap-gap);
}

/* Increase active weight to override hover */
.action-menu-item.active.active {
  background-color: var(--naive-tiptap-btn--bg-active);
}
</style>
