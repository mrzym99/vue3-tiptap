import { onUnmounted, watch, type Ref } from "vue";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";

/** v-model binding: debounced write-back in the configured format + over-`limit` warning on create. */
export interface UseEditorModelOptions {
  /** Must be a SHALLOW ref — a deep ref breaks ProseMirror's transaction checks */
  editor: Ref<Editor | undefined>;
  /** The v-model binding. */
  modelValue: Ref<string>;
  /** v-model content format: `"html"` (default) or `"markdown"` */
  contentType?: () => "html" | "markdown";
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

  const format = options.contentType ?? (() => "html" as const);
  const getModelValue = () => (format() === "markdown" ? editor.value!.getMarkdown() : editor.value!.getHTML());

  const flushModelValue = () => {
    if (!modelSyncTimer) return;
    clearTimeout(modelSyncTimer);
    modelSyncTimer = undefined;
    if (editor.value) modelValue.value = getModelValue();
  };
  onUnmounted(flushModelValue);

  const syncModelValue = () => {
    if (modelSyncTimer) clearTimeout(modelSyncTimer);
    modelSyncTimer = setTimeout(flushModelValue, MODEL_SYNC_DELAY);
  };

  /** onCreate: apply a pre-create value, warn when initial content exceeds `limit`. */
  const handleCreate = (created: Editor) => {
    if (pendingContent !== undefined && pendingContent !== getModelValue()) {
      created.commands.setContent(pendingContent, { emitUpdate: false, contentType: format() });
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
      if (newValue === getModelValue()) return;
      editor.value.commands.setContent(newValue, { contentType: format() });
    });

  return { handleCreate, handleUpdate, watchModel, flush: flushModelValue };
}
