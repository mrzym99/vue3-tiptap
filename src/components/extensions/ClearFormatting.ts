import { Extension } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

import ClearFormattingButton from "@/components/ui-editor/toolbar/buttons/ClearFormattingButton.vue";
import { withButton } from "@/utils/button";

export interface ClearFormattingOptions extends GeneralOptions {}

/** One-click removal of inline marks + block types on the selection (pure PM commands). */
export const ClearFormatting = /* @__PURE__ */ Extension.create<ClearFormattingOptions>({
  // Must match the button key used in `defaultToolbar`
  name: "clearFormatting",
  addOptions() {
    return {
      button: withButton(ClearFormattingButton),
    };
  },
});
