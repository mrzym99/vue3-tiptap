import type { UnderlineOptions as TiptapUnderlineOptions } from "@tiptap/extension-underline";
import type { GeneralOptions } from "@/types";

import { Underline as TiptapUnderline } from "@tiptap/extension-underline";

import UnderlineButton from "@/components/ui-editor/toolbar/buttons/UnderlineButton.vue";

export interface UnderlineOptions
  extends TiptapUnderlineOptions, GeneralOptions {}

export const Underline =
  /* @__PURE__ */ TiptapUnderline.extend<UnderlineOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapUnderlineOptions),
        button: ({ editor, t }) => ({
          component: UnderlineButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
