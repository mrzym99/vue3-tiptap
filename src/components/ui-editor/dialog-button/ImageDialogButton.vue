<template>
  <BaseDialogButton
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
      <Tabs v-model="activeTab" :tabs="tabs">
        <!-- URL tab -->
        <template #url>
          <TiptapInput
            :id="id"
            :model-value="value"
            :placeholder="placeholder"
            @update:model-value="setValue"
            @keydown.enter.prevent="submit"
          />
        </template>
        <!-- Upload tab -->
        <template #upload>
          <ImageUpload
            v-if="hasUpload"
            :editor="editor"
            @success="(url) => setValue(url)"
          />
          <span v-else class="image-dialog-upload-disabled">
            {{ t("imageUploadUnavailable") }}
          </span>
        </template>
      </Tabs>
    </template>
    <template #fields="{ submit }">
      <div class="image-dialog-dimensions">
        <FormItem name="width" class="image-dialog-field">
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
        <FormItem name="height" class="image-dialog-field">
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
  </BaseDialogButton>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import { computed, ref } from "vue";
import BaseDialogButton from "@/components/ui-editor/dialog-button/BaseDialogButton.vue";
import ImageUpload from "@/components/ui-editor/dialog-button/ImageUpload.vue";
import Tabs, { type TabItem } from "@/components/ui-common/tabs/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import { useTiptapLocale, type LocaleT } from "@/locales";
import type { ImageOptions } from "@/components/extensions/Image";

/**
 * Image insert button with two tabs:
 * - "URL": paste an image URL
 * - "Upload": pick a file, upload via the `image` extension's `upload` option
 * Both tabs share the width/height fields below.
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

/** Whether the `image` extension is configured with an upload callback. */
const hasUpload = computed(() => {
  const ext = props.editor.extensionManager.extensions.find(
    (e) => e.name === "image",
  );
  return Boolean((ext?.options as ImageOptions | undefined)?.upload);
});

const activeTab = ref("url");
const tabs: TabItem[] = [
  { name: "url", label: t("imageTabUrl") },
  { name: "upload", label: t("imageTabUpload") },
];

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
.image-dialog-dimensions {
  display: flex;
  gap: var(--tiptap-gap);
}

.image-dialog-field {
  flex: 1;
}

.image-dialog-upload-disabled {
  color: var(--tiptap-color-text-muted);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.4;
}
</style>
