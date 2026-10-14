<template>
  <ThemeProvider :theme="theme" :theme-overrides="themeOverrides">
    <section class="tiptap-box" v-if="editor">
      <ToolBar :editor="editor" :toolbar="props.toolbar" :wrap="props.toolbarWrap" :t="t" />
      <EditorContent :editor="editor" />
      <BubbleMenuBar :editor="editor" :toolbar="props.bubbleMenu" :t="t" />
      <FloatingMenuBar :editor="editor" :toolbar="props.floatingMenu" :t="t" />
      <ExtensionBubbleMenus :editor="editor" :t="t" />
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
  toolbarWrap: false,
  bubbleMenu: undefined,
  floatingMenu: undefined,
  showInvisibleCharacters: false,
  extensions: () => [],
});

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

// Function option keeps placeholder reactive; falls back to the locale pack
const effectivePlaceholder = computed(() => {
  if (props.placeholder !== undefined) return props.placeholder;
  const localized = t("placeholder");
  // Untranslated custom locale → no placeholder (t returns the bare key)
  return localized === "placeholder" ? "" : localized;
});
// Later entries win on name conflicts
const STRUCTURAL_NAMES = new Set(["doc", "paragraph", "text", "placeholder"]);

// Read once at creation: typing past the limit is rejected at the ProseMirror
// level; create-time trimming lives in useEditorModel (emits `truncated`)
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
    // The extension may be disabled by the host — guard before dispatching
    if (props.showInvisibleCharacters && typeof created.commands.showInvisibleCharacters === "function") {
      created.commands.showInvisibleCharacters();
    }
    model.handleCreate(created);
    emit("ready", created);
  },
  onUpdate: ({ editor: created, transaction }) => {
    model.handleUpdate(created, transaction);
  },
  onFocus: (props) => emit("focus", props),
  onBlur: (props) => emit("blur", props),
});

// Defined after `editor` — the callbacks above run post-mount
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

watch(
  () => props.showInvisibleCharacters,
  (visible) => {
    const ed = editor.value;
    if (ed && typeof ed.commands.showInvisibleCharacters === "function") {
      visible ? ed.commands.showInvisibleCharacters() : ed.commands.hideInvisibleCharacters();
    }
  },
);

// Force a decoration rebuild — the plugin skips transactions without a
// doc/selection change
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
  border-radius: var(--tiptap-border-radius-lg);
  color: var(--tiptap-color-text);
  background-color: var(--tiptap-color-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

<style lang="scss">
.tiptap-box,
.tiptap-box * {
  box-sizing: border-box;
}

/* 0.2s fade keeps theme switches in sync with the host app; component-level
   transitions win on specificity, so hover/press animations are unaffected. */
.tiptap-box,
.tiptap-box * {
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}
</style>
