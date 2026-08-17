<template>
  <ThemeProvider :theme="theme">
    <div class="tiptap-box" v-if="editor">
      <ToolBar :editor="editor" />
      <EditorContent :editor="editor" />
      <BubbleMenuBar :editor="editor" />
      <FloatingMenuBar :editor="editor" />
      <span v-if="props.maxLength" class="max-limit">
        {{ getEditorTextLength(editor) }} / {{ props.maxLength }}
      </span>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from "@/components/ui-common/theme-provider/index.vue";
import ToolBar from "@/components/ui-editor/tool-bar/index.vue";
import EditorContent from "@/components/ui-editor/editor-content/index.vue";
import BubbleMenuBar from "@/components/ui-editor/bubble-menu/index.vue";
import FloatingMenuBar from "@/components/ui-editor/floating-menu/index.vue";
// https://tiptap.dev/docs/editor/getting-started/install/vue3#next-steps
import { useEditor } from "@tiptap/vue-3";
import type { EditorEvents } from "@tiptap/core";
import { checkLimit, getEditorTextLength } from "./utils";
import type { TipTapEditorProps } from "@/types";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import customExtensions from "@/components/extensions/index.ts";

const props = withDefaults(
  defineProps<
    Pick<
      TipTapEditorProps,
      "maxLength" | "disabled" | "theme" | "placeholder" | "autofocus"
    >
  >(),
  {
    maxLength: 0,
    disabled: false,
    theme: "light",
    placeholder: undefined,
    autofocus: false,
  },
);

const emit = defineEmits<{
  focus: [payload: EditorEvents["focus"]];
  blur: [payload: EditorEvents["blur"]];
}>();

const modelValue = defineModel<string>({ required: true });

// Value that changed before the editor instance was ready (useEditor creates
// the instance on mount, so the initial watcher run may race with it)
let pendingContent: string | undefined;

const editor = useEditor({
  content: modelValue.value,
  extensions: [
    Document, // 文档根节点
    Paragraph, // 段落
    Text, // 文本
    Placeholder.configure({
      placeholder: props.placeholder ?? "",
    }),
    ...customExtensions,
  ],
  editable: !props.disabled,
  autofocus: props.autofocus,
  onCreate: ({ editor }) => {
    // Apply a value that changed before the editor was created
    if (pendingContent !== undefined && pendingContent !== editor.getHTML()) {
      editor.commands.setContent(pendingContent, { emitUpdate: false });
    }
    // Only write back when the initial content actually got truncated —
    // otherwise an empty document would immediately rewrite the parent
    // value from "" to "<p></p>".
    if (props.maxLength && getEditorTextLength(editor) > props.maxLength) {
      checkLimit(editor, props.maxLength);
      modelValue.value = editor.getHTML();
    }
  },
  onUpdate: ({ editor }) => {
    checkLimit(editor, props.maxLength);
    modelValue.value = editor.getHTML();
  },
  onFocus: (props) => emit("focus", props),
  onBlur: (props) => emit("blur", props),
});

watch(
  () => modelValue.value,
  (newValue) => {
    if (!editor.value) {
      pendingContent = newValue;
      return;
    }

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
