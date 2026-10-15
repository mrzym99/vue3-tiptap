import type { OrderedListOptions as TiptapOrderedListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { OrderedList as TiptapOrderedList } from "@tiptap/extension-list";

export interface OrderedListOptions extends TiptapOrderedListOptions, Omit<GeneralOptions, "button"> {}

export const OrderedList = /* @__PURE__ */ TiptapOrderedList.extend<OrderedListOptions>({});
