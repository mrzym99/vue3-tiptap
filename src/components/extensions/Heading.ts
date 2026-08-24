import type { HeadingOptions as TiptapHeadingOptions } from "@tiptap/extension-heading";
import type { GeneralOptions } from "@/types";

import { Heading as TiptapHeading } from "@tiptap/extension-heading";

import HeadingMenuButton from "@/components/ui-editor/toolbar/menu-buttons/HeadingMenuButton.vue";

export interface HeadingOptions extends TiptapHeadingOptions, GeneralOptions {}

export const Heading = /* @__PURE__ */ TiptapHeading.extend<HeadingOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapHeadingOptions),
      button: ({ editor, t }) => ({
        component: HeadingMenuButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
