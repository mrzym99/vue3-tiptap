<template>
  <Popover
    v-model:show="menuPopoverShow"
    trigger="click"
    placement="bottom-start"
  >
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
        <Popover
          v-model:show="insertTablePopoverShow"
          ref="insertTablePopoverRef"
          placement="right"
          trigger="hover"
        >
          <template #trigger>
            <button type="button" class="tiptap-menu-item">
              <component :is="RiTableLine" />
              <span>{{ t("insertTable") }}</span>
            </button>
          </template>
          <TableInsert :t="t" @insert="insertTable" />
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
import TableInsert from "@/components/ui-editor/toolbar/menu-buttons/components/TableInsert.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

const t = props.t;
const menuPopoverShow = ref(false);
const insertTablePopoverShow = ref(false);
function insertTable({ rows, cols }: { rows: number; cols: number }) {
  if (!props.editor.can().insertTable({ rows, cols })) return;
  props.editor
    .chain()
    .focus()
    .insertTable({ rows, cols, withHeaderRow: true })
    .run();
  insertTablePopoverShow.value = false;
  menuPopoverShow.value = false;
}

function tableOp(
  label: string,
  icon: any,
  run: () => void,
): ActionMenuButtonItem {
  return {
    label,
    icon,
    action: () => {
      run();
      menuPopoverShow.value = false;
    },
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
