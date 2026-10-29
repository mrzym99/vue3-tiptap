import { beforeEach, describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { clearPendingColors, useColorEnterClear, useRecentColors, type RecentColor } from "./useRecentColors";

const KEY = "tiptap-recent-colors";

describe("useRecentColors", () => {
  beforeEach(() => localStorage.clear());

  it("pushes newest first and persists to localStorage", () => {
    const { recent, pushColor } = useRecentColors();
    expect(recent.value).toEqual([]);
    pushColor("#111111");
    pushColor("#222222", true);
    expect(recent.value).toEqual([{ color: "#222222", highlight: true }, { color: "#111111" }]);
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(recent.value);
  });

  it("dedupes by color+kind and re-pushing moves the entry to the front", () => {
    const { recent, pushColor } = useRecentColors();
    pushColor("#111111");
    pushColor("#222222");
    pushColor("#111111");
    expect(recent.value.map((r: RecentColor) => r.color)).toEqual(["#111111", "#222222"]);
    // same hex as a highlight is a distinct entry
    pushColor("#111111", true);
    expect(recent.value).toEqual([{ color: "#111111", highlight: true }, { color: "#111111" }, { color: "#222222" }]);
  });

  it("caps the list at 10 entries", () => {
    const { recent, pushColor } = useRecentColors();
    for (let i = 0; i < 15; i++) pushColor(`#${i.toString(16).padStart(6, "0")}`);
    expect(recent.value).toHaveLength(10);
    expect(recent.value[0].color).toBe("#00000e");
  });

  it("survives corrupted storage and reloads persisted entries", () => {
    localStorage.setItem(KEY, "{not json");
    expect(useRecentColors().recent.value).toEqual([]);
    localStorage.setItem(KEY, JSON.stringify([{ color: "#abcdef" }, { junk: 1 }, "#x"]));
    expect(useRecentColors().recent.value).toEqual([{ color: "#abcdef" }]);
  });
});

function createEditor(content = "<p>hello</p>") {
  return new Editor({
    content,
    extensions: [Document, Paragraph, Text, HardBreak, TextStyle, Color, Highlight.configure({ multicolor: true })],
    element: document.createElement("div"),
  });
}

describe("clearPendingColors", () => {
  it("drops a text color picked on a collapsed cursor", () => {
    const editor = createEditor();
    editor.commands.setTextSelection(3);
    editor.commands.setColor("#ff0000");
    expect(editor.getAttributes("textStyle").color).toBe("#ff0000");
    clearPendingColors(editor);
    expect(editor.getAttributes("textStyle").color).toBeFalsy();
  });

  it("keeps a pending color when the caret already sits in colored text", () => {
    const editor = createEditor();
    editor.commands.setTextSelection({ from: 2, to: 6 });
    editor.commands.setColor("#ff0000"); // real marks on "hello"
    editor.commands.setTextSelection(4); // caret inside the colored text
    editor.view.dispatch(editor.state.tr.setStoredMarks([editor.schema.marks.textStyle.create({ color: "#0000ff" })]));
    clearPendingColors(editor);
    // still writing with the pending blue in this colored stretch
    expect(editor.getAttributes("textStyle").color).toBe("#0000ff");
  });
});

describe("useColorEnterClear", () => {
  function withPending() {
    const editor = createEditor("<p>hello</p>");
    editor.commands.setTextSelection(3);
    editor.commands.setColor("#ff0000"); // pending textStyle in a plain paragraph
    expect(editor.state.storedMarks?.length).toBe(1);
    useColorEnterClear(editor);
    return editor;
  }

  it("drops the pending color on Enter", () => {
    const editor = withPending();
    editor.commands.splitBlock();
    expect(editor.state.storedMarks?.length ?? 0).toBe(0);
  });

  it("keeps the pending color through typing and Shift+Enter", () => {
    const editor = withPending();
    // typing/hardBreak consume the stored mark into the inserted text
    // (tiptap does that itself — our listener runs too late to see it and
    // must never clear on its own); Enter is the one case we clear.
    editor.view.dispatch(editor.state.tr.insertText("x"));
    editor.commands.focus(); // re-arms the stored marks, like clicking back in
    editor.commands.setHardBreak();
    editor.commands.focus(); // hardBreak also consumed it — re-arm again
    editor.view.dispatch(editor.state.tr.setStoredMarks([editor.schema.marks.textStyle.create({ color: "#ff0000" })]));
    expect(editor.state.storedMarks?.length).toBe(1);
    editor.commands.splitBlock(); // Enter ends the color mode
    expect(editor.state.storedMarks?.length ?? 0).toBe(0);
  });
});
