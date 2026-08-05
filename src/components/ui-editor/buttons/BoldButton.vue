<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleBold().run()"
    :icon="RiBold"
    :disabled="!editor.can().toggleBold()"
    :is-active="() => editor.isActive('bold') || false"
    :tooltip="t('bold')"
  />
</template>

<script lang="ts" setup>
import { RiBold } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { ExtActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<ExtActionButtonProps>();
</script>
