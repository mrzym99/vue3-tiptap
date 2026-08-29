import { Extension } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

import ClearFormattingButton from "@/components/ui-editor/toolbar/buttons/ClearFormattingButton.vue";

export interface ClearFormattingOptions extends GeneralOptions {}

/**
 * One-click removal of all inline marks (bold/italic/code/highlight/color/
 * fontFamily/…) on the selection plus resetting block types (heading,
 * blockquote, …) back to plain paragraph.
 *
 * Pure ProseMirror commands, zero extra dependencies.
 */
export const ClearFormatting = /* @__PURE__ */ Extension.create<ClearFormattingOptions>({
  addOptions() {
    return {
      button: ({ editor, t }) => ({
        component: ClearFormattingButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
