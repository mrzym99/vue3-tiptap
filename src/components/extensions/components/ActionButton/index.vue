<template>
  <NButton
    :class="['action-button', { 'is-active': isActive() }]"
    :disabled="disabled"
    text
    @click="action"
  >
    <NTooltip trigger="hover" size="small">
      <template #trigger>
        <SvgIcon :path="icon" :size="24" />
      </template>
      {{ text }}
    </NTooltip>
    <slot />
  </NButton>
</template>

<script setup lang="ts">
import { NButton, NTooltip } from "naive-ui";
import SvgIcon from "../SvgIcon/index.vue";

type ButtonProps = {
  disabled: boolean;
  icon: string;
  text: string;
  isActive: () => boolean;
  action: () => void;
};
const props = defineProps<ButtonProps>();
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
  color: var(--n-text-color) !important;
  background-color: #f0f0f0 !important;
}

.action-button.is-active {
  background-color: #e0e0e0 !important;
}
</style>
