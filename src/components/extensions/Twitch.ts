import type { TwitchOptions as TiptapTwitchOptions } from "@tiptap/extension-twitch";
import type { GeneralOptions } from "@/types";

import { Twitch as TiptapTwitch } from "@tiptap/extension-twitch";
import TwitchPopoverButton from "@/components/ui-editor/toolbar/popover-buttons/TwitchPopoverButton.vue";

export interface TwitchOptions extends TiptapTwitchOptions, GeneralOptions {}

export const Twitch = /* @__PURE__ */ TiptapTwitch.extend<TwitchOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTwitchOptions),
      button: ({ editor, t }) => ({
        component: TwitchPopoverButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
