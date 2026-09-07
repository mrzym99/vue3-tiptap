<template>
  <ThemeProvider :theme="theme">
    <div class="tiptap-box" v-if="editor">
      <ToolBar :editor="editor" :toolbar="props.toolbar" />
      <EditorContent :editor="editor" />
      <BubbleMenuBar :editor="editor" :toolbar="props.bubbleMenu ?? props.toolbar" />
      <LinkBubbleMenu :editor="editor" />
      <MediaBubbleMenu :editor="editor" />
      <TableBubbleMenu :editor="editor" />
      <FloatingMenuBar :editor="editor" :toolbar="props.floatingMenu ?? props.toolbar" />
      <span v-if="props.maxLength" class="max-limit"> {{ editor.storage.characterCount.characters() }} / {{ props.maxLength }} </span>
    </div>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from "@/components/ui-common/theme-provider/index.vue";
import ToolBar from "@/components/ui-editor/toolbar/index.vue";
import EditorContent from "@/components/ui-editor/editor-content/index.vue";
import BubbleMenuBar from "@/components/ui-editor/bubble-menu/index.vue";
import LinkBubbleMenu from "@/components/ui-editor/bubble-menu/link-bubble-menu/index.vue";
import MediaBubbleMenu from "@/components/ui-editor/bubble-menu/media-bubble-menu/index.vue";
import TableBubbleMenu from "@/components/ui-editor/bubble-menu/table-bubble-menu/index.vue";
import FloatingMenuBar from "@/components/ui-editor/bubble-menu/floating-menu/index.vue";
// https://tiptap.dev/docs/editor/getting-started/install/vue3#next-steps
import { useEditor } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import { checkLimit } from "@/utils/text";
import type { TipTapEditorProps } from "@/types";
import type { LocaleName } from "@/locales";
import { createLocaleContext, detectLocale, provideTiptapLocale } from "@/locales";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import Extensions from "@/components/extensions/index.ts";

const props = withDefaults(
  defineProps<
    Pick<
      TipTapEditorProps,
      | "maxLength"
      | "disabled"
      | "theme"
      | "placeholder"
      | "autofocus"
      | "toolbar"
      | "bubbleMenu"
      | "floatingMenu"
      | "extensions"
    > & {
      /** UI language of the toolbar/menus (auto-detected when omitted) */
      locale?: LocaleName;
    }
  >(),
  {
    maxLength: 0,
    disabled: false,
    theme: "light",
    placeholder: undefined,
    autofocus: false,
    locale: undefined,
    toolbar: undefined,
    bubbleMenu: undefined,
    floatingMenu: undefined,
    extensions: () => [],
  },
);

// Self-contained locale context (no vue-i18n / global instance needed)
const localeContext = createLocaleContext(props.locale ?? detectLocale());
watch(
  () => props.locale,
  (next) => {
    if (next) localeContext.setLocale(next);
  },
);
provideTiptapLocale(localeContext);

const emit = defineEmits<{
  focus: [payload: { editor: Editor; event: FocusEvent; transaction: Transaction }];
  blur: [payload: { editor: Editor; event: FocusEvent; transaction: Transaction }];
}>();

const modelValue = defineModel<string>({ required: true });

// Debounced write-back of editor.getHTML() to v-model: serializing a large
// document on every keystroke is O(n), so sync at most once per idle window.
// checkLimit stays synchronous — truncation must apply immediately.
const MODEL_SYNC_DELAY = 300;
let modelSyncTimer: ReturnType<typeof setTimeout> | undefined;
const syncModelValue = () => {
  if (modelSyncTimer) clearTimeout(modelSyncTimer);
  modelSyncTimer = setTimeout(() => {
    modelSyncTimer = undefined;
    if (editor.value) modelValue.value = editor.value.getHTML();
  }, MODEL_SYNC_DELAY);
};
const flushModelValue = () => {
  if (!modelSyncTimer) return;
  clearTimeout(modelSyncTimer);
  modelSyncTimer = undefined;
  if (editor.value) modelValue.value = editor.value.getHTML();
};
onUnmounted(flushModelValue);

// Value that changed before the editor instance was ready (useEditor creates
// the instance on mount, so the initial watcher run may race with it)
let pendingContent: string | undefined;

// Merge user extensions over the built-ins (by extension name).
const userExtNames = new Set(props.extensions.map((e) => e.name));
const mergedExtensions = [
  Document, // 文档根节点
  Paragraph, // 段落
  Text, // 文本
  Placeholder.configure({
    placeholder: props.placeholder ?? "",
  }),
  ...Extensions.filter((e) => !userExtNames.has(e.name)),
  ...props.extensions,
];

const editor = useEditor({
  content: modelValue.value,
  extensions: mergedExtensions,
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
    if (props.maxLength && editor.storage.characterCount.characters() > props.maxLength) {
      checkLimit(editor, props.maxLength);
      modelValue.value = editor.getHTML();
    }
  },
  onUpdate: ({ editor }) => {
    checkLimit(editor, props.maxLength);
    syncModelValue();
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
<style lang="scss" scoped>
.tiptap-box {
  position: relative;
  height: 100%;
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  color: var(--tiptap-color-text);
  background-color: var(--tiptap-color-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.max-limit {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: var(--tiptap-font-size);
  color: var(--tiptap-color-text-muted);
  padding: var(--tiptap-padding-sm);
}
</style>
