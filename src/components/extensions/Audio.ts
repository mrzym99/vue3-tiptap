import type { AudioOptions as TiptapAudioOptions } from "@tiptap/extension-audio";
import type { GeneralOptions } from "@/types";

import { Audio as TiptapAudio } from "@tiptap/extension-audio";
import RiVolumeUpLine from "~icons/lucide/volume-2";
import UrlDialogButton from "@/components/ui-common/url-dialog-button/index.vue";

export interface AudioOptions extends TiptapAudioOptions, GeneralOptions {}

export const Audio = /* @__PURE__ */ TiptapAudio.extend<AudioOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapAudioOptions),
      button: ({ editor, t }) => ({
        component: UrlDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiVolumeUpLine,
          tooltip: t("audio"),
          placeholder: t("audioPlaceholder"),
          onSubmit: (url: string) =>
            editor.chain().focus().setAudio({ src: url }).run(),
        },
      }),
    };
  },
});
