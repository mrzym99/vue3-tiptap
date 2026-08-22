import type { TwitchOptions as TiptapTwitchOptions } from "@tiptap/extension-twitch";
import type { GeneralOptions } from "@/types";

import { Twitch as TiptapTwitch } from "@tiptap/extension-twitch";
import RiTwitchLine from "~icons/lucide/twitch";
import UrlDialogButton from "@/components/ui-common/url-dialog-button/index.vue";

export interface TwitchOptions extends TiptapTwitchOptions, GeneralOptions {}

export const Twitch = /* @__PURE__ */ TiptapTwitch.extend<TwitchOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapTwitchOptions),
      button: ({ editor, t }) => ({
        component: UrlDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiTwitchLine,
          tooltip: t("twitch"),
          placeholder: t("twitchPlaceholder"),
          onSubmit: (url: string) =>
            editor.chain().focus().setTwitchVideo({ src: url }).run(),
        },
      }),
    };
  },
});
