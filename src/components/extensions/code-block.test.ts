import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { UndoRedo } from "@tiptap/extensions";
import { CodeBlock } from "./CodeBlock";

const extensions = [Document, Paragraph, Text, UndoRedo, CodeBlock];

function createEditor(content: string) {
  return new Editor({
    content,
    extensions,
    element: document.createElement("div"),
  });
}

/** Editor whose caret sits inside the first code block. */
function createEditorInCodeBlock() {
  const editor = createEditor("<pre><code>hello</code></pre>");
  editor.commands.setTextSelection(3);
  return editor;
}

function language(editor: Editor) {
  let value: unknown = undefined;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "codeBlock") value = node.attrs.language;
  });
  return value;
}

describe("CodeBlock language", () => {
  it("records language changes in undo/redo history", () => {
    const editor = createEditorInCodeBlock();

    expect(language(editor)).toBeNull();

    editor.commands.updateAttributes("codeBlock", { language: "ts" });
    expect(language(editor)).toBe("ts");

    editor.commands.undo();
    expect(language(editor)).toBeNull();

    editor.commands.redo();
    expect(language(editor)).toBe("ts");
  });

  it("renders data-language on the pre and the language class on the code", () => {
    const editor = createEditorInCodeBlock();

    editor.commands.updateAttributes("codeBlock", { language: "ts" });
    const pre = editor.view.dom.querySelector("pre");
    expect(pre?.getAttribute("data-language")).toBe("ts");
    expect(pre?.querySelector("code")?.className).toBe("language-ts");

    editor.commands.updateAttributes("codeBlock", { language: null });
    expect(editor.view.dom.querySelector("pre")?.getAttribute("data-language")).toBeNull();
    expect(editor.view.dom.querySelector("code")?.className).toBe("");
  });
});
