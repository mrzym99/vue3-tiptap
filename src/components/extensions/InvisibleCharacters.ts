import type { InvisibleCharactersOptions as TiptapInvisibleCharactersOptions } from "@tiptap/extension-invisible-characters";
import type { GeneralOptions } from "@/types";

import { InvisibleCharacters as TiptapInvisibleCharacters } from "@tiptap/extension-invisible-characters";

import InvisibleCharactersButton from "@/components/ui-editor/toolbar/buttons/InvisibleCharactersButton.vue";
import { withButton } from "@/utils/button";

export interface InvisibleCharactersOptions
  extends TiptapInvisibleCharactersOptions, GeneralOptions {}

export const InvisibleCharacters =
  /* @__PURE__ */ TiptapInvisibleCharacters.extend<InvisibleCharactersOptions>({
    addOptions() {
      return {
        // NOTE: default is `visible: true`, which shows paragraph marks (¶)
        // on every block right away — keep hidden until toggled by the button.
        ...(this.parent?.() as TiptapInvisibleCharactersOptions),
        visible: false,
        button: withButton(InvisibleCharactersButton),
      };
    },
  });
