<template>
  <Popover v-model:show="show" trigger="click" placement="bottom-start">
    <template #trigger>
      <button
        type="button"
        class="url-dialog-button"
        :class="{ 'is-active': isActive?.() }"
        :disabled="disabled"
      >
        <component :is="icon" size="24px" />
      </button>
    </template>
    <div class="url-dialog-popover">
      <input
        v-model="value"
        class="tiptap-input"
        :placeholder="placeholder"
        @keydown.enter.prevent="submit"
      />
      <div class="url-dialog-actions">
        <button
          type="button"
          class="tiptap-btn tiptap-btn--primary"
          @click="submit"
        >
          {{ applyText }}
        </button>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import Popover from "@/components/ui-common/popover/index.vue";
import { useTiptapLocale, type LocaleT } from "@/locales";

const props = withDefaults(
  defineProps<{
    editor: Editor;
    icon?: Component;
    tooltip?: string;
    placeholder?: string;
    applyLabel?: string;
    disabled?: boolean;
    isActive?: () => boolean;
    onSubmit: (url: string) => void;
    /** Received from extension button props; internal i18n is used instead */
    t?: LocaleT;
  }>(),
  {
    applyLabel: undefined,
  },
);

const { t } = useTiptapLocale();

const show = ref(false);
const value = ref("");

const applyText = computed(() => props.applyLabel ?? t("insert"));

function submit() {
  const url = value.value.trim();
  if (!url) return;
  props.onSubmit(url);
  value.value = "";
  show.value = false;
}
</script>

<style lang="scss" scoped>
.url-dialog-button {
  align-items: center;
  background: none;
  color: var(--tiptap-color-text);
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  cursor: pointer;
  display: inline-flex;
  height: var(--tiptap-btn-size);
  justify-content: center;
  min-width: var(--tiptap-btn-size);
  outline: none;
  padding: var(--tiptap-padding-sm);

  &:hover:not(:disabled) {
    background-color: var(--tiptap-btn--bg-hover);
  }

  &.is-active {
    background-color: var(--tiptap-btn--bg-active);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.url-dialog-popover {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
}

.url-dialog-actions {
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
}
</style>
