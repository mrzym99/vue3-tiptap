import type { InvisibleCharactersOptions as TiptapInvisibleCharactersOptions } from "@tiptap/extension-invisible-characters";
import type { GeneralOptions } from "@/types";

import { InvisibleCharacters as TiptapInvisibleCharacters } from "@tiptap/extension-invisible-characters";

import InvisibleCharactersButton from "@/components/ui-editor/buttons/InvisibleCharactersButton.vue";

export interface InvisibleCharactersOptions
  extends TiptapInvisibleCharactersOptions, GeneralOptions {}

export const InvisibleCharacters =
  /* @__PURE__ */ TiptapInvisibleCharacters.extend<InvisibleCharactersOptions>(
    {
      addOptions() {
        return {
          ...(this.parent?.() as TiptapInvisibleCharactersOptions),
          button: ({ editor, t }) => ({
            component: InvisibleCharactersButton,
            componentProps: {
              editor,
              t,
            },
          }),
        };
      },
    },
  );
