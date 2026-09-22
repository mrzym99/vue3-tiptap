import type { FindAndReplaceOptions as TiptapFindAndReplaceOptions } from "@tiptap/extension-find-and-replace";
import type { GeneralOptions } from "@/types";

import { FindAndReplace as TiptapFindAndReplace } from "@tiptap/extension-find-and-replace";

import FindAndReplaceButton from "@/components/ui-editor/toolbar/buttons/FindAndReplaceButton.vue";
import { withButton } from "@/utils/button";

export interface FindAndReplaceOptions extends TiptapFindAndReplaceOptions, GeneralOptions {}

export const FindAndReplace = /* @__PURE__ */ TiptapFindAndReplace.extend<FindAndReplaceOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapFindAndReplaceOptions),
      button: withButton(FindAndReplaceButton),
    };
  },
});
