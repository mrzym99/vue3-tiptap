import type { HighlightOptions as TiptapHighlightOptions } from "@tiptap/extension-highlight";
import type { GeneralOptions } from "@/types";

import { Highlight as TiptapHighlight } from "@tiptap/extension-highlight";

import HighlightButton from "@/components/ui-editor/buttons/HighlightButton.vue";

export interface HighlightOptions
  extends TiptapHighlightOptions, GeneralOptions {}

export const Highlight =
  /* @__PURE__ */ TiptapHighlight.extend<HighlightOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapHighlightOptions),
        button: ({ editor, t }) => ({
          component: HighlightButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
