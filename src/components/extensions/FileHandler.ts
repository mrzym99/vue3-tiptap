import type { Editor } from "@tiptap/core";
import type { FileHandlerOptions as TiptapFileHandlerOptions } from "@tiptap/extension-file-handler";

import { FileHandler as TiptapFileHandler } from "@tiptap/extension-file-handler";

export interface FileHandlerOptions extends TiptapFileHandlerOptions {}

/** Insert dropped/pasted image files as base64 images; returns true when any was handled. */
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
  // no image/svg+xml: stored SVG is a stored-XSS vector when hosts re-serve the HTML
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  onDrop: (editor, files) => handleImageFiles(editor, files),
  onPaste: (editor, files) => handleImageFiles(editor, files),
});
