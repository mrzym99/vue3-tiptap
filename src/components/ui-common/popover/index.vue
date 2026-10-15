<template>
  <div
    ref="triggerEl"
    class="tiptap-popover-trigger"
    @click="onTriggerClick"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot name="trigger" />
  </div>
  <Teleport to="body">
    <div
      v-if="show"
      ref="floatingEl"
      class="tiptap-popover"
      :style="floatingStyle"
      @mousedown.stop
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @click.stop="captureClickItem"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { watch, nextTick, inject, onMounted, onBeforeUnmount, useTemplateRef } from "vue";
import { useFloating } from "@/composables/useFloating";
import { themeSyncKey } from "@/components/ui-common/theme-provider/context";
import type { PopoverProps } from "./props";

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: "click",
  placement: "bottom-start",
  offset: 4,
  disabled: false,
  hideOnClick: true,
});

const show = defineModel<boolean>("show", { default: false });

const triggerEl = useTemplateRef<HTMLElement>("triggerEl");
const floatingEl = useTemplateRef<HTMLElement>("floatingEl");

const {
  floatingStyle,
  start: startFloating,
  stop: stopFloating,
} = useFloating(triggerEl, floatingEl, {
  placement: props.placement,
  offset: props.offset,
});

// Teleport leaves the ThemeProvider subtree — re-apply the theme vars
const syncTheme = inject(themeSyncKey, null);

watch(show, async (v) => {
  if (!v) {
    stopFloating();
    return;
  }
  // The v-if element only exists after the next DOM flush
  await nextTick();
  if (floatingEl.value) syncTheme?.(floatingEl.value);
  startFloating();
});

watch(
  () => props.disabled,
  (v) => {
    if (v) doClose();
  },
);

let hoverTimer: number | null = null;

function clearHoverTimer() {
  if (hoverTimer !== null) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
}

function onTriggerClick() {
  if (props.disabled || props.trigger !== "click") return;
  show.value = !show.value;
}

function onEnter() {
  if (props.trigger !== "hover") return;
  clearHoverTimer();
  hoverTimer = setTimeout(() => doOpen(), 120);
}

function onLeave() {
  if (props.trigger !== "hover") return;
  clearHoverTimer();
  hoverTimer = setTimeout(() => doClose(), 120);
}

function onDocMousedown(e: MouseEvent) {
  if (!show.value || props.trigger !== "click") return;
  const target = e.target as Node;
  if (triggerEl.value?.contains(target) || floatingEl.value?.contains(target)) return;
  doClose();
}

function onKeydown(e: KeyboardEvent) {
  if (props.trigger === "click" && e.key === "Escape") doClose();
}

function captureClickItem(e: MouseEvent) {
  // The owner closes the popover itself when done
  const target = e.target as HTMLElement | null;
  if (target?.closest("[data-popover-keep-open]")) return;
  props.hideOnClick && doClose();
}

function doClose() {
  show.value = false;
  clearHoverTimer();
}

function doOpen() {
  show.value = true;
}

onMounted(() => {
  document.addEventListener("mousedown", onDocMousedown);
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocMousedown);
  document.removeEventListener("keydown", onKeydown);
  clearHoverTimer();
  stopFloating();
});
</script>

<style lang="scss" scoped>
.tiptap-popover-trigger {
  display: inline-flex;
}

.tiptap-popover {
  background-color: var(--tiptap-popover-bg);
  border: 1px solid var(--tiptap-popover-border);
  border-radius: var(--tiptap-border-radius-md);
  box-shadow: var(--tiptap-popover-shadow);
  color: var(--tiptap-popover-text);
  padding: var(--tiptap-padding-md);
  transform-origin: var(--tiptap-popover-origin, top);
  animation: tiptap-popover-in 140ms ease-out;
}

@keyframes tiptap-popover-in {
  from {
    opacity: 0;
    transform: translateY(4px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tiptap-popover {
    animation: none;
  }
}
</style>
