<template>
  <ActionDialogButton
    :editor="editor"
    :icon="icon"
    :tooltip="tooltip ?? ''"
    :disabled="disabled"
    :is-active="isActive"
  >
    <template #default="{ close }">
      <Form
        ref="formRef"
        :model="model"
        @submit="
          (values) => {
            onSubmitInner(values);
            close();
          }
        "
      >
        <FormItem name="src" :rules="[requiredRule]">
          <template #default="{ id }">
            <TiptapInput
              :id="id"
              v-model="src"
              :placeholder="placeholder"
              @keydown.enter.prevent="submit"
            />
          </template>
        </FormItem>
        <div class="media-dialog-form-dimensions" v-if="resizeAble">
          <FormItem name="width" class="media-dialog-form-field">
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
          <FormItem name="height" class="media-dialog-form-field">
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
        <template #actions>
          <TiptapButton variant="primary" type="submit">
            {{ applyText }}
          </TiptapButton>
        </template>
      </Form>
    </template>
  </ActionDialogButton>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Editor } from "@tiptap/core";
import ActionDialogButton from "@/components/ui-common/dialog-button/index.vue";
import { ref } from "vue";
import Form from "@/components/ui-common/form/index.vue";
import type { FormRule } from "@/components/ui-common/form/types";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import { useTiptapLocale, type LocaleT } from "@/locales";

/**
 * Toolbar button that opens a media-insert dialog (URL + optional width/height).
 * The form validates (URL required) before submitting `{ src, width?, height? }`.
 */
const props = withDefaults(
  defineProps<{
    editor: Editor;
    icon?: Component;
    tooltip?: string;
    placeholder?: string;
    applyLabel?: string;
    disabled?: boolean;
    resizeAble?: boolean;
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
    resizeAble: false,
  },
);

const emit = defineEmits<{
  submit: [payload: { src: string; width?: number; height?: number }];
}>();

const { t } = useTiptapLocale();

const formRef = ref<InstanceType<typeof Form> | null>(null);

const src = ref("");
const width = ref("");
const height = ref("");

const model = {
  src: () => src.value,
  width: () => width.value,
  height: () => height.value,
};

const applyText = computed(() => props.applyLabel ?? t("insert"));

const requiredRule: FormRule = {
  validator: (value) => typeof value === "string" && value.trim().length > 0,
  message: t("mediaUrlRequired"),
};

const toNumber = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

function onSubmitInner(values: Record<string, unknown>) {
  emit("submit", {
    src: String(values.src).trim(),
    width: toNumber(String(values.width ?? "")),
    height: toNumber(String(values.height ?? "")),
  });
}

/** Submit on Enter inside any field — the form validates first. */
function submit() {
  formRef.value?.formEl?.requestSubmit();
}
</script>

<style lang="scss" scoped>
.media-dialog-form-dimensions {
  display: flex;
  gap: var(--tiptap-gap);
}

.media-dialog-form-field {
  flex: 1;
}
</style>
