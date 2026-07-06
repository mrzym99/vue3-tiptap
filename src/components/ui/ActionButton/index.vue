<template>
  <NButton
    :class="['action-button', { 'is-active': isActive?.() }]"
    :disabled="disabled"
    :tooltip="tooltip"
    @click="handleClick"
  >
    <NTooltip trigger="hover" size="small">
      <template #trigger>
        <SvgIcon :path="getIcon(icon)" :size="24" />
      </template>
      {{ tooltip }}
    </NTooltip>
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NTooltip } from "naive-ui";
import SvgIcon from "../SvgIcon/index.vue";
import type { ActionButtonProps } from "./props";
import { getIcon } from "@/components/utils.ts";

const props = defineProps<ActionButtonProps>();

const handleClick = () => {
  if (props.action) {
    props.action()
  }
}
</script>

<style scoped>
.action-button {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  outline: none;
}

.action-button:hover {
  background-color: var(--naive-tiptap-btn--bg-hover);
}

.action-button.is-active {
  background-color: var(--naive-tiptap-btn--bg-active)
}
</style>
