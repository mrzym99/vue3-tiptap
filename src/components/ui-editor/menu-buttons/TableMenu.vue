<template>
  <ActionMenuButton
    :editor="editor"
    :icon="RiTableLine"
    :disabled="disabled"
    :is-active="isActive"
    :items="options"
    :tooltip="t('table')"
  >
    <template #suffix>
      <RiArrowDropDownLine size="24px" />
    </template>
  </ActionMenuButton>
</template>

<script lang="ts" setup>
import {
  RiTableLine,
  RiArrowDropDownLine,
  RiAddLine,
  RiSubtractLine,
  RiArrowDownLine,
  RiArrowRightLine,
  RiMergeCellsHorizontal,
  RiSplitCellsHorizontal,
  RiDeleteBinLine,
} from "@remixicon/vue";
import ActionMenuButton from "@/components/ui-common/action-menu-button/index.vue";
import type { EXTActionButtonProps } from "@/components/ui-common/action-button/props";
import type { ActionMenuButtonItem } from "@/components/ui-common/action-menu-button/type";

const props = defineProps<EXTActionButtonProps>();

const t = props.t;

function insertTableItem(rows: number, cols: number): ActionMenuButtonItem {
  return {
    label: t(`insertTable${rows}x${cols}`),
    icon: RiTableLine,
    action: () =>
      props.editor
        .chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: true })
        .run(),
    disabled: !props.editor.can().insertTable({ rows, cols }),
    isActive: () => false,
  };
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

const options = computed<ActionMenuButtonItem[]>(() => [
  insertTableItem(2, 2),
  insertTableItem(3, 3),
  insertTableItem(4, 4),
  tableOp(t("addRowAfter"), RiArrowDownLine, () =>
    props.editor.chain().focus().addRowAfter().run(),
  ),
  tableOp(t("addColumnAfter"), RiArrowRightLine, () =>
    props.editor.chain().focus().addColumnAfter().run(),
  ),
  tableOp(t("deleteRow"), RiSubtractLine, () =>
    props.editor.chain().focus().deleteRow().run(),
  ),
  tableOp(t("deleteColumn"), RiAddLine, () =>
    props.editor.chain().focus().deleteColumn().run(),
  ),
  tableOp(t("mergeCells"), RiMergeCellsHorizontal, () =>
    props.editor.chain().focus().mergeOrSplit().run(),
  ),
  tableOp(t("splitCell"), RiSplitCellsHorizontal, () =>
    props.editor.chain().focus().splitCell().run(),
  ),
  tableOp(t("toggleHeaderRow"), RiSubtractLine, () =>
    props.editor.chain().focus().toggleHeaderRow().run(),
  ),
  tableOp(t("deleteTable"), RiDeleteBinLine, () =>
    props.editor.chain().focus().deleteTable().run(),
  ),
]);

const disabled = computed(() => {
  // keep the menu enabled while inside a table so actions can be toggled
  return options.value.filter((item) => !item.disabled).length === 0;
});
const isActive = computed(() => inTable.value);
</script>
