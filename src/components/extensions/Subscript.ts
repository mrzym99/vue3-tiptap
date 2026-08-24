import type { SubscriptExtensionOptions as TiptapSubscriptOptions } from "@tiptap/extension-subscript";
import type { GeneralOptions } from "@/types";

import { Subscript as TiptapSubscript } from "@tiptap/extension-subscript";

import SubscriptButton from "@/components/ui-editor/toolbar/buttons/SubscriptButton.vue";

export interface SubscriptOptions
  extends TiptapSubscriptOptions, GeneralOptions {}

export const Subscript =
  /* @__PURE__ */ TiptapSubscript.extend<SubscriptOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapSubscriptOptions),
        button: ({ editor, t }) => ({
          component: SubscriptButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
