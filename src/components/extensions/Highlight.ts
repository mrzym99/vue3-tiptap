import type { HighlightOptions as TiptapHighlightOptions } from "@tiptap/extension-highlight";
import type { GeneralOptions } from "@/types";

import { Highlight as TiptapHighlight } from "@tiptap/extension-highlight";

import HighlightButton from "@/components/ui-editor/toolbar/buttons/HighlightButton.vue";
import { withButton } from "@/utils/button";

export interface HighlightOptions
  extends TiptapHighlightOptions, GeneralOptions {}

export const Highlight =
  /* @__PURE__ */ TiptapHighlight.extend<HighlightOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapHighlightOptions),
        button: withButton(HighlightButton),
      };
    },
  });
