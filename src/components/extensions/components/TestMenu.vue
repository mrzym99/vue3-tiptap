<template>
  <ActionMenuButton
    :icon="mdiFormatBold"
    :disabled="!editor.can().toggleBold()"
    :is-active="() => editor.isActive('bold') || false"
    :items="options"
    tooltip="Bold"
  />
</template>

<script lang="ts" setup>
import { mdiAbjadArabic, mdiFormatBold, mdiSheep } from "@mdi/js";
import ActionMenuButton from "@/components/ui/ActionMenuButton/index.vue";
import type { Editor } from "@tiptap/vue-3";
import { isActive } from "@tiptap/core";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});


const options = [
  {
    label: '男 narrator',
    icon: mdiAbjadArabic,
    action: () => console.log('narrator'),
    disabled: false,
    isActive: () =>  false,
  },
  {
    label: '羊男',
    icon: mdiSheep,
    action: () => console.log('sheep-man'),
    disabled: false,
    isActive: () =>  false,
  },
]
</script>
