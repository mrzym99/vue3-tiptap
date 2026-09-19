<template>
  <div v-if="show" class="tiptap-dialog-overlay" @mousedown.self="doClose">
    <div
      ref="panelEl"
      class="tiptap-dialog"
      :style="{ width: width }"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      tabindex="-1"
      @keydown.escape.prevent="doClose"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import XIcon from "~icons/lucide/x";
import { useTiptapLocale } from "@/locales";
import type { DialogProps } from "./props";

const props = withDefaults(defineProps<DialogProps>(), {
  show: false,
  title: undefined,
  width: "400px",
});

const emit = defineEmits<{ "update:show": [value: boolean] }>();

const { t } = useTiptapLocale();

const panelEl = ref<HTMLElement | null>(null);

function doClose() {
  emit("update:show", false);
}

// Focus the panel when opened so Esc works without a prior click inside;
// restore page scroll when closed.
watch(
  () => props.show,
  (visible) => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    if (!visible) return;
    nextTick(() => panelEl.value?.focus());
  },
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
