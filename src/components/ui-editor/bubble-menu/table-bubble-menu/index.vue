<template>
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :get-referenced-virtual-element="getReferencedVirtualElement"
    :options="bubbleOptions"
  >
    <div class="table-bubble">
      <ActionButton
        :icon="RowInsertBottomIcon"
        :tooltip="t('addRowAfter')"
        :disabled="!editor.can().addRowAfter()"
        :action="() => editor.chain().focus().addRowAfter().run()"
      />
      <ActionButton
        :icon="ColumnInsertRightIcon"
        :tooltip="t('addColumnAfter')"
        :disabled="!editor.can().addColumnAfter()"
        :action="() => editor.chain().focus().addColumnAfter().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
        :icon="RowRemoveIcon"
        :tooltip="t('deleteRow')"
        :disabled="!editor.can().deleteRow()"
        :action="() => editor.chain().focus().deleteRow().run()"
      />
      <ActionButton
        :icon="ColumnRemoveIcon"
        :tooltip="t('deleteColumn')"
        :disabled="!editor.can().deleteColumn()"
        :action="() => editor.chain().focus().deleteColumn().run()"
      />
      <span class="table-bubble-sep" />
      <!-- merge needs a multi-cell selection, split needs an already-merged cell -->
      <ActionButton
        :icon="MergeCellsIcon"
        :tooltip="t('mergeCells')"
        :disabled="!editor.can().mergeCells()"
        :action="() => editor.chain().focus().mergeCells().run()"
      />
      <ActionButton
        :icon="SplitCellsIcon"
        :tooltip="t('splitCell')"
        :disabled="!editor.can().splitCell()"
        :action="() => editor.chain().focus().splitCell().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
        :icon="ToggleHeaderIcon"
        :tooltip="t('toggleHeaderRow')"
        :disabled="!editor.can().toggleHeaderRow()"
        :action="() => editor.chain().focus().toggleHeaderRow().run()"
      />
      <span class="table-bubble-sep" />
      <ActionButton
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
import RowInsertBottomIcon from "~icons/tabler/row-insert-bottom";
import ColumnInsertRightIcon from "~icons/tabler/column-insert-right";
import RowRemoveIcon from "~icons/tabler/row-remove";
import ColumnRemoveIcon from "~icons/tabler/column-remove";
import MergeCellsIcon from "~icons/lucide/table-cells-merge";
import SplitCellsIcon from "~icons/lucide/table-cells-split";
import ToggleHeaderIcon from "~icons/tabler/arrows-exchange";
import DeleteTableIcon from "~icons/tabler/trash";

const props = defineProps<{ editor: Editor }>();

const { t } = useTiptapLocale();

// Anchor below the table (flip to top when there's no room below)
const bubbleOptions = {
  placement: "bottom" as const,
  offset: 8,
  shift: { padding: 8 },
};

// Anchor to the `<table>` node so the bar stays at the table bottom instead
// of floating above the caret; `null` falls back to selection-based positioning.
function getReferencedVirtualElement(): HTMLElement | null {
  const { view, state } = props.editor;
  const { $from } = state.selection;
  for (let d = $from.depth; d >= 0; d--) {
    if ($from.node(d).type.name === "table") {
      const dom = view.nodeDOM($from.before(d));
      return dom instanceof HTMLElement ? dom : null;
    }
  }
  return null;
}

// Show for a caret inside a cell or a CellSelection (drag-selected cells);
// non-collapsed text selections go to the regular formatting bubble.
// (`editor` is typed loosely: tiptap's shouldShow passes its own Editor subclass.)
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
