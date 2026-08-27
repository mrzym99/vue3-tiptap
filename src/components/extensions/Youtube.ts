import type { YoutubeOptions as TiptapYoutubeOptions } from "@tiptap/extension-youtube";
import type { GeneralOptions } from "@/types";

import { Youtube as TiptapYoutube } from "@tiptap/extension-youtube";
import YoutubePopoverButton from "@/components/ui-editor/toolbar/popover-buttons/YoutubePopoverButton.vue";

export interface YoutubeOptions extends TiptapYoutubeOptions, GeneralOptions {}

export const Youtube = /* @__PURE__ */ TiptapYoutube.extend<YoutubeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapYoutubeOptions),
      controls: true,
      nocookie: false,
      button: ({ editor, t }) => ({
        component: YoutubePopoverButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
