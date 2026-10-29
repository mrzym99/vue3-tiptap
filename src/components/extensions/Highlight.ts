import type { HighlightOptions as TiptapHighlightOptions } from "@tiptap/extension-highlight";
import type { GeneralOptions } from "@/types";

import { Highlight as TiptapHighlight } from "@tiptap/extension-highlight";

export interface HighlightOptions extends TiptapHighlightOptions, GeneralOptions {}

export const Highlight = /* @__PURE__ */ TiptapHighlight.extend<HighlightOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapHighlightOptions),
      multicolor: true,
      button: undefined,
    };
  },
});
