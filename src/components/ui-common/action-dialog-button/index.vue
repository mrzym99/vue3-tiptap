<template>
  <ActionButton
    :icon="icon"
    :tooltip="tooltip ?? ''"
    :disabled="disabled"
    :is-active="isActive"
    :action="open"
  >
    <template #suffix>
      <slot name="suffix" />
    </template>
  </ActionButton>
  <Dialog v-model:show="show" :title="title" @update:show="emitClosed">
    <slot :close="close" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref, type Component } from "vue";
import Dialog from "@/components/ui-common/dialog/index.vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { ActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * Action button that opens a centered modal dialog.
 *
 * Mirrors the (popover-based) ActionPopoverButton API: trigger is an
 * {@link ActionButton}, the body is customised via the default slot which
 * receives `{ close }`, and `close`/`show` are exposed for parent refs.
 * The extra `title` prop names the dialog; `opened` fires after the dialog
 * opens (so callers can snapshot editor state / prefill fields) and `closed`
 * after any close (submit, cancel, Esc, mask click) so callers can restore
 * editor focus.
 */
defineProps<{
  icon: Component;
  tooltip?: string;
  disabled?: ActionButtonProps["disabled"];
  isActive?: ActionButtonProps["isActive"];
  /** Dialog title (header text) */
  title?: string;
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
