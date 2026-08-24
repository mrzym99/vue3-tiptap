<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleSuperscript().run()"
    :icon="RiSuperscript"
    :disabled="!editor.can().toggleSuperscript()"
    :is-active="() => editor.isActive('superscript') || false"
    :tooltip="t('superscript')"
  />
</template>

<script lang="ts" setup>
import RiSuperscript from "~icons/lucide/superscript";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
