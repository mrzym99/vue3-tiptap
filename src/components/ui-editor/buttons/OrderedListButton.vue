<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleOrderedList().run()"
    :icon="RiListOrdered"
    :disabled="!editor.can().toggleOrderedList()"
    :is-active="() => editor.isActive('orderedList') || false"
    :tooltip="t('orderedList')"
  />
</template>

<script lang="ts" setup>
import { RiListOrdered } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";

const props = defineProps<EXTActionButtonProps>();
</script>
