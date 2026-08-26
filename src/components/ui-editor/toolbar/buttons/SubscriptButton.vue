<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleSubscript().run()"
    :icon="RiSubscript"
    :disabled="!editor.can().toggleSubscript()"
    :is-active="() => editor.isActive('subscript') || false"
    :tooltip="t('subscript')"
  />
</template>

<script lang="ts" setup>
import RiSubscript from "~icons/lucide/subscript";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
