<template>
  <ActionButton
    :action="() => editor.chain().focus().toggleBold().run()"
    :icon="mdiFormatBold"
    :disabled="!editor.can().toggleBold()"
    :is-active="() => editor.isActive('bold') || false"
    text="Bold"
  />
</template>

<script lang="ts" setup>
import { mdiFormatBold } from "@mdi/js";
import ActionButton from "../ActionButton/index.vue";
import type { Editor } from "@tiptap/vue-3";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});
</script>
