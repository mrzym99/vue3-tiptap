<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleBlockquote().run()"
    :icon="RiAlignStartVertical"
    :disabled="!editor.can().toggleBlockquote()"
    :is-active="() => editor.isActive('blockquote') || false"
    :tooltip="t('blockquote')"
  />
</template>

<script lang="ts" setup>
import RiAlignStartVertical from "~icons/lucide/align-start-vertical";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
