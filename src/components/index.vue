<template>
  <ThemeProvider :theme="theme">
    <div class="tiptap-box" v-if="editor">
      <ToolBar :editor="editor" />
      <EditorContent :editor="editor" />
      <span v-if="props.maxLength" class="max-limit">
        {{ editor.getText().length }} / {{ props.maxLength }}
      </span>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from "@/components/ui-common/theme-provider/index.vue";
import ToolBar from "@/components/ui-editor/tool-bar/index.vue";
import EditorContent from "@/components/ui-editor/editor-content/index.vue";
// https://tiptap.dev/docs/editor/getting-started/install/vue3#next-steps
import { useEditor, Editor } from "@tiptap/vue-3";
// import StarterKit from "@tiptap/starter-kit";
// import { TableKit } from "@tiptap/extension-table";
import { checkLimit } from "./utils";
import type { ThemeName } from "@/types";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

// import { Bold } from "./extensions/Bold.ts";
// import { Italic } from "./extensions/Italic.ts";
// import { TextAlign } from "./extensions/TextAlign.ts";
// import { Underline } from "./extensions/Underline.ts";
// import { Blockquote } from "./extensions/Blockquote.ts";
import customExtensions from "@/components/extensions/index.ts";
// import { TextAlign } from "@tiptap/extension-text-align";

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
    default: "light",
  },
});

const modelValue = defineModel<string>({ required: true });

const editor = useEditor({
  content: modelValue.value,
  extensions: [
    // StarterKit,
    Document, // 文档根节点
    Paragraph, // 段落
    Text, // 文本
    // TableKit.configure({
    //   table: {
    //     resizable: true,
    //   },
    // }),
    ...customExtensions,
  ],
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
<style scoped>
.tiptap-box {
  position: relative;
  height: 100%;
  border: 1px solid var(--naive-tiptap-color-border);
  border-radius: var(--naive-tiptap-border-radius-sm);
}

.max-limit {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: var(--naive-tiptap-font-size-sm);
  color: var(--naive-tiptap-color-text-3);
  padding: var(--naive-tiptap-padding-xs);
}
</style>
