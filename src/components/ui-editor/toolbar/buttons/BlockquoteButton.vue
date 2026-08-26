<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleBlockquote().run()"
    :icon="RiDoubleQuotesL"
    :disabled="!editor.can().toggleBlockquote()"
    :is-active="() => editor.isActive('blockquote') || false"
    :tooltip="t('blockquote')"
  />
</template>

<script lang="ts" setup>
import RiDoubleQuotesL from "~icons/lucide/quote";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
