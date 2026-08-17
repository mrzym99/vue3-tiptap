import type { TableKitOptions as TiptapTableKitOptions } from "@tiptap/extension-table";
import type { GeneralOptions } from "@/types";

import { TableKit as TiptapTableKit } from "@tiptap/extension-table";

import TableMenu from "@/components/ui-editor/menu-buttons/TableMenu.vue";

export interface TableOptions extends TiptapTableKitOptions, GeneralOptions {}

export const Table = /* @__PURE__ */ TiptapTableKit.extend<TableOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTableKitOptions),
      table: {
        resizable: true,
      },
      button: ({ editor, t }) => ({
        component: TableMenu,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
