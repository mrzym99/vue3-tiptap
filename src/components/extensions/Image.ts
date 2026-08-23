import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import type { GeneralOptions } from "@/types";

import { Image as TiptapImage } from "@tiptap/extension-image";
import RiImageLine from "~icons/lucide/image";
import MediaDialogButton from "@/components/ui-editor/dialog-button/MediaDialogButton.vue";

export interface ImageOptions extends TiptapImageOptions, GeneralOptions {}

export const Image = /* @__PURE__ */ TiptapImage.extend<ImageOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapImageOptions),
      button: ({ editor, t }) => ({
        component: MediaDialogButton,
        componentProps: {
          editor,
          t,
          icon: RiImageLine,
          tooltip: t("image"),
          placeholder: t("imagePlaceholder"),
          onSubmit: (payload: {
            src: string;
            width?: number;
            height?: number;
          }) => editor.chain().focus().setImage(payload).run(),
        },
      }),
    };
  },
});
