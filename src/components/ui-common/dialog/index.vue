<template>
  <!-- Host transforms/filters can't break a body-level fixed overlay -->
  <Teleport to="body">
    <div v-if="show" ref="overlayEl" class="tiptap-dialog-overlay" @mousedown.self="onOverlayMousedown">
      <div
        ref="panelEl"
        class="tiptap-dialog"
        :style="{ width: width }"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        tabindex="-1"
        @keydown="onPanelKeydown"
      >
        <div class="tiptap-dialog-header">
          <span class="tiptap-dialog-title">{{ title }}</span>
          <button type="button" class="tiptap-dialog-close" :aria-label="t('close')" @click="doClose">
            <XIcon />
          </button>
        </div>
        <div class="tiptap-dialog-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="tiptap-dialog-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, inject, watch, useTemplateRef } from "vue";
import XIcon from "~icons/lucide/x";
import { applyTheme } from "@/theme";
import { themeSyncKey } from "@/components/ui-common/theme-provider/context";
import type { DialogProps } from "./props";

const props = withDefaults(defineProps<DialogProps>(), {
  t: undefined,
  show: false,
  title: undefined,
  width: "400px",
  /** clicking the overlay backdrop does NOT close by default */
  closeOnClickModal: false,
});

/** Standalone use (no editor root): fall back to identity — raw keys shown */
const t = computed(() => props.t ?? ((key: string) => key));

const emit = defineEmits<{ "update:show": [value: boolean] }>();

const panelEl = useTemplateRef<HTMLElement>("panelEl");
const overlayEl = useTemplateRef<HTMLElement>("overlayEl");

// Teleport leaves the ThemeProvider subtree — re-apply the theme vars.
// Standalone use (no editor root above): apply the light/dark theme ourselves,
// following the host page's `html.dark` class when present.
const syncTheme = inject(themeSyncKey, null) ?? ((el: HTMLElement) => {
  applyTheme(document.documentElement.classList.contains("dark") ? "dark" : "light", el);
});

function doClose() {
  emit("update:show", false);
}

function onOverlayMousedown() {
  if (props.closeOnClickModal) doClose();
}

let previouslyFocused: HTMLElement | null = null;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/** Escape closes; Tab cycles inside the modal. */
function onPanelKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    doClose();
    return;
  }
  if (e.key !== "Tab") return;
  trapFocus(e);
}

function trapFocus(e: KeyboardEvent) {
  const panel = panelEl.value;
  if (!panel) return;
  const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  if (focusables.length === 0) {
    e.preventDefault();
    panel.focus();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (active === first || active === panel)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

// Lock scroll + focus the panel on open, restore the trigger's focus on
// close; `immediate` covers mounting while already open
watch(
  () => props.show,
  (visible) => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    if (visible) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      nextTick(() => {
        if (overlayEl.value) syncTheme?.(overlayEl.value);
        panelEl.value?.focus();
      });
      return;
    }
    previouslyFocused?.focus();
    previouslyFocused = null;
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.documentElement.style.overflow = "";
});
</script>

<style lang="scss" scoped>
.tiptap-dialog-overlay {
  align-items: center;
  background-color: var(--tiptap-dialog-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: var(--tiptap-z-dialog);
}

.tiptap-dialog {
  background-color: var(--tiptap-popover-bg);
  border: 1px solid var(--tiptap-popover-border);
  border-radius: var(--tiptap-border-radius-lg);
  box-shadow: var(--tiptap-popover-shadow);
  color: var(--tiptap-popover-text);
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  outline: none;
  transform-origin: center;
  animation: tiptap-dialog-in 140ms ease-out;

  &:focus {
    outline: none;
  }
}

.tiptap-dialog-header {
  align-items: center;
  border-bottom: 1px solid var(--tiptap-popover-border);
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: space-between;
  padding: var(--tiptap-padding-lg);
}

.tiptap-dialog-title {
  font-size: var(--tiptap-font-size);
  font-weight: 600;
}

.tiptap-dialog-close {
  align-items: center;
  background: none;
  border: none;
  border-radius: var(--tiptap-border-radius-sm);
  color: var(--tiptap-color-text-muted);
  cursor: pointer;
  display: flex;
  padding: var(--tiptap-padding-xs);

  &:hover {
    background-color: var(--tiptap-color-bg-hover);
    color: var(--tiptap-color-text);
  }
}

.tiptap-dialog-body {
  padding: var(--tiptap-padding-lg);
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.tiptap-dialog-footer {
  border-top: 1px solid var(--tiptap-popover-border);
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
  padding: var(--tiptap-padding-lg);
}

@keyframes tiptap-dialog-in {
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
  .tiptap-dialog {
    animation: none;
  }
}
</style>
