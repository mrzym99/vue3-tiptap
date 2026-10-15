import type { BulletListOptions as TiptapBulletListOptions } from "@tiptap/extension-list";
import type { GeneralOptions } from "@/types";

import { BulletList as TiptapBulletList } from "@tiptap/extension-list";

import ListMenuButton from "@/components/ui-editor/toolbar/menu-buttons/ListMenuButton.vue";
import { withButton } from "@/utils/button";

export interface BulletListOptions extends TiptapBulletListOptions, GeneralOptions {}

export const BulletList = /* @__PURE__ */ TiptapBulletList.extend<BulletListOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapBulletListOptions),
      button: withButton(ListMenuButton),
    };
  },
});
