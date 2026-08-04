<template>
  <ActionButton
    :editor="editor"
    :action="() => editor.chain().focus().toggleBold().run()"
    :icon="RiBold"
    :disabled="!editor.can().toggleBold()"
    :is-active="() => editor.isActive('bold') || false"
    tooltip="Bold"
  />
</template>

<script lang="ts" setup>
import { RiBold } from "@remixicon/vue";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import type { Editor } from "@tiptap/vue-3";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});
</script>
