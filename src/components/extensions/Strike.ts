import type { StrikeOptions as TiptapStrikeOptions } from "@tiptap/extension-strike";
import type { GeneralOptions } from "@/types";

import { Strike as TiptapStrike } from "@tiptap/extension-strike";

import StrikeButton from "@/components/ui-editor/toolbar/buttons/StrikeButton.vue";
import { withButton } from "@/utils/button";

export interface StrikeOptions extends TiptapStrikeOptions, GeneralOptions {}

export const Strike = /* @__PURE__ */ TiptapStrike.extend<StrikeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapStrikeOptions),
      button: withButton(StrikeButton),
    };
  },
});
