<template>
  <Popover trigger="click" placement="bottom-start">
    <template #trigger>
      <ActionButton
        :editor="editor"
        :is-active="() => isActive"
        :disabled="disabled"
        :icon="RiTableLine"
        :tooltip="t('table')"
      >
        <template #suffix>
          <RiArrowDropDownLine />
        </template>
      </ActionButton>
    </template>

    <div class="tiptap-table-popover">
      <div class="tiptap-table-ops">
        <Popover ref="insertTablePopoverRef" placement="right" trigger="click">
          <template #trigger>
            <button type="button" class="tiptap-menu-item">
              <component :is="RiTableLine" />
              <span>{{ t("insertTable") }}</span>
            </button>
          </template>
          <!-- Grid map for picking the insert size by hovering -->
          <div class="tiptap-table-grid">
            <div
              v-for="(cell, i) in gridCells"
              :key="i"
              class="tiptap-table-cell"
              :class="{ active: cell.row < hoverRows && cell.col < hoverCols }"
              @mousedown.prevent
              @mouseenter="
                hoverRows = cell.row + 1;
                hoverCols = cell.col + 1;
              "
              @click="insertTable(cell.row + 1, cell.col + 1)"
            />
          </div>
          <div class="tiptap-table-grid-label">
            {{ insertLabel }}
          </div>
        </Popover>
      </div>
      <!-- Table-editing operations (only relevant while inside a table) -->
      <div class="tiptap-table-divider" />
      <div class="tiptap-table-ops">
        <button
          v-for="(item, i) in opsItems"
          :key="i"
          type="button"
          class="tiptap-menu-item"
          :disabled="item.disabled"
          @click="item.action?.()"
        >
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </Popover>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
// Table actions use tabler icons; merge/split cells have no tabler
// equivalent, so they fall back to lucide.
import RiTableLine from "~icons/tabler/table";
import RiArrowDropDownLine from "~icons/tabler/chevron-down";
import RowInsertBottomIcon from "~icons/tabler/row-insert-bottom";
import ColumnRemoveIcon from "~icons/tabler/column-remove";
import RowRemoveIcon from "~icons/tabler/row-remove";
import ColumnInsertRightIcon from "~icons/tabler/column-insert-right";
import RiMergeCellsHorizontal from "~icons/lucide/table-cells-merge";
import RiSplitCellsHorizontal from "~icons/lucide/table-cells-split";
import ArrowsExchangeIcon from "~icons/tabler/arrows-exchange";
import RiDeleteBinLine from "~icons/tabler/trash";
import ActionButton from "@/components/ui-common/action-button/index.vue";
import Popover from "@/components/ui-common/popover/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

type GridCell = { row: number; col: number };

const props = defineProps<EXTActionButtonProps>();

const t = props.t;

/** Maximum grid dimension users can slide across to pick a size. */
const MAX_ROWS = 10;
const MAX_COLS = 10;

const hoverRows = ref(2);
const hoverCols = ref(2);

const gridCells = computed<GridCell[]>(() => {
  const cells: GridCell[] = [];
  for (let r = 0; r < MAX_ROWS; r++) {
    for (let c = 0; c < MAX_COLS; c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
});

const insertLabel = computed(() =>
  t("insertTableGrid")
    .replace("{rows}", `${hoverRows.value}`)
    .replace("{cols}", `${hoverCols.value}`),
);

const insertTablePopoverRef = ref<InstanceType<typeof Popover> | null>(null);
function insertTable(rows: number, cols: number) {
  if (!props.editor.can().insertTable({ rows, cols })) return;
  props.editor
    .chain()
    .focus()
    .insertTable({ rows, cols, withHeaderRow: true })
    .run();
  insertTablePopoverRef.value?.doClose();
}

function tableOp(
  label: string,
  icon: any,
  run: () => void,
): ActionMenuButtonItem {
  return {
    label,
    icon,
    action: run,
    disabled: !props.editor.isActive("table"),
    isActive: () => false,
  };
}

const inTable = computed(() => props.editor.isActive("table"));

const opsItems = computed<ActionMenuButtonItem[]>(() => [
  tableOp(t("addRowAfter"), RowInsertBottomIcon, () =>
    props.editor.chain().focus().addRowAfter().run(),
  ),
  tableOp(t("addColumnAfter"), ColumnInsertRightIcon, () =>
    props.editor.chain().focus().addColumnAfter().run(),
  ),
  tableOp(t("deleteRow"), RowRemoveIcon, () =>
    props.editor.chain().focus().deleteRow().run(),
  ),
  tableOp(t("deleteColumn"), ColumnRemoveIcon, () =>
    props.editor.chain().focus().deleteColumn().run(),
  ),
  tableOp(t("mergeCells"), RiMergeCellsHorizontal, () =>
    props.editor.chain().focus().mergeOrSplit().run(),
  ),
  tableOp(t("splitCell"), RiSplitCellsHorizontal, () =>
    props.editor.chain().focus().splitCell().run(),
  ),
  tableOp(t("toggleHeaderRow"), ArrowsExchangeIcon, () =>
    props.editor.chain().focus().toggleHeaderRow().run(),
  ),
  tableOp(t("deleteTable"), RiDeleteBinLine, () =>
    props.editor.chain().focus().deleteTable().run(),
  ),
]);

const disabled = computed(() => {
  // keep the menu enabled (grid insertion always possible), but reflect the
  // editing ops being unavailable when not inside a table
  return !props.editor.can().insertTable({ rows: 1, cols: 1 });
});
const isActive = computed(() => inTable.value);
</script>

<style lang="scss" scoped>
.tiptap-table-popover {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap-sm);
  min-width: 160px;
}

.tiptap-table-grid {
  display: grid;
  grid-template-columns: repeat(10, 16px);
  grid-template-rows: repeat(10, 16px);
  border-left: 1px solid var(--tiptap-color-border);
  border-top: 1px solid var(--tiptap-color-border);
  padding: var(--tiptap-padding-sm);
}

.tiptap-table-cell {
  cursor: pointer;
  border-right: 1px solid var(--tiptap-color-border);
  border-bottom: 1px solid var(--tiptap-color-border);

  &:hover,
  &.active {
    background-color: var(--tiptap-color-border-strong);
  }
}

.tiptap-table-grid-label {
  color: var(--tiptap-color-text);
  font-size: var(--tiptap-font-size-sm, 0.8125rem);
  text-align: center;
  user-select: none;
}

.tiptap-table-divider {
  border-top: 1px solid var(--tiptap-color-border, #d0d7de);
  margin: var(--tiptap-gap-sm) 0;
}

.tiptap-table-ops {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap-xs);
}

.tiptap-menu-item {
  align-items: center;
  background: none;
  border: none;
  border-radius: var(--tiptap-border-radius-md);
  color: var(--tiptap-color-text);
  cursor: pointer;
  display: flex;
  font-size: var(--tiptap-font-size);
  gap: var(--tiptap-gap);
  padding: var(--tiptap-padding-sm) var(--tiptap-padding-md);
  text-align: left;
  width: 100%;

  &:hover:not(:disabled) {
    background-color: var(--tiptap-menu-item-hover);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
