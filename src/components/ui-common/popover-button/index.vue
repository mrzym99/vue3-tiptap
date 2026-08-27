<template>
  <Popover v-model:show="show" trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton :icon="icon" :tooltip="tooltip ?? ''" :disabled="disabled" :is-active="isActive">
        <template #suffix>
          <slot name="suffix" />
        </template>
      </ActionButton>
    </template>
    <slot :close="close" />
  </Popover>
</template>

<script setup lang="ts">
import Popover from "@/components/ui-common/popover/index.vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { PopoverButtonProps } from "./props";

/**
 * Generic action button that opens a popover dialog.
 *
 * - trigger is an {@link ActionButton} (icon + tooltip + active state)
 * - the popover body is fully customised via the default slot
 * - the slot receives `{ close }` so custom forms can dismiss the popover
 *
 * Example:
 * ```vue
 * <ActionPopoverButton :icon="icon" :tooltip="t('image')">
 *   <template #default="{ close }">
 *     <MyForm @submit="(data) => { onSubmit(data); close() }" />
 *   </template>
 * </ActionPopoverButton>
 * ```
 */
const props = defineProps<PopoverButtonProps>();

const show = ref(false);

/** Dismiss the popover (call from the slot content after submitting) */
function close() {
  show.value = false;
}

defineExpose({ close, show });
</script>
