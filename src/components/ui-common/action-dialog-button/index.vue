<template>
  <ActionButton :icon="icon" :tooltip="tooltip ?? ''" :disabled="disabled" :is-active="isActive" :action="open">
    <template #suffix>
      <slot name="suffix" />
    </template>
  </ActionButton>
  <Dialog v-model:show="show" :title="title" :t="t" @update:show="emitClosed">
    <slot :close="close" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, type Component } from "vue";
import Dialog from "@/components/ui-common/dialog/index.vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { ActionButtonProps } from "@/components/ui-common/action-button/props";
import type { TranslateFn } from "@/types";

/** Action button that opens a centered modal dialog; the slot receives `{ close }`. */
defineProps<{
  icon: Component;
  tooltip?: string;
  disabled?: ActionButtonProps["disabled"];
  isActive?: ActionButtonProps["isActive"];
  /** Dialog title (header text) */
  title?: string;
  t: TranslateFn;
}>();

const emit = defineEmits<{ closed: []; opened: [] }>();

const show = ref(false);

/** Dismiss the dialog (call from the slot content after submitting) */
function close() {
  show.value = false;
}

function open() {
  show.value = true;
  emit("opened");
}

function emitClosed(value: boolean) {
  if (!value) emit("closed");
}

defineExpose({ close, show });
</script>
