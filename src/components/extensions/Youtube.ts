import type { YoutubeOptions as TiptapYoutubeOptions } from "@tiptap/extension-youtube";
import type { GeneralOptions } from "@/types";

import { Youtube as TiptapYoutube } from "@tiptap/extension-youtube";
import RiYoutubeLine from "~icons/lucide/youtube";
import MediaDialogButton from "@/components/ui-editor/dialog-button/MediaDialogButton.vue";

export interface YoutubeOptions extends TiptapYoutubeOptions, GeneralOptions {}

export const Youtube = /* @__PURE__ */ TiptapYoutube.extend<YoutubeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapYoutubeOptions),
      controls: true,
      nocookie: false,
      resizeAble: true,
      button: ({ editor, t }) => ({
        component: MediaDialogButton,
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
