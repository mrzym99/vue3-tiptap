import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import type { GeneralOptions, ImageUploader } from "@/types";

import { Image as TiptapImage } from "@tiptap/extension-image";
import ImageDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/ImageDialogButton.vue";
import MediaBubbleMenu from "@/components/ui-editor/bubble-menu/media-bubble-menu/index.vue";
import { withButton } from "@/utils/button";

export interface ImageOptions extends TiptapImageOptions, GeneralOptions {
  /** Custom uploader; enables the "upload" tab: `Image.configure({ upload: async (file) => url })` */
  upload?: ImageUploader;
}

export const Image = /* @__PURE__ */ TiptapImage.extend<ImageOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapImageOptions),
      upload: undefined,
      button: withButton(ImageDialogButton),
      // Floating toolbar below the image while it is selected. Disable with
      // `Image.configure({ bubbleMenu: false })`.
      bubbleMenu: withButton(MediaBubbleMenu),
    };
  },
});
