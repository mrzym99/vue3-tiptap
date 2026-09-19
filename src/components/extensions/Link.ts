import type { LinkOptions as TiptapLinkOptions } from "@tiptap/extension-link";
import type { GeneralOptions } from "@/types";

import { Link as TiptapLink } from "@tiptap/extension-link";

import LinkDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/LinkDialogButton.vue";
import LinkBubbleMenu from "@/components/ui-editor/bubble-menu/link-bubble-menu/index.vue";
import { withButton } from "@/utils/button";

export interface LinkOptions extends TiptapLinkOptions, GeneralOptions {}

export const Link = /* @__PURE__ */ TiptapLink.extend<LinkOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapLinkOptions),
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      button: withButton(LinkDialogButton),
      // Floating toolbar below the link while the caret is inside it; rendered
      // by the editor component via the extension's `bubbleMenu` option.
      // Disable with `Link.configure({ bubbleMenu: false })`.
      bubbleMenu: withButton(LinkBubbleMenu),
    };
  },
});
