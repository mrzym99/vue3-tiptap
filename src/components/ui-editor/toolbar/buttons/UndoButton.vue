<template>
  <ActionButton
    :action="() => editor.chain().focus().undo().run()"
    :icon="UndoIcon"
    :disabled="!editor.can().chain().undo().run()"
    :tooltip="t('undo')"
  />
</template>

<script lang="ts" setup>
import UndoIcon from "~icons/lucide/undo-2";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
