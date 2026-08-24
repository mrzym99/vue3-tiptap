<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().setHorizontalRule().run()"
    :icon="RiSeparator"
    :tooltip="t('horizontalRule')"
  />
</template>

<script lang="ts" setup>
import RiSeparator from "~icons/lucide/separator-horizontal";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
