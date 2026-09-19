import type { HeadingOptions as TiptapHeadingOptions } from "@tiptap/extension-heading";
import type { GeneralOptions } from "@/types";

import { Heading as TiptapHeading } from "@tiptap/extension-heading";

import HeadingMenuButton from "@/components/ui-editor/toolbar/menu-buttons/HeadingMenuButton.vue";
import { withButton } from "@/utils/button";

export interface HeadingOptions extends TiptapHeadingOptions, GeneralOptions {}

export const Heading = /* @__PURE__ */ TiptapHeading.extend<HeadingOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapHeadingOptions),
      button: withButton(HeadingMenuButton),
    };
  },
});
