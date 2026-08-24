import type { LinkOptions as TiptapLinkOptions } from "@tiptap/extension-link";
import type { GeneralOptions } from "@/types";

import { Link as TiptapLink } from "@tiptap/extension-link";

import LinkButton from "@/components/ui-editor/toolbar/buttons/LinkButton.vue";

export interface LinkOptions extends TiptapLinkOptions, GeneralOptions {}

export const Link = /* @__PURE__ */ TiptapLink.extend<LinkOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapLinkOptions),
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      button: ({ editor, t }) => ({
        component: LinkButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
