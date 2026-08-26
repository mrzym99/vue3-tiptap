<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleInvisibleCharacters().run()"
    :icon="RiEraserLine"
    :is-active="isShowInvisible"
    :tooltip="t('invisibleCharacters')"
  />
</template>

<script lang="ts" setup>
import RiEraserLine from "~icons/lucide/eraser";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const isShowInvisible = () => {
  const storage = props.editor.storage.invisibleCharacters as { visibility?: () => boolean } | undefined;
  return storage?.visibility?.() === true;
};
</script>
