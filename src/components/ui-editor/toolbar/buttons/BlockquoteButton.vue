<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleBlockquote().run()"
    :icon="RiTextQuote"
    :disabled="!editor.can().toggleBlockquote()"
    :is-active="() => editor.isActive('blockquote') || false"
    :tooltip="t('blockquote')"
  />
</template>

<script lang="ts" setup>
import RiTextQuote from "~icons/lucide/text-quote";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
