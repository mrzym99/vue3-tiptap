import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { Image } from "./Image";
import { ImageUpload, embedAsDataURL, pendingImageUploads } from "./ImageUpload";
import type { ImageUploadOptions } from "./ImageUpload";

function createEditor() {
  return new Editor({
    content: "",
    extensions: [Document, Paragraph, Text, Image, ImageUpload],
    element: document.createElement("div"),
  });
}

describe("ImageUpload", () => {
  it("`setImageUploadNode` inserts an upload zone at the selection", () => {
    const editor = createEditor();
    editor.commands.setImageUploadNode();
    expect(editor.getJSON().content?.map((node) => node.type)).toEqual(["imageUpload"]);
    editor.destroy();
  });

  it("keeps the id across serialisation so FileHandler can hand its files to the node view", () => {
    const editor = createEditor();
    const file = new File(["x"], "x.png", { type: "image/png" });
    pendingImageUploads.set("pending-1", [file]);
    editor.commands.setImageUploadNode({ id: "pending-1" });
    expect(editor.getHTML()).toContain('data-id="pending-1"');
    expect(pendingImageUploads.get("pending-1")).toEqual([file]);
    pendingImageUploads.delete("pending-1");
    editor.destroy();
  });

  it("round-trips a rendered zone back into the same node", () => {
    const editor = createEditor();
    editor.commands.setContent('<div data-type="image-upload" data-id="a"></div>');
    const node = editor.getJSON().content?.[0];
    expect(node?.type).toBe("imageUpload");
    expect(node?.attrs?.id).toBe("a");
    editor.destroy();
  });

  it("falls back to the built-in uploader (inline data URL) when the host configures none", async () => {
    const editor = createEditor();
    const upload = (
      editor.extensionManager.extensions.find((ext) => ext.name === "imageUpload")!.options as ImageUploadOptions
    ).upload;
    expect(upload).toBe(embedAsDataURL);
    const file = new File(["x"], "x.png", { type: "image/png" });
    await expect(embedAsDataURL(file)).resolves.toMatch(/^data:image\/png;base64,/);
    editor.destroy();
  });
});
