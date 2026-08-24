import type { BoldOptions as TiptapBoldOptions } from "@tiptap/extension-bold";
import type { GeneralOptions } from "@/types";

import { Bold as TiptapBold } from "@tiptap/extension-bold";

import BoldButton from "@/components/ui-editor/toolbar/buttons/BoldButton.vue";

export interface BoldOptions extends TiptapBoldOptions, GeneralOptions {}

export const Bold = /* @__PURE__ */ TiptapBold.extend<BoldOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapBoldOptions),
      button: ({ editor, t }) => ({
        component: BoldButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
