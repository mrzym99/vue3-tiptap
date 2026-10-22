import type { Editor } from "@tiptap/core";
import type { FileHandlerOptions as TiptapFileHandlerOptions } from "@tiptap/extension-file-handler";

import { FileHandler as TiptapFileHandler } from "@tiptap/extension-file-handler";
import type { ImageOptions } from "./Image";

export interface FileHandlerOptions extends TiptapFileHandlerOptions {}

/** The host's uploader, if `Image.configure({ upload })` was set (same channel as the insert dialog). */
function imageUploader(editor: Editor): ImageOptions["upload"] {
  const ext = editor.extensionManager.extensions.find((candidate) => candidate.name === "image");
  return (ext?.options as ImageOptions | undefined)?.upload;
}

/**
 * Insert dropped/pasted image files — via the host's uploader when configured
 * (avoids multi-MB base64 blobs in the document), else as base64. Returns true
 * when any file was handled.
 */
function handleImageFiles(editor: Editor, files: File[]): boolean {
  let handled = false;
  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    handled = true;
    const upload = imageUploader(editor);
    if (upload) {
      upload(file)
        .then((url) => {
          editor.chain().focus().setImage({ src: url }).run();
        })
        .catch((error: unknown) => {
          // uploader failures surface in the host's own UI; here just don't swallow them silently
          console.warn("[tiptap] image upload failed:", error);
        });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        editor.chain().focus().setImage({ src: reader.result }).run();
      }
    };
    reader.onerror = () => {
      console.warn("[tiptap] failed to read pasted/dropped image:", file.name);
    };
    reader.readAsDataURL(file);
  });
  return handled;
}

export const FileHandler = TiptapFileHandler.configure({
  // no image/svg+xml: stored SVG is a stored-XSS vector when hosts re-serve the HTML
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  onDrop: (editor, files) => handleImageFiles(editor, files),
  onPaste: (editor, files) => handleImageFiles(editor, files),
});
