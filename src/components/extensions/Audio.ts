import type { AudioOptions as TiptapAudioOptions } from "@tiptap/extension-audio";
import type { GeneralOptions } from "@/types";

import { Audio as TiptapAudio } from "@tiptap/extension-audio";
import RiVolumeUpLine from "~icons/lucide/volume-2";
import AudioDialogButton from "@/components/ui-editor/dialog-button/AudioDialogButton.vue";

export interface AudioOptions extends TiptapAudioOptions, GeneralOptions {}

export const Audio = /* @__PURE__ */ TiptapAudio.extend<AudioOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapAudioOptions),
      button: ({ editor, t }) => ({
        component: AudioDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiVolumeUpLine,
          tooltip: t("audio"),
          placeholder: t("audioPlaceholder"),
          onSubmit: (payload: { src: string }) =>
            editor.chain().focus().setAudio({ src: payload.src }).run(),
        },
      }),
    };
  },
});
