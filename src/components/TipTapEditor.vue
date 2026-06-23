<template>
  <div class="tiptap-box" v-if="editor">
    <div class="tiptap-toolbar">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        <img :src="Bold" alt="Bold" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        <img :src="Italic" alt="Italic" />
      </button>
      <button
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
      >
        <img :src="Underline" alt="Underline" />
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        <img :src="OrderedList" alt="OrderedList" />
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        <img :src="UnOrderedList" alt="UnOrderedList" />
      </button>
    </div>
    <EditorContent class="tiptap-editor" :editor="editor" />
    <span v-if="props.maxLength" class="max-limit">
      {{ editor.getText().length }} / {{ props.maxLength }}
    </span>
  </div>
</template>

<script setup>
import { ref, watch, defineModel, computed } from 'vue'
// https://tiptap.dev/docs/editor/getting-started/install/vue3#next-steps
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
// icons: https://www.tiny.cloud/docs/tinymce/latest/editor-icon-identifiers/
import Bold from '../assets/icons/bold.svg'
import Italic from '../assets/icons/italic.svg'
import Underline from '../assets/icons/underline.svg'
import OrderedList from '../assets/icons/ordered-list.svg'
import UnOrderedList from '../assets/icons/unordered-list.svg'
import { checkLimit } from './utils'

const props = defineProps({
  maxLength: {
    type: Number,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const content = defineModel(
  {
    content: String,
  },
  { require: true },
)

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit],
  editable: !props.disabled,
  onCreate: ({ editor }) => {
    checkLimit(editor, props.maxLength)
    content.value = editor.getHTML()
  },
  onUpdate: ({ editor }) => {
    const maxLength = props.maxLength
    checkLimit(editor, maxLength)
    content.value = editor.getHTML()
  },
})

function deleteRange(range) {
  if (!editor.value) return
  editor.value.commands.deleteRange(range)
}

watch(
  () => content.value,
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
.tiptap-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.tiptap-toolbar {
  display: flex;
  gap: 8px;
}

.tiptap-editor {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tiptap {
  flex: 1;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px;
  overflow-y: auto;
}

button {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.is-active {
  background-color: #e0e0e0;
}
</style>
