import type { BlockquoteOptions as TiptapBlockquoteOptions } from "@tiptap/extension-blockquote";
import type { GeneralOptions } from "@/types";

import { Blockquote as TiptapBlockquote } from "@tiptap/extension-blockquote";

import BlockquoteButton from "@/components/ui-editor/buttons/BlockquoteButton.vue";

export interface BlockquoteOptions
  extends TiptapBlockquoteOptions, GeneralOptions<BlockquoteOptions> {}

export const Blockquote =
  /* @__PURE__ */ TiptapBlockquote.extend<BlockquoteOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapBlockquoteOptions),
        button: ({ editor, t }) => ({
          component: BlockquoteButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
