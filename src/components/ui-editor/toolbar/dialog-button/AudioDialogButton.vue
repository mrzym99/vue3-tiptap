<template>
  <BaseDialogButton
    :editor="editor"
    :icon="icon"
    :tooltip="tooltip ?? ''"
    :apply-label="applyLabel"
    :disabled="disabled"
    :is-active="isActive"
    :on-submit="onSubmit"
    :t="t"
  >
    <template #url="{ id, value, setValue, submit }">
      <TiptapInput
        :id="id"
        :model-value="value"
        :placeholder="placeholder"
        @update:model-value="setValue"
        @keydown.enter.prevent="submit"
      />
    </template>
  </BaseDialogButton>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import BaseDialogButton from "@/components/ui-editor/toolbar/dialog-button/BaseDialogButton.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import type { LocaleT } from "@/locales";

/**
 * Audio insert button: plain URL.
 */
const props = withDefaults(
  defineProps<{
    editor: Editor;
    icon?: Component;
    tooltip?: string;
    placeholder?: string;
    applyLabel?: string;
    disabled?: boolean;
    isActive?: () => boolean;
    onSubmit: (payload: { src: string }) => void;
    /** Received from extension button props; internal i18n is used instead */
    t?: LocaleT;
  }>(),
  {
    placeholder: "",
    applyLabel: undefined,
    disabled: false,
  },
);
</script>
