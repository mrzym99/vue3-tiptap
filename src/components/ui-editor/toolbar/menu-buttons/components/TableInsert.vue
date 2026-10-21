<template>
  <div>
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
  </div>
</template>

<script lang="ts" setup>
import type { TranslateFn } from "@/types";

const props = defineProps<{ t: TranslateFn }>();

type GridCell = { row: number; col: number };

const emit = defineEmits<{ insert: [{ rows: number; cols: number }] }>();

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

const t = props.t;
const insertLabel = computed(() =>
  t("insertTableGrid").replace("{rows}", `${hoverRows.value}`).replace("{cols}", `${hoverCols.value}`),
);

function insertTable(rows: number, cols: number) {
  emit("insert", { rows, cols });
  hoverRows.value = 2;
  hoverCols.value = 2;
}
</script>

<style lang="scss" scoped>
.tiptap-table-grid {
  display: grid;
  grid-template-columns: repeat(10, 16px);
  grid-template-rows: repeat(10, 16px);
  border-left: 1px solid var(--tiptap-color-border);
  border-top: 1px solid var(--tiptap-color-border);
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
</style>
