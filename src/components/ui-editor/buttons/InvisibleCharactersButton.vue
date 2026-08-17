<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleInvisibleCharacters().run()"
    :icon="RiEraserLine"
    :is-active="isShowInvisible"
    :tooltip="t('invisibleCharacters')"
  />
</template>

<script lang="ts" setup>
import { RiEraserLine } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();

const isShowInvisible = () =>
  (
    props.editor.storage.invisibleCharacters as
      | { showInvisibleCharacters?: boolean }
      | undefined
  )?.showInvisibleCharacters === true;
</script>
