import type { AudioOptions as TiptapAudioOptions } from "@tiptap/extension-audio";
import type { GeneralOptions } from "@/types";

import { Audio as TiptapAudio } from "@tiptap/extension-audio";
import AudioDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/AudioDialogButton.vue";
import MediaBubbleMenu from "@/components/ui-editor/bubble-menu/media-bubble-menu/index.vue";
import { withButton } from "@/utils/button";

export interface AudioOptions extends TiptapAudioOptions, GeneralOptions {}

export const Audio = /* @__PURE__ */ TiptapAudio.extend<AudioOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapAudioOptions),
      button: withButton(AudioDialogButton),
      // Floating toolbar below the audio while it is selected. Disable with
      // `Audio.configure({ bubbleMenu: false })`.
      bubbleMenu: withButton(MediaBubbleMenu),
    };
  },
});
