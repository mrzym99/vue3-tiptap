<template>
  <NPopover trigger="click" size="small" :show-arrow="false" placement="bottom-start">
    <template #trigger>
      <ActionButton :disabled="disabled" :icon="icon" :tooltip="tooltip" :isActive="() => false" />
    </template>
    <NList>
      <NListItem v-for="(item, i) in items" :key="i">
        <SvgIcon :path="item.icon" size="24" />
      </NListItem>
    </NList>
  </NPopover>
</template>

<script setup lang="ts">
import ActionButton from '../ActionButton/index.vue'
import { NList, NPopover,NListItem } from 'naive-ui'
import SvgIcon from '../SvgIcon/index.vue'

type ButtonProps = {
  disabled: boolean
  icon: string
  tooltip: string
  items?: ItemProps[]
}

type ItemProps = {
  label: string
  icon: string
  disabled: boolean
  isActive: () => boolean
  action: () => void
}
const props = defineProps<ButtonProps>()
</script>

<style scoped>
</style>
