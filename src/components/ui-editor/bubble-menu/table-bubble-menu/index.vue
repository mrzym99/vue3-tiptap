<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :tippy-options="tippyOptions"
  >
    <div class="table-bubble">
      <ActionButton
        :editor="editor"
        :icon="RowInsertBottomIcon"
        :tooltip="t('addRowAfter')"
        :disabled="!editor.can().addRowAfter()"
        :action="() => editor.chain().focus().addRowAfter().run()"
      />
      <ActionButton
        :editor="editor"
        :icon="ColumnInsertRightIcon"
        :tooltip="t('addColumnAfter')"
        :disabled="!editor.can().addColumnAfter()"
        :action="() => editor.chain().focus().addColumnAfter().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
        :editor="editor"
        :icon="RowRemoveIcon"
        :tooltip="t('deleteRow')"
        :disabled="!editor.can().deleteRow()"
        :action="() => editor.chain().focus().deleteRow().run()"
      />
      <ActionButton
        :editor="editor"
        :icon="ColumnRemoveIcon"
        :tooltip="t('deleteColumn')"
        :disabled="!editor.can().deleteColumn()"
        :action="() => editor.chain().focus().deleteColumn().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
        :editor="editor"
        :icon="MergeCellsIcon"
        :tooltip="t('mergeCells')"
        :disabled="!editor.can().mergeOrSplit()"
        :action="() => editor.chain().focus().mergeOrSplit().run()"
      />
      <ActionButton
        :editor="editor"
        :icon="SplitCellsIcon"
        :tooltip="t('splitCell')"
        :disabled="!editor.can().splitCell()"
        :action="() => editor.chain().focus().splitCell().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
        :editor="editor"
        :icon="ToggleHeaderIcon"
        :tooltip="t('toggleHeaderRow')"
        :disabled="!editor.can().toggleHeaderRow()"
        :action="() => editor.chain().focus().toggleHeaderRow().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
        :editor="editor"
        :icon="DeleteTableIcon"
        :tooltip="t('deleteTable')"
        :disabled="!editor.can().deleteTable()"
        :action="() => editor.chain().focus().deleteTable().run()"
      />
    </div>
  </BubbleMenu>
</template>

<script lang="ts" setup>
import { BubbleMenu } from "@tiptap/vue-3/menus";
import type { Editor } from "@tiptap/vue-3";
import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { CellSelection } from "@tiptap/pm/tables";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import { useTiptapLocale } from "@/locales";
// Table actions use tabler icons; merge/split cells have no tabler
// equivalent, so they fall back to lucide (same as the table menu button).
import RowInsertBottomIcon from "~icons/tabler/row-insert-bottom";
import ColumnInsertRightIcon from "~icons/tabler/column-insert-right";
import RowRemoveIcon from "~icons/tabler/row-remove";
import ColumnRemoveIcon from "~icons/tabler/column-remove";
import MergeCellsIcon from "~icons/lucide/table-cells-merge";
import SplitCellsIcon from "~icons/lucide/table-cells-split";
import ToggleHeaderIcon from "~icons/tabler/arrows-exchange";
import DeleteTableIcon from "~icons/tabler/trash";

defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();

const tippyOptions = {
  duration: 150,
  maxWidth: "none",
  appendTo: () => document.body,
};

/**
 * Show when the caret sits inside a table cell (a plain cell click) or cells
 * are drag-selected (CellSelection). A non-collapsed text selection inside a
 * cell is left to the regular text-formatting bubble; the link/media bubbles
 * take over when their node is active.
 * (`editor` is typed loosely: tiptap's shouldShow passes its own Editor
 *  subclass, which differs from the @tiptap/vue-3 Editor type.)
 */
function shouldShow({
  editor: e,
  state,
}: {
  editor: any;
  element: HTMLElement;
  view: EditorView;
  state: EditorState;
  oldState?: EditorState;
  from: number;
  to: number;
}) {
  if (!e.isActive("table")) return false;
  if (state.selection instanceof CellSelection) return true;
  return state.selection.empty;
}
</script>

<style lang="scss" scoped>
.table-bubble {
  align-items: center;
  background-color: var(--tiptap-color-bg);
  border: 1px solid var(--tiptap-color-border);
  border-radius: var(--tiptap-border-radius-md);
  box-shadow: var(--tiptap-popover-shadow);
  display: flex;
  gap: var(--tiptap-gap-xs);
  padding: var(--tiptap-padding-sm);
}

.table-bubble-sep {
  align-self: stretch;
  background-color: var(--tiptap-color-border);
  margin: 0 var(--tiptap-gap-xs);
  width: 1px;
}
</style>
