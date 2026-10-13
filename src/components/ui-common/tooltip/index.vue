<template>
  <span
    ref="triggerEl"
    class="tiptap-tooltip-trigger"
    :aria-describedby="show ? tooltipId : undefined"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onEnter"
    @focusout="onLeave"
  >
    <slot name="trigger" />
  </span>
  <div
    v-if="show"
    :id="tooltipId"
    ref="floatingEl"
    class="tiptap-tooltip"
    role="tooltip"
    :style="floatingStyle"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onBeforeUnmount, useId, useTemplateRef } from "vue";
import type { Placement } from "@floating-ui/dom";
import { useFloating } from "@/composables/useFloating";

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

const triggerEl = useTemplateRef<HTMLElement>("triggerEl");
const floatingEl = useTemplateRef<HTMLElement>("floatingEl");
const show = ref(false);
// Keyboard focus on the slotted trigger bubbles up as focusin/focusout (see
// template), so Tab reveals the tooltip just like hover does; the id links
// trigger and tooltip for screen readers.
const tooltipId = useId();

const {
  floatingStyle,
  start: startFloating,
  stop: stopFloating,
} = useFloating(triggerEl, floatingEl, {
  placement: props.placement,
  offset: 8,
});

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
  font-size: var(--tiptap-font-size);
  line-height: 1.4;
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);
  white-space: nowrap;
  z-index: var(--tiptap-z-popover);
}
</style>
