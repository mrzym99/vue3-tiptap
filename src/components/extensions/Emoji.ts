import type { EmojiOptions as TiptapEmojiOptions } from "@tiptap/extension-emoji";
import type { GeneralOptions } from "@/types";

import { Emoji as TiptapEmoji, emojis as emojiData } from "@tiptap/extension-emoji";

import EmojiMenuButton from "@/components/ui-editor/toolbar/menu-buttons/EmojiMenuButton.vue";
import { withButton } from "@/utils/button";

export interface EmojiOptions extends TiptapEmojiOptions, GeneralOptions {}

export const Emoji = /* @__PURE__ */ TiptapEmoji.extend<EmojiOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapEmojiOptions),
      emojis: emojiData,
      button: withButton(EmojiMenuButton),
    };
  },
});
