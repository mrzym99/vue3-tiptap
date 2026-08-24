<template>
  <BasePopoverButton
    :editor="editor"
    :icon="icon"
    :tooltip="tooltip ?? ''"
    :apply-label="applyLabel"
    :disabled="disabled"
    :is-active="isActive"
    :extra-model="extraModel"
    :build-payload="buildPayload"
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
    <template #fields="{ submit }">
      <div class="video-dialog-dimensions">
        <FormItem name="width" class="video-dialog-field">
          <template #default="{ id }">
            <TiptapInput
              :id="id"
              v-model="width"
              type="number"
              min="0"
              :placeholder="t('mediaWidth')"
              @keydown.enter.prevent="submit"
            />
          </template>
        </FormItem>
        <FormItem name="height" class="video-dialog-field">
          <template #default="{ id }">
            <TiptapInput
              :id="id"
              v-model="height"
              type="number"
              min="0"
              :placeholder="t('mediaHeight')"
              @keydown.enter.prevent="submit"
            />
          </template>
        </FormItem>
      </div>
    </template>
  </BasePopoverButton>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import { ref } from "vue";
import BasePopoverButton from "@/components/ui-editor/toolbar/popover-buttons/BasePopoverButton.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import { useTiptapLocale, type LocaleT } from "@/locales";

/**
 * Video insert button: URL (Bilibili/Tencent/Youku/iQIYI or generic) +
 * optional width/height. The extension converts the URL to an embed player.
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
    onSubmit: (payload: {
      src: string;
      width?: number;
      height?: number;
    }) => void;
    /** Received from extension button props; internal i18n is used instead */
    t?: LocaleT;
  }>(),
  {
    placeholder: "",
    applyLabel: undefined,
    disabled: false,
  },
);

const { t } = useTiptapLocale();

const width = ref("");
const height = ref("");

const extraModel = {
  width: () => width.value,
  height: () => height.value,
};

const toNumber = (value: unknown) => {
  const n = Number(String(value ?? ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

function buildPayload(values: Record<string, unknown>) {
  return {
    src: String(values.src).trim(),
    width: toNumber(values.width),
    height: toNumber(values.height),
  };
}
</script>

<style lang="scss" scoped>
.video-dialog-dimensions {
  display: flex;
  gap: var(--tiptap-gap);
}

.video-dialog-field {
  flex: 1;
}
</style>
