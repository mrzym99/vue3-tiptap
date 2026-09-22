import type { TextAlignOptions as TiptapTextAlignOptions } from "@tiptap/extension-text-align";
import type { GeneralOptions } from "@/types";

import { TextAlign as TiptapTextAlign } from "@tiptap/extension-text-align";

import TextAlignMenuButton from "@/components/ui-editor/toolbar/menu-buttons/TextAlignMenuButton.vue";
import { withButton } from "@/utils/button";

export interface TextAlignOptions extends TiptapTextAlignOptions, GeneralOptions {}

export const TextAlign = /* @__PURE__ */ TiptapTextAlign.extend<TextAlignOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTextAlignOptions),
      button: withButton(TextAlignMenuButton),
    };
  },
});
