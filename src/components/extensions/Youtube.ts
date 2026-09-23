import type { YoutubeOptions as TiptapYoutubeOptions } from "@tiptap/extension-youtube";
import type { GeneralOptions } from "@/types";

import { Youtube as TiptapYoutube } from "@tiptap/extension-youtube";
import YoutubeDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/YoutubeDialogButton.vue";
import { withButton } from "@/utils/button";

export interface YoutubeOptions extends TiptapYoutubeOptions, GeneralOptions {}

export const Youtube = /* @__PURE__ */ TiptapYoutube.extend<YoutubeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapYoutubeOptions),
      controls: true,
      nocookie: false,
      button: withButton(YoutubeDialogButton),
    };
  },
});
