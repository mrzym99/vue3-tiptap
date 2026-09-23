<template>
  <ThemeProvider :theme="theme" :theme-overrides="themeOverrides">
    <section class="tiptap-box" v-if="editor">
      <ToolBar :editor="editor" :toolbar="props.toolbar" />
      <EditorContent :editor="editor" />
      <BubbleMenuBar :editor="editor" :toolbar="props.bubbleMenu" />
      <FloatingMenuBar :editor="editor" :toolbar="props.floatingMenu" />
      <ExtensionBubbleMenus :editor="editor" />
      <CharacterLimit :editor="editor" :limit="props.limit" />
    </section>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from "@/components/ui-common/theme-provider/index.vue";
import ToolBar from "@/components/ui-editor/toolbar/index.vue";
import EditorContent from "@/components/ui-editor/editor-content/index.vue";
import BubbleMenuBar from "@/components/ui-editor/bubble-menu/index.vue";
import ExtensionBubbleMenus from "@/components/ui-editor/bubble-menu/extension-bubble-menus/index.vue";
import FloatingMenuBar from "@/components/ui-editor/bubble-menu/floating-menu/index.vue";
import CharacterLimit from "@/components/ui-editor/character-limit/index.vue";
import { computed, toRef } from "vue";
import { useEditor } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import type { TipTapEditorProps } from "@/types";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extensions";
import { useEditorLocale } from "@/composables/useEditorLocale";
import { useEditorModel } from "@/composables/useEditorModel";

const props = withDefaults(defineProps<TipTapEditorProps>(), {
  limit: 0,
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
});

// Self-contained locale context (no vue-i18n needed)
const { t } = useEditorLocale(toRef(props, "locale"), toRef(props, "translations"));

const emit = defineEmits<{
  focus: [payload: { editor: Editor; event: FocusEvent; transaction: Transaction }];
  blur: [payload: { editor: Editor; event: FocusEvent; transaction: Transaction }];
  /** Emitted on every content-changing transaction (before the debounced v-model write-back) */
  update: [payload: { editor: Editor; transaction: Transaction }];
  /** The editor instance was created and is ready to use */
  ready: [editor: Editor];
  /** Content exceeded `limit` and was truncated */
  truncated: [info: { limit: number }];
}>();

const modelValue = defineModel<string>({ required: true });

// Placeholder stays reactive: the option accepts a function, re-evaluated per
// decoration rebuild. Falls back to the locale pack when the prop is unset.
const effectivePlaceholder = computed(() => {
  if (props.placeholder !== undefined) return props.placeholder;
  const localized = t("placeholder");
  // Untranslated custom locale → no placeholder (t returns the bare key)
  return localized === "placeholder" ? "" : localized;
});
// Hosts opt in via the `extensions` prop; later entries win on name conflicts.
const STRUCTURAL_NAMES = new Set(["doc", "paragraph", "text", "placeholder"]);

// `limit` works without the host importing CharacterCount: typing past the
// limit is rejected at the ProseMirror level (`autoTrim: false`); create-time
// over-limit trimming is owned by useEditorModel.handleCreate (emits `truncated`).
// `limit` is read once at editor creation — live changes don't take effect.
const needsLimit = props.limit > 0;
const structuralNames = needsLimit ? new Set([...STRUCTURAL_NAMES, "characterCount"]) : STRUCTURAL_NAMES;
const userExtensions = [...new Map(props.extensions.map((e) => [e.name, e])).values()].filter(
  (e) => !structuralNames.has(e.name),
);
const mergedExtensions = [
  Document,
  Paragraph,
  Text,
  Placeholder.configure({
    placeholder: () => effectivePlaceholder.value,
  }),
  ...(needsLimit ? [CharacterCount.configure({ limit: props.limit, autoTrim: false })] : []),
  ...userExtensions,
];

const editor = useEditor({
  content: modelValue.value,
  extensions: mergedExtensions,
  editable: !props.disabled,
  autofocus: props.autofocus,
  onCreate: ({ editor: created }) => {
    model.handleCreate(created);
    emit("ready", created);
  },
  onUpdate: ({ editor: created, transaction }) => {
    model.handleUpdate(created, transaction);
  },
  onFocus: (props) => emit("focus", props),
  onBlur: (props) => emit("blur", props),
});

// v-model binding + limit truncation; defined after `editor` — the callbacks
// above run post-mount, so referencing `model` inside them is safe.
const model = useEditorModel({
  editor,
  modelValue,
  limit: () => props.limit,
  onUpdate: (ed, tr) => emit("update", { editor: ed, transaction: tr }),
  onTruncated: (max) => emit("truncated", { limit: max }),
});
model.watchModel();

watch(
  () => props.disabled,
  (newValue) => {
    if (!editor.value) return;
    editor.value.setEditable(!newValue);
  },
);

// Sync runtime placeholder changes (prop or locale) and force a decoration
// rebuild — the plugin skips transactions without a doc or selection change.
watch(effectivePlaceholder, () => {
  if (!editor.value) return;
  const { state, view } = editor.value;
  view.dispatch(state.tr.setSelection(state.selection));
});

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
</style>
