import type { ItalicOptions as TiptapItalicOptions } from "@tiptap/extension-italic";
import type { GeneralOptions } from "@/types";

import { Italic as TiptapItalic } from "@tiptap/extension-italic";

import ItalicButton from "@/components/ui-editor/toolbar/buttons/ItalicButton.vue";
import { withButton } from "@/utils/button";

export interface ItalicOptions extends TiptapItalicOptions, GeneralOptions {}

export const Italic = /* @__PURE__ */ TiptapItalic.extend<ItalicOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapItalicOptions),
      button: withButton(ItalicButton),
    };
  },
});
