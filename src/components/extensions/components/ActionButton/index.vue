<template>
  <el-button :class="['action-button', { 'is-active': isActive() }]" :disabled="disabled" @click="action">
    <slot>
      <SvgIcon v-if="icon" :icon="icon" />
      <span v-else>{{ text }}</span>
    </slot>
  </el-button>
</template>

<script setup lang="ts">
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
}

.is-active {
  background-color: #e0e0e0;
}
</style>
