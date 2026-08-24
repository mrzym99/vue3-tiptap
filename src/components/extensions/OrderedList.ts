import type { OrderedListOptions as TiptapOrderedListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { OrderedList as TiptapOrderedList } from "@tiptap/extension-list";

import OrderedListButton from "@/components/ui-editor/toolbar/buttons/OrderedListButton.vue";

export interface OrderedListOptions
  extends TiptapOrderedListOptions, GeneralOptions {}

export const OrderedList =
  /* @__PURE__ */ TiptapOrderedList.extend<OrderedListOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapOrderedListOptions),
        button: ({ editor, t }) => ({
          component: OrderedListButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
