import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { FindAndReplace } from "@tiptap/extension-find-and-replace";
import { useFindAndReplace } from "./useFindAndReplace";

function createEditor(html = "<p>foo bar foo baz foo</p>") {
  return new Editor({
    content: html,
    extensions: [Document, Paragraph, Text, FindAndReplace],
    element: document.createElement("div"),
  });
}

describe("useFindAndReplace", () => {
  it("replaceOne swaps the current match for the replace term (a chain would read the stale term)", () => {
    const editor = createEditor();
    const ui = useFindAndReplace(editor);
    ui.searchTerm.value = "foo";
    ui.replaceTerm.value = "qux";
    ui.replaceOne();
    expect(editor.getHTML()).toContain("qux bar foo baz foo");
    // the old wiring (`chain().setReplaceTerm().replace()`) replaced with the
    // pre-chain empty term — i.e. deleted the match
    expect(editor.getHTML()).not.toContain("bar  baz");
  });

  it("replaceAll swaps every match", () => {
    const editor = createEditor();
    const ui = useFindAndReplace(editor);
    ui.searchTerm.value = "foo";
    ui.replaceTerm.value = "qux";
    ui.replaceAll();
    expect(editor.getHTML()).toContain("qux bar qux baz qux");
  });

  it("goNext selects the first match without touching focus", () => {
    const editor = createEditor();
    const ui = useFindAndReplace(editor);
    ui.searchTerm.value = "foo";
    ui.goNext();
    const { from, to } = editor.state.selection;
    expect(editor.state.doc.textBetween(from, to)).toBe("foo");
  });

  it("clear empties the results and the terms", () => {
    const editor = createEditor();
    const ui = useFindAndReplace(editor);
    ui.searchTerm.value = "foo";
    ui.goNext();
    expect(ui.totalResults.value).toBe(3);
    ui.clear();
    expect(ui.totalResults.value).toBe(0);
    expect(ui.searchTerm.value).toBe("");
    expect(ui.replaceTerm.value).toBe("");
  });
});
