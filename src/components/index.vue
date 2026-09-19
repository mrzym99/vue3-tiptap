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
      <span v-if="props.maxLength" class="max-limit">
        {{ editor.storage.characterCount?.characters?.() ?? editor.getText().length }} / {{ props.maxLength }}
      </span>
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
import { toRef } from "vue";
import { useEditor } from "@tiptap/vue-3";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import type { TipTapEditorProps } from "@/types";
import type { LocaleName, LocaleTranslations } from "@/locales";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extensions";
import { useEditorLocale } from "@/composables/useEditorLocale";
import { useEditorModel } from "@/composables/useEditorModel";
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
  },
);

// Self-contained locale context (no vue-i18n / global instance needed)
useEditorLocale(toRef(props, "locale"), toRef(props, "translations"));

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

// Placeholder stays reactive: `extension.options` is a getter that re-runs
// `addOptions()` on every access, so mutating options at runtime is useless.
// The option also accepts a function, which the plugin re-evaluates whenever
// it rebuilds decorations — close over a mutable variable for live updates.
let currentPlaceholder = props.placeholder ?? "";
// The editor ships no built-ins automatically: hosts opt in via the
// `extensions` prop (e.g. `StarterKit.configure(...)`) or hand-pick
// individual extensions. Later entries win on name conflicts; the structural
// core (document / paragraph / text / placeholder) is always the component's.
const STRUCTURAL_NAMES = new Set(["doc", "paragraph", "text", "placeholder"]);

// When `maxLength` is set, add the official `CharacterCount` limit ourselves so
// the prop works without the host importing the extension: typing/formatting
// past the limit is REJECTED at the ProseMirror level (`autoTrim: false` keeps
// the plugin from lazily trimming during edits; create-time over-limit trimming
// is owned by `useEditorModel.handleCreate`, which also emits `truncated`).
// Note: `limit` is fixed at editor-creation — live `maxLength` changes won't
// re-take effect (the plugin reads its options when constructed).
const needsLimit = props.maxLength > 0;
const structuralNames = needsLimit
  ? new Set([...STRUCTURAL_NAMES, "characterCount"])
  : STRUCTURAL_NAMES;
const userExtensions = [...new Map(props.extensions.map((e) => [e.name, e])).values()].filter(
  (e) => !structuralNames.has(e.name),
);
const mergedExtensions = [
  Document, // 文档根节点
  Paragraph, // 段落
  Text, // 文本
  Placeholder.configure({
    placeholder: () => currentPlaceholder,
  }),
  ...(needsLimit ? [CharacterCount.configure({ limit: props.maxLength, autoTrim: false })] : []),
  ...userExtensions,
];

const editor = useEditor({
  content: modelValue.value,
  extensions: mergedExtensions,
  editable: !props.disabled,
  autofocus: props.autofocus,
  onCreate: ({ editor: created }) => {
    // Apply a value that changed before the editor was created + initial
    // maxLength truncation (lives in the model composable)
    model.handleCreate(created);
    emit("ready", created);
  },
  onUpdate: ({ editor: created, transaction }) => {
    // maxLength truncation + `update` emit + debounced write-back
    model.handleUpdate(created, transaction);
  },
  onFocus: (props) => emit("focus", props),
  onBlur: (props) => emit("blur", props),
});

// v-model two-way binding + maxLength truncation (debounced HTML write-back
// and external-value sync). Defined after `editor` so the composable can read
// the editor ref; the callbacks above run post-mount, so referencing `model`
// here is safe.
const model = useEditorModel({
  editor,
  modelValue,
  maxLength: () => props.maxLength,
  onUpdate: (ed, tr) => emit("update", { editor: ed, transaction: tr }),
  onTruncated: (max) => emit("truncated", { maxLength: max }),
});
model.watchModel();

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