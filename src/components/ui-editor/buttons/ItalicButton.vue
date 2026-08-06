<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleItalic().run()"
    :icon="RiItalic"
    :disabled="!editor.can().toggleItalic()"
    :is-active="() => editor.isActive('italic') || false"
    :tooltip="t('italic')"
  />
</template>

<script lang="ts" setup>
import { RiItalic } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
