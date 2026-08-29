<template>
  <ActionButton
    :action="() => editor.chain().focus().redo().run()"
    :icon="RedoIcon"
    :disabled="!editor.can().chain().redo().run()"
    :tooltip="t('redo')"
  />
</template>

<script lang="ts" setup>
import RedoIcon from "~icons/lucide/redo-2";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>