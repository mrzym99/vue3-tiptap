<template>
  <div class="tiptap-box" v-if="editor">
    <ToolBar :editor="editor" />
    <EditorContent class="tiptap-editor" :editor="editor" />
    <span v-if="props.maxLength" class="max-limit"> {{ editor.getText().length }} / {{ props.maxLength }} </span>
  </div>
</template>

<script setup lang="ts">
import ToolBar from "./ToolBar.vue";
// https://tiptap.dev/docs/editor/getting-started/install/vue3#next-steps
import { useEditor, EditorContent, Editor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

import { checkLimit } from "./utils";

const props = defineProps({
  maxLength: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const modelValue = defineModel<string>({ required: true });

const editor = useEditor({
  content: modelValue.value,
  extensions: [StarterKit],
  editable: !props.disabled,
  onCreate: ({ editor }) => {
    checkLimit(editor as Editor, props.maxLength);
    modelValue.value = editor.getHTML();
  },
  onUpdate: ({ editor }) => {
    const maxLength = props.maxLength;
    checkLimit(editor as Editor, maxLength);
    modelValue.value = editor.getHTML();
  },
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (!editor.value) return;

    const isSame = newValue === editor.value.getHTML();
    if (isSame) return;
    editor.value.commands.setContent(newValue);
  },
);

watch(
  () => props.disabled,
  (newValue) => {
    if (!editor.value) return;
    editor.value.setEditable(!newValue);
  },
);
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
