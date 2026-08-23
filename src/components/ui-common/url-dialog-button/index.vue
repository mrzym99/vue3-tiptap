<template>
  <Popover v-model:show="show" trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton
        :editor="editor"
        :icon="icon"
        :tooltip="tooltip ?? ''"
        :disabled="disabled"
        :is-active="isActive"
      />
    </template>
    <div class="url-dialog-popover">
      <TiptapInput
        v-model="value"
        :placeholder="placeholder"
        @keydown.enter.prevent="submit"
      />
      <div class="url-dialog-actions">
        <TiptapButton variant="primary" @click="submit">
          {{ applyText }}
        </TiptapButton>
      </div>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import Popover from "@/components/ui-common/popover/index.vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
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
