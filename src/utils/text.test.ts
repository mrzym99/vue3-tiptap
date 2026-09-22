import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { checkLimit } from "./text";

function createEditor(html: string) {
  // No CharacterCount on purpose: checkLimit must work on the plain-text
  // fallback (the editor component always loads CharacterCount, but the
  // util is also the guard for hosts that bring their own extension set).
  return new Editor({
    content: html,
    extensions: [Document, Paragraph, Text],
    element: document.createElement("div"),
  });
}

describe("checkLimit", () => {
  it("returns false and keeps content when the document is within the limit", () => {
    const editor = createEditor("<p>hello</p>");
    expect(checkLimit(editor, 10)).toBe(false);
    expect(editor.getHTML()).toBe("<p>hello</p>");
  });

  it("returns false when the limit is 0 (unlimited)", () => {
    const editor = createEditor("<p>hello world</p>");
    expect(checkLimit(editor, 0)).toBe(false);
    expect(editor.getHTML()).toBe("<p>hello world</p>");
  });

  it("truncates a single paragraph to exactly `limit` characters", () => {
    const editor = createEditor("<p>hello world</p>");
    expect(checkLimit(editor, 5)).toBe(true);
    expect(editor.getText()).toBe("hello");
  });

  it("cuts at the real document position across paragraphs", () => {
    // Block nodes occupy extra ProseMirror positions, so the cut position
    // must be computed by walking the doc, not from the text offset.
    const editor = createEditor("<p>hello</p><p>world</p>");
    expect(checkLimit(editor, 8)).toBe(true);
    expect(editor.getText({ blockSeparator: "" })).toBe("hellowor");
    // 8 visible chars kept, the rest removed.
    expect(editor.getText({ blockSeparator: "" }).length).toBe(8);
  });

  it("counts paragraph breaks as 0: the limit is visible characters only", () => {
    const editor = createEditor("<p>abc</p><p>def</p>");
    // 6 visible chars total; a limit of 6 must keep everything.
    expect(checkLimit(editor, 6)).toBe(false);
    expect(editor.getHTML()).toBe("<p>abc</p><p>def</p>");
  });

  it("truncates into the second paragraph when the limit spans blocks", () => {
    const editor = createEditor("<p>abc</p><p>defgh</p>");
    expect(checkLimit(editor, 5)).toBe(true);
    expect(editor.getText({ blockSeparator: "" })).toBe("abcde");
  });
});
