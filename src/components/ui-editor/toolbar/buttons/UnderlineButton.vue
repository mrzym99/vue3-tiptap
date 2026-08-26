<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleUnderline().run()"
    :icon="RiUnderline"
    :disabled="!editor.can().toggleUnderline()"
    :is-active="() => editor.isActive('underline') || false"
    :tooltip="t('underline')"
  />
</template>

<script lang="ts" setup>
import RiUnderline from "~icons/lucide/underline";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
