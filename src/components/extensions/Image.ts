import type { ImageOptions as TiptapImageOptions } from "@tiptap/extension-image";
import type { GeneralOptions } from "@/types";

import { Image as TiptapImage } from "@tiptap/extension-image";
import ImageButton from "@/components/ui-editor/toolbar/buttons/ImageButton.vue";
import { resizableDirections } from "@/constants";
import { createResizableMediaView } from "@/utils/resizableMediaView";
import { withButton } from "@/utils/button";

export interface ImageOptions extends TiptapImageOptions, GeneralOptions {}

export const Image = /* @__PURE__ */ TiptapImage.extend<ImageOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapImageOptions),
      button: withButton(ImageButton),
    };
  },

  // Shared drag resize (same as Video): corners + edge handles, width/height
  // dragged independently; Shift temporarily locks the aspect ratio.
  addNodeView() {
    return createResizableMediaView({
      nodeName: "image",
      directions: resizableDirections,
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
