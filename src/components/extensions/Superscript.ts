import type { SuperscriptExtensionOptions as TiptapSuperscriptOptions } from "@tiptap/extension-superscript";
import type { GeneralOptions } from "@/types";

import { Superscript as TiptapSuperscript } from "@tiptap/extension-superscript";

import SuperscriptButton from "@/components/ui-editor/buttons/SuperscriptButton.vue";

export interface SuperscriptOptions
  extends TiptapSuperscriptOptions, GeneralOptions {}

export const Superscript =
  /* @__PURE__ */ TiptapSuperscript.extend<SuperscriptOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapSuperscriptOptions),
        button: ({ editor, t }) => ({
          component: SuperscriptButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
