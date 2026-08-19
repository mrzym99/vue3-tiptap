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
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  type Placement,
  type Middleware,
} from "@floating-ui/dom";

const props = withDefaults(
  defineProps<{
    /** How the popover is toggled */
    trigger?: "click" | "hover";
    /** Placement relative to the trigger */
    placement?: Placement;
    /** Gap between trigger and popover */
    offset?: number;
    /** Disable opening */
    disabled?: boolean;
    /** Controlled visibility (v-model:show) */
    show?: boolean;
  }>(),
  {
    trigger: "click",
    placement: "bottom-start",
    offset: 4,
    disabled: false,
    show: false,
  },
);

const emit = defineEmits<{ "update:show": [value: boolean] }>();

const triggerEl = ref<HTMLElement | null>(null);
const floatingEl = ref<HTMLElement | null>(null);
const show = ref(props.show);
// `position: fixed` keeps the popover inside the component tree (CSS vars
// and scoped styles keep working) while escaping overflow clipping.
const floatingStyle = ref<Record<string, string>>({
  position: "fixed",
  left: "0px",
  top: "0px",
  zIndex: "var(--tiptap-z-popover)",
});

let cleanupAutoUpdate: (() => void) | null = null;

function stopAutoUpdate() {
  cleanupAutoUpdate?.();
  cleanupAutoUpdate = null;
}

// External (v-model:show) changes mirror into internal state.
watch(
  () => props.show,
  (v) => {
    if (show.value !== v) show.value = v;
  },
);

watch(show, async (v) => {
  emit("update:show", v);
  stopAutoUpdate();
  if (!v) return;
  // The floating element is rendered by `v-if="show"` — it only exists after
  // the next DOM flush, so wait for nextTick before measuring/positioning.
  await nextTick();
  if (!triggerEl.value || !floatingEl.value) return;
  await position();
  // Keep following scroll / resize / content changes.
  cleanupAutoUpdate = autoUpdate(
    triggerEl.value,
    floatingEl.value,
    () => position(),
    { ancestorScroll: true, ancestorResize: true, elementResize: true },
  );
});

watch(
  () => props.disabled,
  (v) => {
    if (v) show.value = false;
  },
);

async function position() {
  if (!triggerEl.value || !floatingEl.value) return;
  const middleware: Middleware[] = [
    offset(props.offset),
    flip(),
    shift({ padding: 8 }),
  ];
  const { x, y } = await computePosition(triggerEl.value, floatingEl.value, {
    placement: props.placement,
    strategy: "fixed",
    middleware,
  });
  floatingStyle.value = {
    ...floatingStyle.value,
    left: `${x}px`,
    top: `${y}px`,
  };
}

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
  hoverTimer = setTimeout(() => (show.value = true), 120);
}

function onLeave() {
  if (props.trigger !== "hover") return;
  clearHoverTimer();
  hoverTimer = setTimeout(() => (show.value = false), 120);
}

function onDocMousedown(e: MouseEvent) {
  if (!show.value) return;
  const target = e.target as Node;
  if (triggerEl.value?.contains(target) || floatingEl.value?.contains(target))
    return;
  show.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") show.value = false;
}

onMounted(() => {
  document.addEventListener("mousedown", onDocMousedown);
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocMousedown);
  document.removeEventListener("keydown", onKeydown);
  clearHoverTimer();
  stopAutoUpdate();
});
</script>

<style lang="scss" scoped>
.tiptap-popover-trigger {
  display: inline-flex;
}

.tiptap-popover {
  background-color: var(--tiptap-popover-bg);
  border: 1px solid var(--tiptap-popover-border);
  border-radius: var(--tiptap-border-radius-sm);
  box-shadow: var(--tiptap-popover-shadow);
  color: var(--tiptap-color-text);
  padding: var(--tiptap-padding-sm);
}
</style>
