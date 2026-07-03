<template>
  <ThemeProvider :theme="theme">
    <div class="tiptap-box" v-if="editor">
      <ToolBar :editor="editor" />
      <EditorContent class="tiptap-editor" :editor="editor" />
      <span v-if="props.maxLength" class="max-limit"> {{ editor.getText().length }} / {{ props.maxLength }} </span>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './ui/ThemeProvider/index.vue'
import ToolBar from './ToolBar.vue'
// https://tiptap.dev/docs/editor/getting-started/install/vue3#next-steps
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TableKit } from '@tiptap/extension-table'
import { checkLimit } from './utils'
import type { ThemeName } from '@/types/theme.ts'

const props = defineProps({
  maxLength: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<ThemeName>,
    default: 'light',
  },
})

const modelValue = defineModel<string>({ required: true })

const editor = useEditor({
  content: modelValue.value,
  extensions: [
    StarterKit,
    TableKit.configure({
      table: {
        resizable: true,
      },
    }),
  ],
  editable: !props.disabled,
  onCreate: ({ editor }) => {
    checkLimit(editor as Editor, props.maxLength)
    modelValue.value = editor.getHTML()
  },
  onUpdate: ({ editor }) => {
    const maxLength = props.maxLength
    checkLimit(editor as Editor, maxLength)
    modelValue.value = editor.getHTML()
  },
})

watch(
  () => modelValue.value,
  (newValue) => {
    if (!editor.value) return

    const isSame = newValue === editor.value.getHTML()
    if (isSame) return
    editor.value.commands.setContent(newValue)
  },
)

watch(
  () => props.disabled,
  (newValue) => {
    if (!editor.value) return
    editor.value.setEditable(!newValue)
  },
)
</script>
<style>
.tiptap-editor {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tiptap {
  flex: 1;
  outline: none;
  color: var(--naive-tiptap-color-text);
  border: 1px solid var(--naive-tiptap-color-border);
  background-color: var(--naive-tiptap-color-bg);
  border-radius: 4px;
  padding: 12px;
  overflow-y: auto;
}

table {
  border-collapse: collapse;
  margin: 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;

  td,
  th {
    border: 1px solid var(--naive-tiptap-color-border);
    box-sizing: border-box;
    min-width: 1em;
    padding: 6px 8px;
    position: relative;
    vertical-align: top;

    > * {
      margin-bottom: 0;
    }
  }

  th {
    background-color: var(--naive-tiptap-color-bg);
    font-weight: bold;
    text-align: left;
  }

  .selectedCell:after {
    background: var(--naive-tiptap-color-border);
    content: '';
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    pointer-events: none;
    position: absolute;
    z-index: 2;
  }

  .column-resize-handle {
    background-color: #805ad5;
    bottom: -2px;
    pointer-events: none;
    position: absolute;
    right: -2px;
    top: 0;
    width: 4px;
  }
}

.tableWrapper {
  margin: 1.5rem 0;
  overflow-x: auto;
}

.resize-cursor {
  cursor: col-resize;
}
</style>
