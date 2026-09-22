import type { BlockquoteOptions as TiptapBlockquoteOptions } from "@tiptap/extension-blockquote";
import type { GeneralOptions } from "@/types";

import { Blockquote as TiptapBlockquote } from "@tiptap/extension-blockquote";

import BlockquoteButton from "@/components/ui-editor/toolbar/buttons/BlockquoteButton.vue";
import { withButton } from "@/utils/button";

export interface BlockquoteOptions extends TiptapBlockquoteOptions, GeneralOptions {}

export const Blockquote = /* @__PURE__ */ TiptapBlockquote.extend<BlockquoteOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapBlockquoteOptions),
      button: withButton(BlockquoteButton),
    };
  },
});
