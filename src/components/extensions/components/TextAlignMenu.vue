<template>
  <ActionMenuButton :editor="editor" icon="alignCenter" :disabled="disabled" :is-active="isActive" :items="options" tooltip="Bold">
    <template #suffix>
      <SvgIcon :path="getIcon('dropdown')" size="24" />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import ActionMenuButton from '@/components/ui/ActionMenuButton/index.vue'
import SvgIcon from '@/components/ui/SvgIcon/index.vue'
import { getIcon } from '@/components/utils'
import type { IconsOptions } from '@/constants'
import type { Editor } from '@tiptap/vue-3'

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

const options = computed(() => [
  {
    label: '左对齐',
    icon: 'alignLeft' as keyof IconsOptions,
    action: () => props.editor.chain().focus().setTextAlign('left').run(),
    disabled: !props.editor.can().setTextAlign('left'),
    isActive: () => props.editor.isActive({ textAlign: 'left' }),
  },
  {
    label: '居中对齐',
    icon: 'alignCenter' as keyof IconsOptions,
    action: () => props.editor.chain().focus().setTextAlign('center').run(),
    disabled: !props.editor.can().setTextAlign('center'),
    isActive: () => props.editor.isActive({ textAlign: 'center' }),
  },
  {
    label: '右对齐',
    icon: 'alignRight' as keyof IconsOptions,
    action: () => props.editor.chain().focus().setTextAlign('right').run(),
    disabled: !props.editor.can().setTextAlign('right'),
    isActive: () => props.editor.isActive({ textAlign: 'right' }),
  },
  {
    label: '两端对齐',
    icon: 'alignJustify' as keyof IconsOptions,
    action: () => props.editor.chain().focus().setTextAlign('justify').run(),
    disabled: !props.editor.can().setTextAlign('justify'),
    isActive: () => props.editor.isActive({ textAlign: 'justify' }),
  },
])

const disabled = computed(() => options.value.every((item) => item.disabled))
const isActive = computed(() => options.value.some((item) => item.isActive()))
</script>
