import { onUnmounted, watch, type Ref } from "vue";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import { checkLimit } from "@/utils/text";

/**
 * v-model two-way binding: debounced HTML write-back to `modelValue`, plus
 * one-time `limit` truncation on create (typing past the limit is blocked by
 * the CharacterCount plugin, configured in the component).
 */
export interface UseEditorModelOptions {
  /**
   * The editor ref. Must be a SHALLOW ref — a deep ref proxies the Editor and
   * dispatched transactions then fail ProseMirror's checks.
   */
  editor: Ref<Editor | undefined>;
  /** The v-model binding. */
  modelValue: Ref<string>;
  /** Current `limit` (0 = unlimited). */
  limit: () => number;
  /** Called on every content-changing transaction. */
  onUpdate?: (editor: Editor, transaction: Transaction) => void;
  /** Called when initial content exceeded `limit` and was trimmed on create. */
  onTruncated?: (limit: number) => void;
}

export function useEditorModel(options: UseEditorModelOptions) {
  const { editor, modelValue, limit, onUpdate, onTruncated } = options;

  const MODEL_SYNC_DELAY = 300;
  let modelSyncTimer: ReturnType<typeof setTimeout> | undefined;

  // A value that changed before the editor instance existed (useEditor creates
  // it on mount, so the initial watcher run can race with it).
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

  /** onCreate: apply a pre-create value, trim initial content over `limit`. */
  const handleCreate = (created: Editor) => {
    if (pendingContent !== undefined && pendingContent !== created.getHTML()) {
      created.commands.setContent(pendingContent, { emitUpdate: false });
    }
    // Only write back when actually truncated — otherwise an empty document
    // would immediately rewrite the parent value "" → "<p></p>".
    const currentLimit = limit();
    const current =
      created.storage.characterCount?.characters?.() ?? created.getText({ blockSeparator: "" }).length;
    if (currentLimit && current > currentLimit) {
      checkLimit(created, currentLimit);
      modelValue.value = created.getHTML();
      onTruncated?.(currentLimit);
    }
  };

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
