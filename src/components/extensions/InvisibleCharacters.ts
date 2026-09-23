import type { InvisibleCharactersOptions as TiptapInvisibleCharactersOptions } from "@tiptap/extension-invisible-characters";

import { InvisibleCharacters as TiptapInvisibleCharacters } from "@tiptap/extension-invisible-characters";

export interface InvisibleCharactersOptions extends TiptapInvisibleCharactersOptions {}

export const InvisibleCharacters = /* @__PURE__ */ TiptapInvisibleCharacters.extend<InvisibleCharactersOptions>({
  addOptions() {
    return {
      // NOTE: default is `visible: true`, which shows paragraph marks (¶)
      // on every block right away — keep hidden; the host opts in via the
      // `showInvisibleCharacters` prop, which drives the show/hide commands.
      ...(this.parent?.() as TiptapInvisibleCharactersOptions),
      visible: false,
    };
  },
});
