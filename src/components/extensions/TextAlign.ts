import type { TextAlignOptions as TiptapTextAlignOptions } from "@tiptap/extension-text-align";
import type { GeneralOptions } from "@/types";

import { TextAlign as TiptapTextAlign } from "@tiptap/extension-text-align";

import TextAlignButton from "@/components/ui-editor/menu-buttons/TextAlignMenu.vue";

export interface TextAlignOptions
  extends TiptapTextAlignOptions, GeneralOptions<TextAlignOptions> {}

export const TextAlign =
  /* @__PURE__ */ TiptapTextAlign.extend<TextAlignOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapTextAlignOptions),
        button: ({ editor, t }) => ({
          component: TextAlignButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
