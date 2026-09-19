import type { AudioOptions as TiptapAudioOptions } from "@tiptap/extension-audio";
import type { GeneralOptions } from "@/types";

import { Audio as TiptapAudio } from "@tiptap/extension-audio";
import AudioPopoverButton from "@/components/ui-editor/toolbar/popover-buttons/AudioPopoverButton.vue";
import { withButton } from "@/utils/button";

export interface AudioOptions extends TiptapAudioOptions, GeneralOptions {}

export const Audio = /* @__PURE__ */ TiptapAudio.extend<AudioOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapAudioOptions),
      button: withButton(AudioPopoverButton),
    };
  },
});
