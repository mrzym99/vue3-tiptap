<template>
  <ActionMenuButton
    :editor="editor"
    icon="alignCenter"
    :disabled="!editor.can().toggleBold()"
    :is-active="() => editor.isActive('bold') || false"
    :items="options"
    tooltip="Bold"
  />
</template>

<script lang="ts" setup>
import ActionMenuButton from "@/components/ui/ActionMenuButton/index.vue";
import type { IconsOptions } from "@/constants";
import type { Editor } from "@tiptap/vue-3";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});


const options = [
  {
    label: '左对齐',
    icon: 'alignLeft' as keyof IconsOptions,
    action: () => console.log('narrator'),
    disabled: false,
    isActive: () =>  false,
  },
  {
    label: '居中对齐',
    icon: 'alignCenter' as keyof IconsOptions,
    action: () => console.log('sheep-man'),
    disabled: false,
    isActive: () =>  false,
  },
   {
    label: '右对齐',
    icon: 'alignRight' as keyof IconsOptions,
    action: () => console.log('sheep-man'),
    disabled: false,
    isActive: () =>  false,
  },
   {
    label: '两端对齐',
    icon: 'alignJustify' as keyof IconsOptions,
    action: () => console.log('sheep-man'),
    disabled: false,
    isActive: () =>  false,
  },
]
</script>
