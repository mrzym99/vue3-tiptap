import { onUnmounted, watch, type Ref } from "vue";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";

/** v-model binding: debounced HTML write-back + over-`limit` warning on create. */
export interface UseEditorModelOptions {
  /** Must be a SHALLOW ref — a deep ref breaks ProseMirror's transaction checks */
  editor: Ref<Editor | undefined>;
  /** The v-model binding. */
  modelValue: Ref<string>;
  /** Current `limit` (0 = unlimited). */
  limit: () => number;
  /** Called on every content-changing transaction. */
  onUpdate?: (editor: Editor, transaction: Transaction) => void;
  /** Called when initial content exceeded `limit`. The content is NOT modified — the host decides what to do. */
  onTruncated?: (limit: number) => void;
}

export function useEditorModel(options: UseEditorModelOptions) {
  const { editor, modelValue, limit, onUpdate, onTruncated } = options;

  const MODEL_SYNC_DELAY = 150;
  let modelSyncTimer: ReturnType<typeof setTimeout> | undefined;

  // A value that changed before useEditor created the editor (mount race)
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

  /** onCreate: apply a pre-create value, warn when initial content exceeds `limit`. */
  const handleCreate = (created: Editor) => {
    if (pendingContent !== undefined && pendingContent !== created.getHTML()) {
      created.commands.setContent(pendingContent, { emitUpdate: false });
    }
    // Over-limit initial content is NOT trimmed: the library never rewrites
    // host content on its own — the host listens for the event and decides.
    const currentLimit = limit();
    const current = created.storage.characterCount?.characters?.() ?? created.getText({ blockSeparator: "" }).length;
    if (currentLimit && current > currentLimit) {
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
