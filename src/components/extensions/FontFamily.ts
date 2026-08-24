import type { FontFamilyOptions as TiptapFontFamilyOptions } from "@tiptap/extension-text-style";
import type { GeneralOptions } from "@/types";

import { FontFamily as TiptapFontFamily } from "@tiptap/extension-text-style";

import FontFamilyMenuButton from "@/components/ui-editor/toolbar/menu-buttons/FontFamilyMenuButton.vue";

export interface FontFamilyOptions
  extends TiptapFontFamilyOptions, GeneralOptions {}

export const FontFamily =
  /* @__PURE__ */ TiptapFontFamily.extend<FontFamilyOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapFontFamilyOptions),
        button: ({ editor, t }) => ({
          component: FontFamilyMenuButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
