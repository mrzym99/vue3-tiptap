<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleHighlight().run()"
    :icon="RiMarkPenLine"
    :disabled="!editor.can().toggleHighlight()"
    :is-active="() => editor.isActive('highlight') || false"
    :tooltip="t('highlight')"
  />
</template>

<script lang="ts" setup>
import RiMarkPenLine from "~icons/lucide/highlighter";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
