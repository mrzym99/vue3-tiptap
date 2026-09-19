import type { YoutubeOptions as TiptapYoutubeOptions } from "@tiptap/extension-youtube";
import type { GeneralOptions } from "@/types";

import { Youtube as TiptapYoutube } from "@tiptap/extension-youtube";
import YoutubePopoverButton from "@/components/ui-editor/toolbar/popover-buttons/YoutubePopoverButton.vue";
import MediaBubbleMenu from "@/components/ui-editor/bubble-menu/media-bubble-menu/index.vue";
import { withButton } from "@/utils/button";

export interface YoutubeOptions extends TiptapYoutubeOptions, GeneralOptions {}

export const Youtube = /* @__PURE__ */ TiptapYoutube.extend<YoutubeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapYoutubeOptions),
      controls: true,
      nocookie: false,
      button: withButton(YoutubePopoverButton),
      // Floating toolbar below the video while it is selected. Disable with
      // `Youtube.configure({ bubbleMenu: false })`.
      bubbleMenu: withButton(MediaBubbleMenu),
    };
  },
});
