import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";

import { CodeBlock } from "./CodeBlock";

function createEditor(content: string) {
  return new Editor({
    content,
    extensions: [Document, Text, CodeBlock],
    element: document.createElement("div"),
  });
}

describe("CodeBlock language header node view", () => {
  it("renders an editable language input synced with the node attribute", () => {
    const editor = createEditor('<pre data-language="python"><code>x = 1</code></pre>');
    const input = editor.view.dom.querySelector<HTMLInputElement>(".tiptap-code-block__lang");
    expect(input, "node view header").toBeTruthy();
    expect(input?.value).toBe("python");

    // language changes from the document (undo, AI tools, …) sync back — and
    // the <pre> mirrors data-language (a custom node view must do this itself)
    editor.commands.updateAttributes("codeBlock", { language: "rust" });
    expect(editor.view.dom.querySelector<HTMLInputElement>(".tiptap-code-block__lang")?.value).toBe("rust");
    expect(editor.view.dom.querySelector("pre")?.getAttribute("data-language")).toBe("rust");

    editor.destroy();
  });

  it("dropdown suggests languages filtered by the typed text", async () => {
    const editor = createEditor("<pre><code>hi</code></pre>");
    const input = editor.view.dom.querySelector<HTMLInputElement>(".tiptap-code-block__lang")!;
    input.focus();
    input.dispatchEvent(new Event("focus"));
    let items = [...editor.view.dom.querySelectorAll(".tiptap-code-block__menu-item")].map((el) => el.textContent);
    expect(items.length).toBeGreaterThan(10);

    input.value = "py";
    input.dispatchEvent(new Event("input"));
    items = [...editor.view.dom.querySelectorAll(".tiptap-code-block__menu-item")].map((el) => el.textContent);
    expect(items).toEqual(["python"]);

    // picking an item commits to the document
    editor.view.dom.querySelector(".tiptap-code-block__menu-item")!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    expect(editor.state.doc.firstChild?.attrs.language).toBe("python");

    editor.destroy();
  });
});
