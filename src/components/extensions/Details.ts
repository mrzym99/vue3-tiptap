import type { DetailsOptions as TiptapDetailsOptions } from "@tiptap/extension-details";
import type { GeneralOptions } from "@/types";

import { Details as TiptapDetails } from "@tiptap/extension-details";

import DetailsButton from "@/components/ui-editor/buttons/DetailsButton.vue";

export { DetailsSummary, DetailsContent } from "@tiptap/extension-details";

export interface DetailsOptions
  extends TiptapDetailsOptions, GeneralOptions {}

export const Details = /* @__PURE__ */ TiptapDetails.extend<DetailsOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapDetailsOptions),
      open: false,
      persist: false,
      button: ({ editor, t }) => ({
        component: DetailsButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
