import type { ColorOptions as TiptapColorOptions } from "@tiptap/extension-text-style";
import type { GeneralOptions } from "@/types";

import { Color as TiptapColor } from "@tiptap/extension-text-style";

import ColorMenuButton from "@/components/ui-editor/toolbar/menu-buttons/ColorMenuButton.vue";
import { withButton } from "@/utils/button";

export interface ColorOptions extends TiptapColorOptions, GeneralOptions {}

export const Color = /* @__PURE__ */ TiptapColor.extend<ColorOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapColorOptions),
      button: withButton(ColorMenuButton),
    };
  },
});
