<template>
  <NPopover
    v-model:show="show"
    trigger="click"
    placement="bottom-start"
    :show-arrow="false"
  >
    <template #trigger>
      <NButton
        class="url-dialog-button"
        :class="{ 'is-active': isActive?.() }"
        :disabled="disabled"
      >
        <component :is="icon" size="24px" />
      </NButton>
    </template>
    <div class="url-dialog-popover">
      <NInput
        v-model:value="value"
        size="small"
        :placeholder="placeholder"
        @keydown.enter.prevent="submit"
      />
      <div class="url-dialog-actions">
        <NButton size="tiny" type="primary" @click="submit">
          {{ applyText }}
        </NButton>
      </div>
    </div>
  </NPopover>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import { NButton, NInput, NPopover } from "naive-ui";
import { useI18n } from "vue-i18n";

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
  }>(),
  {
    applyLabel: undefined,
  },
);

const { t } = useI18n();

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
  min-width: var(--naive-tiptap-btn-size);
  height: var(--naive-tiptap-btn-size);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--naive-tiptap-padding-sm);
  border-radius: var(--naive-tiptap-border-radius-sm);
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.url-dialog-button:hover:not(:disabled) {
  background-color: var(--naive-tiptap-btn--bg-hover);
}

.url-dialog-button.is-active {
  background-color: var(--naive-tiptap-btn--bg-active);
}

.url-dialog-popover {
  display: flex;
  flex-direction: column;
  gap: var(--naive-tiptap-gap);
}

.url-dialog-actions {
  display: flex;
  gap: var(--naive-tiptap-gap);
  justify-content: flex-end;
}
</style>
