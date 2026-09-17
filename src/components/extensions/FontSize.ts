import type { FontSizeOptions as TiptapFontSizeOptions } from "@tiptap/extension-text-style/font-size";
import type { GeneralOptions } from "@/types";

import { FontSize as TiptapFontSize } from "@tiptap/extension-text-style/font-size";

import FontSizeMenuButton from "@/components/ui-editor/toolbar/menu-buttons/FontSizeMenuButton.vue";

export interface FontSizeOptions
  extends TiptapFontSizeOptions, GeneralOptions {}

export const FontSize =
  /* @__PURE__ */ TiptapFontSize.extend<FontSizeOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapFontSizeOptions),
        button: ({ editor, t }) => ({
          component: FontSizeMenuButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
