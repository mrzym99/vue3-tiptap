import type { Editor } from "@tiptap/core";
import type { FileHandlerOptions as TiptapFileHandlerOptions } from "@tiptap/extension-file-handler";

import { FileHandler as TiptapFileHandler } from "@tiptap/extension-file-handler";
import { pendingImageUploads } from "./ImageUpload";

export interface FileHandlerOptions extends TiptapFileHandlerOptions {}

let uploadSequence = 0;

/**
 * Insert an image upload zone for the dropped/pasted files and queue them for its
 * node view (the zone uploads and replaces itself with the images).
 */
function insertImageUploadZone(editor: Editor, files: File[], position?: number): boolean {
  const images = files.filter((file) => file.type.startsWith("image/"));
  // Without the ImageUpload extension there is no zone to insert — leave the files to the host
  if (!images.length || !editor.schema.nodes.imageUpload) return false;
  const id = `image-upload-${++uploadSequence}`;
  pendingImageUploads.set(id, images);
  const node = { type: "imageUpload", attrs: { id } };
  const chain = editor.chain().focus();
  if (typeof position === "number") {
    chain.insertContentAt(position, node).run();
  } else {
    chain.insertContent(node).run();
  }
  return true;
}

export const FileHandler = TiptapFileHandler.configure({
  // no image/svg+xml: stored SVG is a stored-XSS vector when hosts re-serve the HTML
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  onDrop: (editor, files, position) => insertImageUploadZone(editor, files, position),
  onPaste: (editor, files) => insertImageUploadZone(editor, files),
});
