import type { LinkOptions as TiptapLinkOptions } from "@tiptap/extension-link";
import type { GeneralOptions } from "@/types";

import { Link as TiptapLink } from "@tiptap/extension-link";

import LinkDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/LinkDialogButton.vue";
import LinkBubbleMenu from "@/components/ui-editor/bubble-menu/link-bubble-menu/index.vue";
import { withButton } from "@/utils/button";

export interface LinkOptions extends TiptapLinkOptions, GeneralOptions {
  /** URL check for the insert dialog — upstream `validate` option, kept required-identical to satisfy both parents. */
  validate: (url: string) => boolean;
}

export const Link = /* @__PURE__ */ TiptapLink.extend<LinkOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapLinkOptions),
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      button: withButton(LinkDialogButton),
      bubbleMenu: withButton(LinkBubbleMenu),
    };
  },
});
