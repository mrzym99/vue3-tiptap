import type { TableOptions as TiptapTableOptions } from "@tiptap/extension-table";
import type { GeneralOptions } from "@/types";

import {
  Table as TiptapTable,
  TableCell as TiptapTableCell,
  TableHeader as TiptapTableHeader,
  TableRow as TiptapTableRow,
} from "@tiptap/extension-table";

import TableMenuButton from "@/components/ui-editor/toolbar/menu-buttons/TableMenuButton.vue";
import { withButton } from "@/utils/button";

export interface TableOptions extends TiptapTableOptions, GeneralOptions {}

/**
 * Table grid. Composed explicitly (not via `TableKit`) rather than the
 * kitchen-sink aggregator: `TableKit` wraps its own inner `Table` node that is
 * *also* named `table`, so wrapping it and naming the wrapper `table` produces
 * "Duplicate extension names found: ['table']". Registering the four pieces
 * individually keeps a single `table` extension (the one carrying the toolbar
 * button) while giving the editor the row/header/cell structure it needs.
 */
export const Table = TiptapTable.extend<TableOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTableOptions),
      resizable: true,
      button: withButton(TableMenuButton),
    };
  },
});

/** Row/header/cell structure, registered alongside {@link Table}. */
export const TableRow = TiptapTableRow;
export const TableHeader = TiptapTableHeader;
export const TableCell = TiptapTableCell;
