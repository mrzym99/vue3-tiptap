<template>
  <NPopover trigger="click" size="small" :show-arrow="false" placement="bottom-start">
    <template #trigger>
      <ActionButton :editor="editor" :disabled="disabled" :icon="icon" :tooltip="tooltip" :isActive="() => false" />
    </template>
    <NList>
      <NListItem v-for="(item, i) in items" :key="i">
        <SvgIcon :path="getIcon(item.icon)" size="24" />
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

const props = defineProps<ActionButtonMenuProps>()
</script>

<style scoped></style>
