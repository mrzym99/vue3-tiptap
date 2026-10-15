<template>
  <div
    class="image-upload"
    :class="{ 'is-dragover': dragover, 'is-uploading': uploading }"
    role="button"
    tabindex="0"
    @click="fileInputRef?.click()"
    @keydown.enter.prevent="fileInputRef?.click()"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    @drop.prevent="onDrop"
  >
    <input ref="fileInputRef" type="file" accept="image/*" class="image-upload-input" @change="onFilePicked" />
    <div v-if="previewUrl" class="image-upload-preview">
      <img :src="previewUrl" alt="" />
    </div>
    <RiImageUp v-else class="image-upload-icon" />
    <span class="image-upload-hint">
      {{ uploading ? t("imageUploading") : t("imageUploadHint") }}
    </span>
    <span v-if="uploadError" class="image-upload-error">
      {{ uploadError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import RiImageUp from "~icons/lucide/image-up";
import type { Editor } from "@tiptap/core";
import type { TranslateFn } from "@/types";
import type { ImageOptions } from "@/components/extensions/Image";

/** Click / drag-drop upload zone reading `Image.configure({ upload })`; emits the uploaded URL on success. */
const props = defineProps<{ editor: Editor; t: TranslateFn }>();

const emit = defineEmits<{ success: [url: string] }>();

const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef");
const uploading = ref(false);
const uploadError = ref("");
const dragover = ref(false);
const previewUrl = ref("");

/** Upload callback from the image extension config. */
const upload = computed(() => {
  const ext = props.editor.extensionManager.extensions.find((e) => e.name === "image");
  return (ext?.options as ImageOptions | undefined)?.upload;
});

async function uploadFile(file: File, input?: HTMLInputElement) {
  const uploadFn = upload.value;
  if (!file || !uploadFn) return;
  uploading.value = true;
  uploadError.value = "";
  try {
    const url = await uploadFn(file);
    previewUrl.value = url;
    emit("success", url);
  } catch {
    uploadError.value = props.t("imageUploadFailed");
  } finally {
    uploading.value = false;
    if (input) input.value = "";
  }
}

function onFilePicked(event: Event) {
  const input = event.target as HTMLInputElement;
  uploadFile(input.files?.[0] as File, input);
}

function onDrop(event: DragEvent) {
  dragover.value = false;
  uploadFile(event.dataTransfer?.files?.[0] as File);
}
</script>

<style lang="scss" scoped>
.image-upload {
  box-sizing: border-box;
  align-items: center;
  border: 1px dashed var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  color: var(--tiptap-color-text-muted);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
  justify-content: center;
  padding: var(--tiptap-content-padding);
  text-align: center;
  transition: border-color 120ms ease, background-color 120ms ease;
  width: 100%;

  &:hover,
  &:focus-visible,
  &.is-dragover {
    border-color: var(--tiptap-accent-blue);
    color: var(--tiptap-color-text);
  }

  &.is-dragover {
    background-color: var(--tiptap-accent-blue-bg);
  }

  &.is-uploading {
    cursor: wait;
    opacity: 0.7;
  }
}

.image-upload-input {
  display: none;
}

.image-upload-icon {
  width: 22px;
  height: 22px;
}

/* Fixed-height preview container; the image is fitted inside, never overflowing */
.image-upload-preview {
  align-items: center;
  display: flex;
  height: 140px;
  justify-content: center;
  width: 100%;

  img {
    border-radius: var(--tiptap-border-radius-sm);
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
}

.image-upload-hint {
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.4;
}

.image-upload-error {
  color: var(--tiptap-accent-red);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.3;
}
</style>
