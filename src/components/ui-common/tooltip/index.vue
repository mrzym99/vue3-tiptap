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
  <Teleport to="body">
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
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, inject, onBeforeUnmount, useId, useTemplateRef } from "vue";
import type { Placement } from "@floating-ui/dom";
import { useFloating } from "@/composables/useFloating";
import { themeSyncKey } from "@/components/ui-common/theme-provider/context";

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
// focusin bubbles from the slotted trigger, so keyboard focus reveals the
// tooltip too; the id links trigger and tooltip for screen readers
const tooltipId = useId();

const {
  floatingStyle,
  start: startFloating,
  stop: stopFloating,
} = useFloating(triggerEl, floatingEl, {
  placement: props.placement,
  offset: 8,
});

// Teleport leaves the ThemeProvider subtree — re-apply the theme vars
const syncTheme = inject(themeSyncKey, null);

watch(show, async (v) => {
  if (!v) {
    stopFloating();
    return;
  }
  await nextTick();
  if (floatingEl.value) syncTheme?.(floatingEl.value);
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
