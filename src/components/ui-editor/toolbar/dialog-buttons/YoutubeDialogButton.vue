<template>
  <ActionDialogButton
    ref="dialog"
    :icon="RiYoutubeLine"
    :tooltip="t('youtube')"
    :title="t('youtube')"
    @closed="props.editor.commands.focus()"
  >
    <Form ref="form" :model="model" @submit="onSubmit">
      <FormItem name="src" :rules="rules">
        <template #default="{ id }">
          <TiptapInput
            :id="id"
            :model-value="src"
            :placeholder="t('youtubePlaceholder')"
            @update:model-value="src = $event"
            @keydown.enter.prevent="submit"
          />
        </template>
      </FormItem>
      <MediaDimensionFields v-model:width="width" v-model:height="height" :t="t" :submit="submit" />
      <template #actions>
        <TiptapButton @click="dialogRef?.close()">{{ t("cancel") }}</TiptapButton>
        <TiptapButton variant="primary" type="submit">{{ t("insert") }}</TiptapButton>
      </template>
    </Form>
  </ActionDialogButton>
</template>

<script setup lang="ts">
import RiYoutubeLine from "~icons/lucide/youtube";
import { useTemplateRef } from "vue";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import MediaDimensionFields from "./components/MediaDimensionFields.vue";
import { useMediaForm } from "../../../../composables/useMediaForm.ts";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * YouTube insert dialog: URL + optional width/height.
 */
const props = defineProps<EXTActionButtonProps>();
const dialogRef = useTemplateRef<InstanceType<typeof ActionDialogButton>>("dialog");
const formEl = useTemplateRef<InstanceType<typeof Form>>("form");
const { src, width, height, model, rules, submit, onSubmit } = useMediaForm(
  props,
  (payload) => props.editor.chain().focus().setYoutubeVideo(payload).run(),
  dialogRef,
  formEl,
);
</script>
