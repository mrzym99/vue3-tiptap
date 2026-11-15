<template>
  <ActionButton :icon="RiImagePlus" :tooltip="t('image')" :action="insertUploadNode" />
</template>

<script setup lang="ts">
import RiImagePlus from "~icons/lucide/image-plus";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

/** Inserts an image upload zone at the selection — the zone uploads and turns into images. */
const props = defineProps<EXTActionButtonProps>();
const t = props.t;

function insertUploadNode() {
  // Without the ImageUpload extension there is nothing to insert
  if (!props.editor.schema.nodes.imageUpload) return;
  props.editor.chain().focus().setImageUploadNode().run();
}
</script>
