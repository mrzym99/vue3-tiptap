<template>
  <Popover
    trigger="hover"
    :placement="placement"
    :offset="6"
    :disabled="disabled"
  >
    <template #trigger>
      <slot name="trigger" />
    </template>
    <div class="tiptap-tooltip-text">
      <slot />
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import type { Placement } from "@floating-ui/dom";
import Popover from "@/components/ui-common/popover/index.vue";

withDefaults(
  defineProps<{
    placement?: Placement;
    disabled?: boolean;
  }>(),
  {
    placement: "top",
    disabled: false,
  },
);
</script>

<style lang="scss" scoped>
.tiptap-tooltip-text {
  background-color: var(--tiptap-tooltip-bg);
  border-radius: var(--tiptap-tooltip-radius);
  color: var(--tiptap-tooltip-text);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.4;
  padding: var(--tiptap-padding-xs) var(--tiptap-padding-sm);
  white-space: nowrap;
}
</style>
