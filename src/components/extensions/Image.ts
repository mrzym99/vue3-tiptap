import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import type { GeneralOptions } from "@/types";

import { Image as TiptapImage } from "@tiptap/extension-image";
import { RiImageLine } from "@remixicon/vue";
import UrlDialogButton from "@/components/ui-common/url-dialog-button/index.vue";

export interface ImageOptions extends TiptapImageOptions, GeneralOptions {}

export const Image = /* @__PURE__ */ TiptapImage.extend<ImageOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapImageOptions),
      button: ({ editor, t }) => ({
        component: UrlDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiImageLine,
          tooltip: t("image"),
          placeholder: t("imagePlaceholder"),
          onSubmit: (url: string) =>
            editor.chain().focus().setImage({ src: url }).run(),
        },
      }),
    };
  },
});
