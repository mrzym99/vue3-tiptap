import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import type { GeneralOptions, ImageUploader } from "@/types";

import { Image as TiptapImage } from "@tiptap/extension-image";
import RiImageLine from "~icons/lucide/image";
import ImagePopoverButton from "@/components/ui-editor/toolbar/popover-buttons/ImagePopoverButton.vue";

export interface ImageOptions extends TiptapImageOptions, GeneralOptions {
  /**
   * Custom image uploader. Configure the extension to enable the "upload"
   * tab in the image dialog:
   * `Image.configure({ upload: async (file) => url })`
   */
  upload?: ImageUploader;
}

export const Image = /* @__PURE__ */ TiptapImage.extend<ImageOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapImageOptions),
      upload: undefined,
      button: ({ editor, t }) => ({
        component: ImagePopoverButton,
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
