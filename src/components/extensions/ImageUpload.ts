import type { ImageUploader } from "@/types";

import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ImageUploadNodeView from "@/components/ui-editor/image-upload-node/index.vue";

export interface ImageUploadOptions {
  /** File input `accept` filter, defaults to image only */
  accept: string;
  /** Max bytes per file, 0 = unlimited */
  maxSize: number;
  /** Max files per upload zone */
  limit: number;
  /** Host uploader; without it the zone only tells the user upload is not configured */
  upload?: ImageUploader;
  onError?: (error: Error) => void;
  onSuccess?: (url: string) => void;
}

/** Files queued by FileHandler for a zone created by id; the node view picks them up on mount. */
export const pendingImageUploads = new Map<string, File[]>();

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageUpload: {
      /** Insert an image upload zone at the selection */
      setImageUploadNode: (attrs?: { id?: string }) => ReturnType;
    };
  }
}

/**
 * Inline image upload zone (same model as Tiptap's ImageUploadNode): a block that
 * uploads the files it receives, then replaces itself with the resulting images.
 */
export const ImageUpload = /* @__PURE__ */ Node.create<ImageUploadOptions>({
  name: "imageUpload",
  group: "block",
  atom: true,
  selectable: false,

  addOptions() {
    return {
      accept: "image/*",
      maxSize: 0,
      limit: 3,
      upload: undefined,
      onError: undefined,
      onSuccess: undefined,
    };
  },

  addAttributes() {
    return {
      // Only used to hand files from FileHandler to the node view
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => (attributes.id ? { "data-id": attributes.id } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "image-upload" })];
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageUploadNodeView);
  },

  addCommands() {
    return {
      setImageUploadNode:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
