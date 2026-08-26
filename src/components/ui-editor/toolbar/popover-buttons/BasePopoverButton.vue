<template>
  <ActionPopoverButton ref="dialogRef" :icon="icon" :tooltip="tooltip ?? ''" :disabled="disabled" :is-active="isActive">
    <template #default>
      <Form ref="formRef" :model="mergedModel" @submit="onFormSubmit">
        <FormItem name="src" :rules="[requiredRule]">
          <template #default="{ id }">
            <slot name="url" :id="id" :value="src" :set-value="setSrc" :submit="submit" />
          </template>
        </FormItem>
        <slot name="fields" :submit="submit" />
        <template #actions>
          <slot name="actions" :submit="submit" :src="src" :set-src="setSrc" />
          <div class="media-dialog-actions">
            <TiptapButton variant="primary" type="submit">
              {{ applyText }}
            </TiptapButton>
          </div>
        </template>
      </Form>
    </template>
  </ActionPopoverButton>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { computed, ref } from "vue";
import ActionPopoverButton from "@/components/ui-common/dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import type { FormRule } from "@/components/ui-common/form/types";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import { useTiptapLocale, type LocaleT } from "@/locales";

/**
 * Shared skeleton for media-insert dialog buttons (ActionPopoverButton + Form).
 *
 * Concrete media buttons build on this base:
 * - `url` slot: renders the URL input (v-model via `value`/`set-value`)
 * - `fields` slot: extra form fields (e.g. width/height)
 * - `actions` slot: extra actions (e.g. upload), rendered before submit
 *
 * `extraModel` exposes additional field value getters so the form can
 * validate/submit them; `buildPayload` assembles the final submit payload.
 */
const props = withDefaults(
  defineProps<{
    icon?: Component;
    tooltip?: string;
    applyLabel?: string;
    disabled?: boolean;
    isActive?: () => boolean;
    /** Extra field value getters merged into the form model. */
    extraModel?: Record<string, () => unknown>;
    /** Build the submit payload from all field values. */
    buildPayload?: (values: Record<string, unknown>) => Record<string, unknown>;
    /** Receive the final payload assembled by `buildPayload`. */
    onSubmit: (payload: any) => void;
    /** Received from extension button props; internal i18n is used instead */
    t?: LocaleT;
  }>(),
  {
    applyLabel: undefined,
    disabled: false,
    extraModel: () => ({}),
    buildPayload: (values: Record<string, unknown>) => values,
  },
);

const { t } = useTiptapLocale();

const dialogRef = ref<InstanceType<typeof ActionPopoverButton> | null>(null);
const formRef = ref<InstanceType<typeof Form> | null>(null);

const src = ref("");

const mergedModel = computed(() => ({
  src: () => src.value,
  ...props.extraModel,
}));

const applyText = computed(() => props.applyLabel ?? t("insert"));

const requiredRule: FormRule = {
  validator: (value) => typeof value === "string" && value.trim().length > 0,
  message: t("mediaUrlRequired"),
};

function setSrc(value: string) {
  src.value = value;
}

function onFormSubmit(values: Record<string, unknown>) {
  props.onSubmit(props.buildPayload(values));
  // Reset so the next open starts clean.
  src.value = "";
  dialogRef.value?.close();
}

/** Submit on Enter inside any field — the form validates first. */
function submit() {
  formRef.value?.formEl?.requestSubmit();
}

defineExpose({ setSrc });
</script>

<style lang="scss" scoped>
.media-dialog-actions {
  display: flex;
  gap: var(--tiptap-gap);
  justify-content: flex-end;
}
</style>
