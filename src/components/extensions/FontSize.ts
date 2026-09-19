import type { FontSizeOptions as TiptapFontSizeOptions } from "@tiptap/extension-text-style/font-size";
import type { GeneralOptions } from "@/types";

import { FontSize as TiptapFontSize } from "@tiptap/extension-text-style/font-size";

import FontSizeMenuButton from "@/components/ui-editor/toolbar/menu-buttons/FontSizeMenuButton.vue";
import { withButton } from "@/utils/button";

export interface FontSizeOptions
  extends TiptapFontSizeOptions, GeneralOptions {}

export const FontSize =
  /* @__PURE__ */ TiptapFontSize.extend<FontSizeOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapFontSizeOptions),
        button: withButton(FontSizeMenuButton),
      };
    },
  });
