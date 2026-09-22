import { onUnmounted, watch, type Ref } from "vue";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import { checkLimit } from "@/utils/text";

/**
 * v-model two-way binding for the editor: debounced `editor.getHTML()` write-back
 * to `modelValue`, and (on create) `limit` truncation.
 *
 * Typing/formatting past `limit` is blocked by the official `CharacterCount`
 * `limit` plugin (component-configured), so no per-keystroke truncation happens
 * here. This composable only trims once — on `handleCreate`, when the initial
 * content already exceeds `limit` — via `checkLimit`, and emits `truncated`.
 *
 * The component's `onUpdate` writes the debounced HTML back, so serializing on
 * every keystroke (O(n) for large docs) is avoided. Any pending write-back is
 * flushed on unmount.
 */
export interface UseEditorModelOptions {
  /**
   * The editor instance (undefined until mounted), passed as a ref.
   *
   * Use a SHALLOW ref (as `@tiptap/vue-3`'s `useEditor` returns). A deep `ref()`
   * wraps the Editor in a reactive proxy, and dispatching through that proxy
   * (setContent / deleteRange) fails ProseMirror's transaction checks.
   */
  editor: Ref<Editor | undefined>;
  /** The v-model binding (write-back target). `defineModel` must stay in the component. */
  modelValue: Ref<string>;
  /** Current `limit` (0 = unlimited), as a getter so it stays live. */
  limit: () => number;
  /** Called on every content-changing transaction (debounced write-back handled inside). */
  onUpdate?: (editor: Editor, transaction: Transaction) => void;
  /** Called when initial content exceeded `limit` and was trimmed on create. */
  onTruncated?: (limit: number) => void;
}

export function useEditorModel(options: UseEditorModelOptions) {
  const { editor, modelValue, limit, onUpdate, onTruncated } = options;

  const MODEL_SYNC_DELAY = 300;
  let modelSyncTimer: ReturnType<typeof setTimeout> | undefined;

  // A value that changed before the editor instance was ready (`useEditor`
  // creates the instance on mount, so the initial watcher run can race with it).
  let pendingContent: string | undefined;

  const flushModelValue = () => {
    if (!modelSyncTimer) return;
    clearTimeout(modelSyncTimer);
    modelSyncTimer = undefined;
    if (editor.value) modelValue.value = editor.value.getHTML();
  };
  onUnmounted(flushModelValue);

  const syncModelValue = () => {
    if (modelSyncTimer) clearTimeout(modelSyncTimer);
    modelSyncTimer = setTimeout(flushModelValue, MODEL_SYNC_DELAY);
  };

  /**
   * onCreate: apply a value that arrived before the editor was created, and
   * truncate the initial content if it already exceeds `limit`.
   */
  const handleCreate = (created: Editor) => {
    if (pendingContent !== undefined && pendingContent !== created.getHTML()) {
      created.commands.setContent(pendingContent, { emitUpdate: false });
    }
    // Only truncate/write back when the initial content actually got truncated —
    // otherwise an empty document would immediately rewrite the parent value
    // from "" to "<p></p>".
    // Guard the fast-path read the same way checkLimit does: CharacterCount
    // isn't guaranteed to be loaded, fall back to plain text length.
    const currentLimit = limit();
    const current =
      created.storage.characterCount?.characters?.() ?? created.getText({ blockSeparator: "" }).length;
    if (currentLimit && current > currentLimit) {
      checkLimit(created, currentLimit);
      modelValue.value = created.getHTML();
      onTruncated?.(currentLimit);
    }
  };

  /**
   * Call from the editor's `onUpdate`. Typing/formatting beyond `limit` is
   * blocked by the official `CharacterCount` plugin (`limit` + `autoTrim:
   * false`, configured by the component) BEFORE it reaches the document, so no
   * post-commit truncation is needed here — just forward the update and debounce
   * the write-back.
   */
  const handleUpdate = (created: Editor, transaction: Transaction) => {
    onUpdate?.(created, transaction);
    syncModelValue();
  };

  /** Wire the modelValue → editor direction (external value set → setContent). */
  const watchModel = () =>
    watch(modelValue, (newValue) => {
      if (!editor.value) {
        pendingContent = newValue;
        return;
      }
      if (newValue === editor.value.getHTML()) return;
      editor.value.commands.setContent(newValue);
    });

  return { handleCreate, handleUpdate, watchModel, flush: flushModelValue };
}