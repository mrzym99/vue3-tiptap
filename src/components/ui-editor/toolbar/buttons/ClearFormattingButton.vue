<template>
  <ActionButton
    :action="() => editor.chain().focus().clearNodes().unsetAllMarks().run()"
    :icon="EraserIcon"
    :tooltip="t('clearFormatting')"
  />
</template>

<script lang="ts" setup>
import EraserIcon from "~icons/lucide/eraser";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
