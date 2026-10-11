import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import type { GeneralOptions, ImageUploader } from "@/types";

import { Image as TiptapImage } from "@tiptap/extension-image";
import ImageDialogButton from "@/components/ui-editor/toolbar/dialog-buttons/ImageDialogButton.vue";
import { createResizableMediaView } from "@/utils/resizableMediaView";
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
    };
  },

  // Shared drag resize (same as Video): corners + edge handles, width/height
  // dragged independently; Shift temporarily locks the aspect ratio.
  addNodeView() {
    return createResizableMediaView({
      nodeName: "image",
      directions: ["top-left", "top-right", "bottom-left", "bottom-right", "left", "right", "top", "bottom"],
      preserveAspectRatio: false,
      createElement: (node) => {
        const img = document.createElement("img");
        img.src = node.attrs.src;
        img.alt = node.attrs.alt ?? node.attrs.title ?? "";
        return img;
      },
    });
  },
});
