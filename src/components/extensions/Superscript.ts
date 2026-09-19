import type { SuperscriptExtensionOptions as TiptapSuperscriptOptions } from "@tiptap/extension-superscript";
import type { GeneralOptions } from "@/types";

import { Superscript as TiptapSuperscript } from "@tiptap/extension-superscript";

import SuperscriptButton from "@/components/ui-editor/toolbar/buttons/SuperscriptButton.vue";
import { withButton } from "@/utils/button";

export interface SuperscriptOptions
  extends TiptapSuperscriptOptions, GeneralOptions {}

export const Superscript =
  /* @__PURE__ */ TiptapSuperscript.extend<SuperscriptOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapSuperscriptOptions),
        button: withButton(SuperscriptButton),
      };
    },
  });
