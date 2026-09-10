<template>
  <ThemeProvider :theme="theme" :theme-overrides="themeOverrides">
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
import type { LocaleName, LocaleTranslations } from "@/locales";
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
      | "themeOverrides"
      | "placeholder"
      | "autofocus"
      | "toolbar"
      | "bubbleMenu"
      | "floatingMenu"
      | "extensions"
      | "excludeExtensions"
    > & {
      /** UI language of the toolbar/menus (auto-detected when omitted) */
      locale?: LocaleName | (string & {});
      /** Host translations: override built-in wording or add new locales */
      translations?: LocaleTranslations;
    }
  >(),
  {
    maxLength: 0,
    disabled: false,
    theme: "light",
    themeOverrides: undefined,
    placeholder: undefined,
    autofocus: false,
    locale: undefined,
    translations: undefined,
    toolbar: undefined,
    bubbleMenu: undefined,
    floatingMenu: undefined,
    extensions: () => [],
    excludeExtensions: () => [],
  },
);

// Self-contained locale context (no vue-i18n / global instance needed)
const localeContext = createLocaleContext(props.locale ?? detectLocale(), props.translations);
watch(
  () => props.locale,
  (next) => {
    if (next) localeContext.setLocale(next);
  },
);
watch(
  () => props.translations,
  (next) => localeContext.setTranslations(next),
  { deep: true },
);
provideTiptapLocale(localeContext);

const emit = defineEmits<{
  focus: [payload: { editor: Editor; event: FocusEvent; transaction: Transaction }];
  blur: [payload: { editor: Editor; event: FocusEvent; transaction: Transaction }];
  /** Emitted on every content-changing transaction (before the debounced v-model write-back) */
  update: [payload: { editor: Editor; transaction: Transaction }];
  /** The editor instance was created and is ready to use */
  ready: [editor: Editor];
  /** Content exceeded `maxLength` and was truncated */
  truncated: [info: { maxLength: number }];
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

// Placeholder stays reactive: `extension.options` is a getter that re-runs
// `addOptions()` on every access, so mutating options at runtime is useless.
// The option also accepts a function, which the plugin re-evaluates whenever
// it rebuilds decorations — close over a mutable variable for live updates.
let currentPlaceholder = props.placeholder ?? "";
const userExtNames = new Set(props.extensions.map((e) => e.name));
// Built-ins named here are removed entirely (buttons disappear too, the
// toolbar only renders keys whose extension exists)
const excludedExtNames = new Set(props.excludeExtensions);
const mergedExtensions = [
  Document, // 文档根节点
  Paragraph, // 段落
  Text, // 文本
  Placeholder.configure({
    placeholder: () => currentPlaceholder,
  }),
  ...Extensions.filter((e) => !userExtNames.has(e.name) && !excludedExtNames.has(e.name)),
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
      emit("truncated", { maxLength: props.maxLength });
    }
    emit("ready", editor);
  },
  onUpdate: ({ editor, transaction }) => {
    if (checkLimit(editor, props.maxLength)) {
      emit("truncated", { maxLength: props.maxLength });
    }
    emit("update", { editor, transaction });
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

// Sync runtime `placeholder` prop changes into the extension (see
// `currentPlaceholder` above) and force a decoration rebuild — the plugin
// skips transactions without a doc change or selection change.
watch(
  () => props.placeholder,
  (next) => {
    currentPlaceholder = next ?? "";
    if (!editor.value) return;
    const { state, view } = editor.value;
    view.dispatch(state.tr.setSelection(state.selection));
  },
);

/** Imperative helpers for template-ref access: `editorRef.value.focus()` */
defineExpose({
  /** The underlying tiptap editor instance (`undefined` until mounted) */
  editor,
  focus: (position?: "start" | "end" | number | null) => editor.value?.commands.focus(position),
  blur: () => editor.value?.commands.blur(),
  clear: () => editor.value?.commands.clearContent(),
  getHTML: () => editor.value?.getHTML() ?? "",
  getJSON: () => editor.value?.getJSON(),
});
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
