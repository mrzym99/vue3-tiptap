<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleCodeBlock().run()"
    :icon="RiCodeBoxLine"
    :disabled="!editor.can().toggleCodeBlock()"
    :is-active="() => editor.isActive('codeBlock') || false"
    :tooltip="t('codeBlock')"
  />
</template>

<script lang="ts" setup>
import RiCodeBoxLine from "~icons/lucide/square-code";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
