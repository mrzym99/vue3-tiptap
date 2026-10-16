import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { StarterKit } from "./index";
import { Link } from "./Link";
import { Table } from "./Table";
import type { ButtonView, GeneralOptions } from "@/types";

// StarterKit excludes Document/Paragraph/Text (the editor component always
// provides them) — the test editor has to add them for a valid schema.
function createKitEditor(configure?: Parameters<typeof StarterKit.configure>[0]) {
  return new Editor({
    content: "",
    extensions: [Document, Paragraph, Text, StarterKit.configure(configure)],
    element: document.createElement("div"),
  });
}

describe("extension UI declarations", () => {
  // The toolbar and the extension-bubble-menu host discover their buttons by
  // scanning `extension.options` — this contract is what makes that work.
  it("every button-bearing extension exposes a `button` view returning a component", () => {
    const editor = createKitEditor();
    let buttonCount = 0;
    for (const extension of editor.extensionManager.extensions) {
      const button = (extension.options as GeneralOptions).button;
      if (typeof button !== "function") continue; // behavior-only extensions
      buttonCount++;
      const view = button({ editor, t: (key: string) => key });
      expect(view?.component, `${extension.name}.button`).toBeTruthy();
    }
    // Sanity: the loop must not be vacuous — the kit bundles many buttons.
    expect(buttonCount).toBeGreaterThan(20);
    editor.destroy();
  });

  it("the extensions with their own floating toolbar declare a `bubbleMenu` view", () => {
    for (const extension of [Link, Table]) {
      const bubble = (extension.options as GeneralOptions).bubbleMenu;
      expect(typeof bubble, `${extension.name}.bubbleMenu`).toBe("function");
      const view = (bubble as ButtonView)({ editor: {} as Editor, t: (key: string) => key });
      expect(view?.component, `${extension.name}.bubbleMenu`).toBeTruthy();
    }
  });

  it("`bubbleMenu: false` disables a floating toolbar", () => {
    const ext = Link.configure({ bubbleMenu: false });
    expect((ext.options as GeneralOptions).bubbleMenu).toBe(false);
    expect((ext.options as GeneralOptions).button).toBeDefined();
  });
});

describe("StarterKit", () => {
  it("expands into the built-in extensions", () => {
    const editor = createKitEditor();
    const names = editor.extensionManager.extensions.map((e) => e.name);
    for (const expected of ["bold", "italic", "link", "image", "table", "mention"]) {
      expect(names, expected).toContain(expected);
    }
    editor.destroy();
  });

  it("`false` removes an extension, an object configures it", () => {
    const editor = createKitEditor({ audio: false, image: { width: 123 } });
    const names = editor.extensionManager.extensions.map((e) => e.name);
    expect(names).not.toContain("audio");
    const image = editor.extensionManager.extensions.find((e) => e.name === "image");
    expect((image!.options as { width?: number }).width).toBe(123);
    editor.destroy();
  });
});
