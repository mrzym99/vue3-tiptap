<template>
  <NodeViewWrapper
    class="image-upload-node"
    :class="{ 'is-dragover': dragover, 'is-uploading': uploading }"
    role="button"
    tabindex="0"
    :aria-label="t('imageUploadHint')"
    @click="pick"
    @keydown.enter.prevent="pick"
    @keydown.space.prevent="pick"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    @drop.prevent="onDrop"
  >
    <input
      ref="inputRef"
      class="image-upload-node-input"
      type="file"
      :accept="options.accept"
      :multiple="options.limit > 1"
      @change="onPicked"
    />
    <div class="image-upload-node-art">
      <RiFile class="image-upload-node-file" />
      <span class="image-upload-node-trigger">
        <RiArrowUp class="image-upload-node-arrow" />
      </span>
    </div>
    <p class="image-upload-node-title">
      {{ uploading ? t("imageUploading") : t("imageUploadHint") }}
    </p>
    <p v-if="!uploading" class="image-upload-node-hint">{{ hint }}</p>
    <p v-if="error" class="image-upload-node-error">{{ error }}</p>
    <div v-if="uploading" class="image-upload-node-progress">
      <span :style="{ width: `${progress}%` }" />
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import RiFile from "~icons/lucide/file";
import RiArrowUp from "~icons/lucide/arrow-up";
import type { ImageUploadOptions } from "@/components/extensions/ImageUpload";
import { embedAsDataURL, pendingImageUploads } from "@/components/extensions/ImageUpload";
import { useTiptapLocale } from "@/locales";

const props = defineProps(nodeViewProps);
const { t } = useTiptapLocale();

const options = computed(() => props.extension.options as ImageUploadOptions);
const inputRef = useTemplateRef<HTMLInputElement>("inputRef");
const dragover = ref(false);
const uploading = ref(false);
const progress = ref(0);
const error = ref("");

const controller = new AbortController();

const hint = computed(() => {
  const { limit, maxSize } = options.value;
  if (!maxSize) return t("imageUploadMaxCount").replace("{limit}", String(limit));
  const mb = Math.round((maxSize / (1024 * 1024)) * 10) / 10;
  return t("imageUploadMaxSizeOnce").replace("{limit}", String(limit)).replace("{size}", `${mb}MB`);
});

function pick() {
  if (!uploading.value) inputRef.value?.click();
}

function onPicked(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  input.value = "";
  start(files);
}

function onDrop(event: DragEvent) {
  dragover.value = false;
  start(Array.from(event.dataTransfer?.files ?? []));
}

function accepted(file: File): boolean {
  const { accept, maxSize } = options.value;
  const typeOk =
    accept === "*/*" || accept.split(",").some((rule) => file.type.startsWith(rule.trim().replace("*", "")));
  return typeOk && (!maxSize || file.size <= maxSize);
}

async function start(files: File[]) {
  const upload = options.value.upload ?? embedAsDataURL;
  const valid = files.filter(accepted).slice(0, options.value.limit);
  if (!valid.length) {
    if (files.length) error.value = t("imageUploadFailed");
    return;
  }
  uploading.value = true;
  error.value = "";
  progress.value = 0;
  const urls: string[] = [];
  for (const [index, file] of valid.entries()) {
    try {
      const url = await upload(
        file,
        (percent) => (progress.value = Math.round(((index + percent / 100) / valid.length) * 100)),
        controller.signal,
      );
      urls.push(url);
      options.value.onSuccess?.(url);
    } catch (cause) {
      const failure = cause instanceof Error ? cause : new Error(String(cause));
      options.value.onError?.(failure);
      error.value = t("imageUploadFailed");
    }
  }
  uploading.value = false;
  if (urls.length) replaceWithImages(urls);
}

/** Swap this zone for the uploaded images (same slot in the document). */
function replaceWithImages(urls: string[]) {
  const from = props.getPos();
  if (from === undefined) return;
  props.editor
    .chain()
    .focus()
    .insertContentAt(
      { from, to: from + props.node.nodeSize },
      urls.map((src) => ({ type: "image", attrs: { src } })),
    )
    .run();
}

// Files dropped/pasted in the editor are queued by FileHandler under this node's id
onMounted(() => {
  const id = props.node.attrs.id as string | null;
  const files = id ? pendingImageUploads.get(id) : undefined;
  if (files) {
    pendingImageUploads.delete(id as string);
    start(files);
  }
});

onBeforeUnmount(() => controller.abort());
</script>

<style lang="scss" scoped>
.image-upload-node {
  box-sizing: border-box;
  align-items: center;
  border: 1px dashed var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  color: var(--tiptap-color-text-muted);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  min-height: 180px;
  margin: 2em 0;
  padding: var(--tiptap-content-padding);
  text-align: center;
  user-select: none;
  transition:
    border-color 120ms ease,
    background-color 120ms ease,
    color 120ms ease;

  &:hover,
  &:focus-visible,
  &.is-dragover {
    border-color: var(--tiptap-accent-primary);
    color: var(--tiptap-color-text);
  }

  &.is-dragover {
    background-color: var(--tiptap-accent-primary-bg);
  }

  &.is-uploading {
    cursor: wait;
  }
}

.image-upload-node-input {
  display: none;
}

/* Document icon with the round upload badge on its lower-right, as in the Tiptap demo */
.image-upload-node-art {
  position: relative;
  width: 40px;
  height: 48px;
  margin-bottom: 6px;
}

.image-upload-node-file {
  width: 40px;
  height: 48px;
  stroke-width: 1.2;
}

.image-upload-node-trigger {
  position: absolute;
  right: -8px;
  bottom: -4px;
  align-items: center;
  background-color: var(--tiptap-accent-primary);
  border-radius: 50%;
  color: #fff;
  display: flex;
  height: 20px;
  width: 20px;
  justify-content: center;
}

.image-upload-node-arrow {
  width: 12px;
  height: 12px;
  stroke-width: 2.5;
}

.image-upload-node-title {
  font-size: var(--tiptap-font-size); // body size, matches the demo's primary line
  line-height: 1.4;
  margin: 0;
}

.image-upload-node-hint,
.image-upload-node-error {
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.4;
  margin: 0;
}

.image-upload-node-error {
  color: var(--tiptap-accent-danger);
}

.image-upload-node-progress {
  background-color: var(--tiptap-color-bg-subtle);
  border-radius: 999px;
  height: 3px;
  margin-top: 8px;
  overflow: hidden;
  width: 180px;

  span {
    background-color: var(--tiptap-accent-primary);
    display: block;
    height: 100%;
    transition: width 120ms linear;
  }
}
</style>
