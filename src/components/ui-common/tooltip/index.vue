<template>
  <span
    ref="triggerEl"
    class="tiptap-tooltip-trigger"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot name="trigger" />
  </span>
  <div
    v-if="show"
    ref="floatingEl"
    class="tiptap-tooltip"
    :style="floatingStyle"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeUnmount } from "vue";
import type { Placement } from "@floating-ui/dom";
import { useFloating } from "@/components/ui-common/floating/useFloating";

const props = withDefaults(
  defineProps<{
    placement?: Placement;
    disabled?: boolean;
  }>(),
  {
    placement: "top",
    disabled: false,
  },
);

const triggerEl = ref<HTMLElement | null>(null);
const floatingEl = ref<HTMLElement | null>(null);
const show = ref(false);

const { floatingStyle, start: startFloating, stop: stopFloating } = useFloating(
  triggerEl,
  floatingEl,
  { placement: props.placement, offset: 6 },
);

watch(show, async (v) => {
  if (!v) {
    stopFloating();
    return;
  }
  await nextTick();
  startFloating();
});

// --- hover interaction (no click / outside-click / Esc behavior) ---
let timer: number | null = null;

function clearTimer() {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

function onEnter() {
  if (props.disabled) return;
  clearTimer();
  timer = setTimeout(() => (show.value = true), 120);
}

function onLeave() {
  clearTimer();
  timer = setTimeout(() => (show.value = false), 80);
}

onBeforeUnmount(() => {
  clearTimer();
  stopFloating();
});
</script>

<style lang="scss" scoped>
.tiptap-tooltip-trigger {
  display: inline-flex;
}

.tiptap-tooltip {
  background-color: var(--tiptap-tooltip-bg);
  border-radius: var(--tiptap-tooltip-radius);
  box-shadow: var(--tiptap-popover-shadow);
  color: var(--tiptap-tooltip-text);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.4;
  padding: var(--tiptap-padding-xs) var(--tiptap-padding-sm);
  white-space: nowrap;
  z-index: var(--tiptap-z-popover);
}
</style>
