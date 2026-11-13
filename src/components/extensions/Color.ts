import type { ColorOptions as TiptapColorOptions } from "@tiptap/extension-text-style";
import type { GeneralOptions } from "@/types";

import { Color as TiptapColor } from "@tiptap/extension-text-style";

import ColorMenuButton from "@/components/ui-editor/toolbar/menu-buttons/ColorMenuButton.vue";
import { defaultHighlightColors, defaultTextColors } from "@/constants";
import { withButton } from "@/utils/button";

export interface ColorOptions extends TiptapColorOptions, GeneralOptions {
  /** Text-color palette — the first entry is the "clear" swatch. */
  textColors: string[];
  /** Highlight-color palette — the first entry is the "clear" swatch. */
  highlightColors: string[];
}

export const Color = /* @__PURE__ */ TiptapColor.extend<ColorOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapColorOptions),
      textColors: defaultTextColors,
      highlightColors: defaultHighlightColors,
      button: withButton(ColorMenuButton),
    };
  },
});
