import type { ItalicOptions as TiptapItalicOptions } from "@tiptap/extension-italic";
import type { GeneralOptions } from "@/types";

import { Italic as TiptapItalic } from "@tiptap/extension-italic";

import ItalicButton from "@/components/ui-editor/buttons/ItalicButton.vue";

export interface ItalicOptions
  extends TiptapItalicOptions, GeneralOptions<ItalicOptions> {}

export const Italic = /* @__PURE__ */ TiptapItalic.extend<ItalicOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapItalicOptions),
      button: ({ editor, t }) => ({
        component: ItalicButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
