import type { BulletListOptions as TiptapBulletListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { BulletList as TiptapBulletList } from "@tiptap/extension-list";

import BulletListButton from "@/components/ui-editor/toolbar/buttons/BulletListButton.vue";
import { withButton } from "@/utils/button";

export interface BulletListOptions extends TiptapBulletListOptions, GeneralOptions {}

export const BulletList = /* @__PURE__ */ TiptapBulletList.extend<BulletListOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapBulletListOptions),
      button: withButton(BulletListButton),
    };
  },
});
