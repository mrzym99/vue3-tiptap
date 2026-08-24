import type { TwitchOptions as TiptapTwitchOptions } from "@tiptap/extension-twitch";
import type { GeneralOptions } from "@/types";

import { Twitch as TiptapTwitch } from "@tiptap/extension-twitch";
import RiTwitchLine from "~icons/lucide/twitch";
import TwitchDialogButton from "@/components/ui-editor/toolbar/dialog-button/TwitchDialogButton.vue";

export interface TwitchOptions extends TiptapTwitchOptions, GeneralOptions {}

export const Twitch = /* @__PURE__ */ TiptapTwitch.extend<TwitchOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTwitchOptions),
      button: ({ editor, t }) => ({
        component: TwitchDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiTwitchLine,
          tooltip: t("twitch"),
          placeholder: t("twitchPlaceholder"),
          onSubmit: (payload: {
            src: string;
            width?: number;
            height?: number;
          }) => editor.chain().focus().setTwitchVideo(payload).run(),
        },
      }),
    };
  },
});
