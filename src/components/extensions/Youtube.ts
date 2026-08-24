import type { YoutubeOptions as TiptapYoutubeOptions } from "@tiptap/extension-youtube";
import type { GeneralOptions } from "@/types";

import { Youtube as TiptapYoutube } from "@tiptap/extension-youtube";
import RiYoutubeLine from "~icons/lucide/youtube";
import YoutubeDialogButton from "@/components/ui-editor/dialog-button/YoutubeDialogButton.vue";

export interface YoutubeOptions extends TiptapYoutubeOptions, GeneralOptions {}

export const Youtube = /* @__PURE__ */ TiptapYoutube.extend<YoutubeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapYoutubeOptions),
      controls: true,
      nocookie: false,
      button: ({ editor, t }) => ({
        component: YoutubeDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiYoutubeLine,
          tooltip: t("youtube"),
          placeholder: t("youtubePlaceholder"),
          onSubmit: (payload: {
            src: string;
            width?: number;
            height?: number;
          }) => editor.chain().focus().setYoutubeVideo(payload).run(),
        },
      }),
    };
  },
});
