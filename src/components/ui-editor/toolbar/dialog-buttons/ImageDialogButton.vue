<template>
  <ActionDialogButton
    :t="t"
    ref="dialog"
    :icon="RiImageLine"
    :tooltip="t('image')"
    :title="t('image')"
    @closed="props.editor.commands.focus()"
  >
    <Form ref="form" :model="model" @submit="onSubmit">
      <FormItem name="src" :rules="rules">
        <template #default="{ id }">
          <Tabs v-model="activeTab" :tabs="tabs">
            <template #url>
              <TiptapInput
                :id="id"
                :model-value="src"
                :placeholder="t('imagePlaceholder')"
                @update:model-value="src = $event"
                @keydown.enter.prevent="submit"
              />
            </template>
            <template #upload>
              <ImageUpload v-if="hasUpload" :editor="editor" :t="t" @success="(url) => (src = url)" />
              <span v-else class="image-dialog-upload-disabled">
                {{ t("imageUploadUnavailable") }}
              </span>
            </template>
          </Tabs>
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
import { computed, ref } from "vue";
import { useTemplateRef } from "vue";
import RiImageLine from "~icons/lucide/image";
import ActionDialogButton from "@/components/ui-common/action-dialog-button/index.vue";
import Form from "@/components/ui-common/form/index.vue";
import FormItem from "@/components/ui-common/form-item/index.vue";
import TiptapInput from "@/components/ui-common/input/index.vue";
import TiptapButton from "@/components/ui-common/button/index.vue";
import Tabs, { type TabItem } from "@/components/ui-common/tabs/index.vue";
import ImageUpload from "./components/ImageUpload.vue";
import { isHttpUrl, useMediaForm } from "../../../../composables/useMediaForm.ts";
import type { ImageOptions } from "@/components/extensions/Image";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/** Image insert dialog: URL / Upload tabs (dimensions are set by drag-resize). */
const props = defineProps<EXTActionButtonProps>();
const t = props.t;

const dialogRef = useTemplateRef<InstanceType<typeof ActionDialogButton>>("dialog");
const formEl = useTemplateRef<InstanceType<typeof Form>>("form");
const { src, model, rules, submit, onSubmit } = useMediaForm(
  props,
  (payload) => props.editor.chain().focus().setImage(payload).run(),
  dialogRef,
  formEl,
  (url) => isHttpUrl(url) || /^data:image\//i.test(url),
);

/** Whether the `image` extension is configured with an upload callback. */
const hasUpload = computed(() => {
  const ext = props.editor.extensionManager.extensions.find((e) => e.name === "image");
  return Boolean((ext?.options as ImageOptions | undefined)?.upload);
});

const activeTab = ref("url");
const tabs: TabItem[] = [
  { name: "url", label: t("imageTabUrl") },
  { name: "upload", label: t("imageTabUpload") },
];
</script>

<style lang="scss" scoped>
.image-dialog-upload-disabled {
  color: var(--tiptap-color-text-muted);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.4;
}
</style>
