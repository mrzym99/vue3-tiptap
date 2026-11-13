import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { defaultLineHeights } from "@/constants";
import { StarterKit } from "./index";
import { LineHeight } from "./LineHeight";
import type { LineHeightOptions } from "./LineHeight";

function createEditor(lineHeights?: string[]) {
  return new Editor({
    content: "<p>hello</p>",
    extensions: [Document, Paragraph, Text, LineHeight.configure(lineHeights ? { lineHeights } : {})],
    element: document.createElement("div"),
  });
}

const optionsOf = (editor: Editor) =>
  editor.extensionManager.extensions.find((e) => e.name === "lineHeight")?.options as LineHeightOptions;

describe("LineHeight", () => {
  it("ships the preset list and lets a host override it", () => {
    const editor = createEditor();
    expect(optionsOf(editor).lineHeights).toEqual(defaultLineHeights);
    editor.destroy();

    const custom = createEditor(["1.4", "1.8"]);
    expect(optionsOf(custom).lineHeights).toEqual(["1.4", "1.8"]);
    custom.destroy();
  });

  it("is configurable through StarterKit.configure", () => {
    const editor = new Editor({
      content: "<p>hello</p>",
      extensions: [Document, Paragraph, Text, StarterKit.configure({ lineHeight: { lineHeights: ["1.3"] } })],
      element: document.createElement("div"),
    });
    expect(optionsOf(editor).lineHeights).toEqual(["1.3"]);
    editor.destroy();
  });

  it("writes the line height on the block, not on an inner span", () => {
    const editor = createEditor();
    editor.commands.selectAll();
    editor.commands.setLineHeight("1.8");
    expect(editor.getHTML()).toBe('<p style="line-height: 1.8;">hello</p>');

    editor.commands.setLineHeight("2");
    editor.commands.unsetLineHeight();
    expect(editor.getHTML()).toBe("<p>hello</p>");
    editor.destroy();
  });
});