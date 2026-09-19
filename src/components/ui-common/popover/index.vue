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
  <div
    v-if="show"
    ref="floatingEl"
    class="tiptap-popover"
    :style="floatingStyle"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click.capture="captureClickItem"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { useFloating } from "@/composables/useFloating";
import type { PopoverProps } from "./props";

const props = withDefaults(defineProps<PopoverProps>(), {
  trigger: "click",
  placement: "bottom-start",
  offset: 4,
  disabled: false,
  show: false,
  hideOnClick: true,
});

const emit = defineEmits<{ "update:show": [value: boolean] }>();

const triggerEl = ref<HTMLElement | null>(null);
const floatingEl = ref<HTMLElement | null>(null);
const show = ref(props.show);

const {
  floatingStyle,
  start: startFloating,
  stop: stopFloating,
} = useFloating(triggerEl, floatingEl, {
  placement: props.placement,
  offset: props.offset,
});

// External (v-model:show) changes mirror into internal state.
watch(
  () => props.show,
  (v) => {
    if (show.value !== v) show.value = v;
  },
);

watch(show, async (v) => {
  emit("update:show", v);
  if (!v) {
    stopFloating();
    return;
  }
  // The floating element is rendered by `v-if="show"` — it only exists after
  // the next DOM flush, so wait for nextTick before measuring/positioning.
  await nextTick();
  startFloating();
});

watch(
  () => props.disabled,
  (v) => {
    if (v) doClose();
  },
);

// --- interactions ---
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

// click-mode only: doClose on outside click / Esc
function onDocMousedown(e: MouseEvent) {
  if (!show.value || props.trigger !== "click") return;
  const target = e.target as Node;
  if (triggerEl.value?.contains(target) || floatingEl.value?.contains(target)) return;
  doClose();
}

function onKeydown(e: KeyboardEvent) {
  if (props.trigger === "click" && e.key === "Escape") doClose();
}

function captureClickItem() {
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
  padding: var(--tiptap-padding-sm);
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
