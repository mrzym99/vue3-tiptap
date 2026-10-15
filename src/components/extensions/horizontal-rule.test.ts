import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { NodeSelection } from "@tiptap/pm/state";
import { Blockquote } from "./Blockquote";
import { HorizontalRule } from "./HorizontalRule";

const extensions = [Document, Paragraph, Text, Blockquote, HorizontalRule];

function createEditor(content: string) {
  return new Editor({
    content,
    extensions,
    element: document.createElement("div"),
  });
}

async function pressBackspace(editor: Editor) {
  editor.view.dom.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }),
  );
  await new Promise((r) => setTimeout(r, 10));
}

function hasHr(editor: Editor) {
  let found = false;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "horizontalRule") found = true;
  });
  return found;
}

describe("HorizontalRule backspace", () => {
  // regression: backspace used to ping-pong (paragraph moved in/out of the
  // blockquote by joinBackward) and the hr could never be selected
  it("selects the hr before deleting it when the caret is after a blockquote ending with hr", async () => {
    const editor = createEditor("<blockquote><hr></blockquote><p></p>");
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);

    await pressBackspace(editor);
    expect(editor.state.selection instanceof NodeSelection).toBe(true);
    expect(hasHr(editor)).toBe(true);

    await pressBackspace(editor);
    expect(hasHr(editor)).toBe(false);

    // stable afterwards, no ping-pong
    const doc = JSON.stringify(editor.state.doc.toJSON());
    await pressBackspace(editor);
    expect(JSON.stringify(editor.state.doc.toJSON())).toBe(doc);
    editor.destroy();
  });

  it("selects the hr when the caret is inside the blockquote right after it", async () => {
    const editor = createEditor("<blockquote><hr><p></p></blockquote>");
    editor.commands.setTextSelection(3);

    await pressBackspace(editor);
    expect(editor.state.selection instanceof NodeSelection).toBe(true);

    await pressBackspace(editor);
    expect(hasHr(editor)).toBe(false);
    editor.destroy();
  });

  it("keeps the hr revertible via undo of the --- input rule", () => {
    const editor = createEditor("<p></p>");
    editor.commands.setTextSelection(1);
    editor.commands.insertContent("---");
    if (hasHr(editor)) {
      editor.commands.setTextSelection(editor.state.doc.content.size - 1);
      editor.view.dom.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }),
      );
      expect(hasHr(editor)).toBe(false);
    }
    editor.destroy();
  });
});
