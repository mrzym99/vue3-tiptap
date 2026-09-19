import { onUnmounted, watch, type Ref } from "vue";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import { checkLimit } from "@/utils/text";

/**
 * v-model two-way binding for the editor: debounced `editor.getHTML()` write-back
 * to `modelValue`, external-value → `setContent` sync, and `maxLength` truncation.
 *
 * The `onUpdate` handler in the component writes the debounced HTML back, so
 * serializing on every keystroke (O(n) for large docs) is avoided. `checkLimit`
 * truncation stays synchronous — it must apply immediately.
 *
 * Any pending write-back is flushed on unmount.
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
  /** Current `maxLength` (0 = unlimited), as a getter so it stays live. */
  maxLength: () => number;
  /** Called on every content-changing transaction (debounced write-back handled inside). */
  onUpdate?: (editor: Editor, transaction: Transaction) => void;
  /** Called when content exceeded `maxLength` and was truncated. */
  onTruncated?: (maxLength: number) => void;
}

export function useEditorModel(options: UseEditorModelOptions) {
  const { editor, modelValue, maxLength, onUpdate, onTruncated } = options;

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
   * truncate the initial content if it already exceeds `maxLength`.
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
    const limit = maxLength();
    const current =
      created.storage.characterCount?.characters?.() ?? created.getText({ blockSeparator: "" }).length;
    if (limit && current > limit) {
      checkLimit(created, limit);
      modelValue.value = created.getHTML();
      onTruncated?.(limit);
    }
  };

  /** Call from the editor's `onUpdate` (pre-truncation, keeping existing order). */
  const handleUpdate = (created: Editor, transaction: Transaction) => {
    const limit = maxLength();
    if (checkLimit(created, limit)) onTruncated?.(limit);
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