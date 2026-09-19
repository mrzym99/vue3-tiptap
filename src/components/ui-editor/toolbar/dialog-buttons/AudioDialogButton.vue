<template>
  <ActionDialogButton
    ref="dialog"
    :icon="RiVolumeUpLine"
    :tooltip="t('audio')"
    :title="t('audio')"
    @closed="props.editor.commands.focus()"
  >
    <Form ref="form" :model="model" @submit="onSubmit">
      <FormItem name="src" :rules="rules">
        <template #default="{ id }">
          <TiptapInput
            :id="id"
            :model-value="src"
            :placeholder="t('audioPlaceholder')"
            @update:model-value="src = $event"
            @keydown.enter.prevent="submit"
          />
        </template>
      </FormItem>
      <template #actions>
        <TiptapButton @click="dialogRef?.close()">{{ t("cancel") }}</TiptapButton>
        <TiptapButton variant="primary" type="submit">{{ t("insert") }}</TiptapButton>
      </template>
    </Form>
  </ActionDialogButton>
</template>

<script setup lang="ts">
import RiVolumeUpLine from "~icons/lucide/volume-2";
import { useTemplateRef } from "vue";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import { isHttpUrl, useMediaForm } from "../../../../composables/useMediaForm";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * Audio insert dialog: plain URL.
 */
const props = defineProps<EXTActionButtonProps>();
const dialogRef = useTemplateRef<InstanceType<typeof ActionDialogButton>>("dialog");
const formEl = useTemplateRef<InstanceType<typeof Form>>("form");
const { src, model, rules, submit, onSubmit } = useMediaForm(
  props,
  (payload) => props.editor.chain().focus().setAudio({ src: payload.src }).run(),
  dialogRef,
  formEl,
  isHttpUrl,
);
</script>
