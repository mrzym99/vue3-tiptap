<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleCode().run()"
    :icon="RiCodeSSlashLine"
    :disabled="!editor.can().toggleCode()"
    :is-active="() => editor.isActive('code') || false"
    :tooltip="t('code')"
  />
</template>

<script lang="ts" setup>
import RiCodeSSlashLine from "~icons/lucide/code";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
