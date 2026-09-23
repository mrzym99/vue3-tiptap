import type { TwitchOptions as TiptapTwitchOptions } from "@tiptap/extension-twitch";
import type { GeneralOptions } from "@/types";

import { Twitch as TiptapTwitch } from "@tiptap/extension-twitch";
import TwitchDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/TwitchDialogButton.vue";
import { withButton } from "@/utils/button";

export interface TwitchOptions extends TiptapTwitchOptions, GeneralOptions {}

export const Twitch = /* @__PURE__ */ TiptapTwitch.extend<TwitchOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTwitchOptions),
      button: withButton(TwitchDialogButton),
    };
  },
});
