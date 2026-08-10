<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleUnderline().run()"
    :icon="RiUnderline"
    :disabled="!editor.can().toggleUnderline()"
    :is-active="() => editor.isActive('underline') || false"
    :tooltip="t('underline')"
  />
</template>

<script lang="ts" setup>
import { RiUnderline } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
