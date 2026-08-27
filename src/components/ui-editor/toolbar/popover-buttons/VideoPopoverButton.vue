<template>
  <ActionPopoverButton ref="dialog" :icon="RiVideoLine" :tooltip="t('video')">
    <Form ref="form" :model="model" @submit="onSubmit">
      <FormItem name="src" :rules="rules">
        <template #default="{ id }">
          <TiptapInput
            :id="id"
            :model-value="src"
            :placeholder="t('videoPlaceholder')"
            @update:model-value="src = $event"
            @keydown.enter.prevent="submit"
          />
        </template>
      </FormItem>
      <MediaDimensionFields v-model:width="width" v-model:height="height" :t="t" :submit="submit" />
      <template #actions>
        <TiptapButton variant="primary" type="submit">{{ t("insert") }}</TiptapButton>
      </template>
    </Form>
  </ActionPopoverButton>
</template>

<script setup lang="ts">
import RiVideoLine from "~icons/lucide/video";
import { useTemplateRef } from "vue";
import ActionPopoverButton from "@/components/ui-common/popover-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import MediaDimensionFields from "./components/MediaDimensionFields.vue";
import { useMediaForm } from "../../../../composables/useMediaForm.ts";
import { isVideoUrl } from "@/utils/video-url";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/**
 * Video insert button: URL (Bilibili/Tencent/Youku/iQIYI or generic) +
 * optional width/height. The extension converts the URL to an embed player.
 * The URL is validated with the same rule the panel uses to build the embed.
 */
const props = defineProps<EXTActionButtonProps>();
const dialogRef = useTemplateRef<InstanceType<typeof ActionPopoverButton>>("dialog");
const formEl = useTemplateRef<InstanceType<typeof Form>>("form");
const { src, width, height, model, rules, submit, onSubmit } = useMediaForm(
  props,
  (payload) => props.editor.chain().focus().setVideo(payload).run(),
  dialogRef,
  formEl,
  isVideoUrl,
);
</script>
