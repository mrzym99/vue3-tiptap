import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { StarterKit } from "./index";

function createKitEditor() {
  return new Editor({
    content: "",
    extensions: [Document, Paragraph, Text, StarterKit],
    element: document.createElement("div"),
  });
}

describe("Markdown", () => {
  it("is bundled in the StarterKit", () => {
    const editor = createKitEditor();
    expect(editor.extensionManager.extensions.some((e) => e.name === "markdown")).toBe(true);
    editor.destroy();
  });

  it("round-trips markdown content in and out", () => {
    const editor = createKitEditor();
    editor.commands.setContent("# Title\n\n```ts\nconst a = 1\n```\n\n**bold** and _italic_", {
      contentType: "markdown",
    });

    const markdown = editor.getMarkdown();
    expect(markdown).toContain("# Title");
    expect(markdown).toContain("```ts");
    expect(markdown).toContain("const a = 1");
    expect(markdown).toContain("**bold**");
    editor.destroy();
  });
});
