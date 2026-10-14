<template>
  <div class="image-upload">
    <input ref="fileInputRef" type="file" accept="image/*" class="image-upload-input" @change="onFilePicked" />
    <TiptapButton :disabled="uploading" @click="fileInputRef?.click()">
      {{ uploading ? t("imageUploading") : t("imageUpload") }}
    </TiptapButton>
    <span v-if="uploadError" class="image-upload-error">
      {{ uploadError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import type { Editor } from "@tiptap/core";
import type { TranslateFn } from "@/types";
import TiptapButton from "@/components/ui-common/button/index.vue";
import type { ImageOptions } from "@/components/extensions/Image";

/** Upload control reading `Image.configure({ upload })`; emits the uploaded URL on success. */
const props = defineProps<{ editor: Editor; t: TranslateFn }>();

const emit = defineEmits<{ success: [url: string] }>();


const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef");
const uploading = ref(false);
const uploadError = ref("");

/** Upload callback from the image extension config. */
const upload = computed(() => {
  const ext = props.editor.extensionManager.extensions.find((e) => e.name === "image");
  return (ext?.options as ImageOptions | undefined)?.upload;
});

async function onFilePicked(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const uploadFn = upload.value;
  if (!file || !uploadFn) return;
  uploading.value = true;
  uploadError.value = "";
  try {
    const url = await uploadFn(file);
    emit("success", url);
  } catch {
    uploadError.value = props.t("imageUploadFailed");
  } finally {
    uploading.value = false;
    input.value = "";
  }
}
</script>

<style lang="scss" scoped>
.image-upload {
  align-items: center;
  display: flex;
  gap: var(--tiptap-gap);
}

.image-upload-input {
  display: none;
}

.image-upload-error {
  color: var(--tiptap-accent-red);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.3;
}
</style>
