import type { TableOptions as TiptapTableOptions } from "@tiptap/extension-table";
import type { GeneralOptions } from "@/types";

import {
  Table as TiptapTable,
  TableCell as TiptapTableCell,
  TableHeader as TiptapTableHeader,
  TableRow as TiptapTableRow,
} from "@tiptap/extension-table";

import TableMenuButton from "@/components/ui-editor/toolbar/menu-buttons/TableMenuButton.vue";
import TableBubbleMenu from "@/components/ui-editor/bubble-menu/table-bubble-menu/index.vue";
import { withButton } from "@/utils/button";

export interface TableOptions extends TiptapTableOptions, GeneralOptions {}

/**
 * Table grid, composed from the four pieces explicitly (not via `TableKit`,
 * whose inner `Table` causes a duplicate-name conflict) so a single `table`
 * extension carries the toolbar button + bubble menu.
 */
export const Table = TiptapTable.extend<TableOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTableOptions),
      resizable: true,
      button: withButton(TableMenuButton),
      // Floating toolbar while the caret is inside a table; disable with
      // `Table.configure({ bubbleMenu: false })`
      bubbleMenu: withButton(TableBubbleMenu),
    };
  },
});

/** Row/header/cell structure, registered alongside {@link Table}. */
export const TableRow = TiptapTableRow;
export const TableHeader = TiptapTableHeader;
export const TableCell = TiptapTableCell;
