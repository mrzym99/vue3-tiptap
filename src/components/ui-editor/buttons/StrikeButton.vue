<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleStrike().run()"
    :icon="RiStrikethrough"
    :disabled="!editor.can().toggleStrike()"
    :is-active="() => editor.isActive('strike') || false"
    :tooltip="t('strike')"
  />
</template>

<script lang="ts" setup>
import RiStrikethrough from "~icons/lucide/strikethrough";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
