import type { Editor } from "@tiptap/core";
import type { FileHandlerOptions as TiptapFileHandlerOptions } from "@tiptap/extension-file-handler";

import { FileHandler as TiptapFileHandler } from "@tiptap/extension-file-handler";

export interface FileHandlerOptions extends TiptapFileHandlerOptions {}

/**
 * Handle dropped / pasted image files by inserting them as base64 images.
 * @returns true when at least one image file was handled
 */
function handleImageFiles(editor: Editor, files: File[]): boolean {
  let handled = false;
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          editor.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(file);
      handled = true;
    }
  });
  return handled;
}

export const FileHandler = TiptapFileHandler.configure({
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ],
  onDrop: (editor, files) => handleImageFiles(editor, files),
  onPaste: (editor, files) => handleImageFiles(editor, files),
});
