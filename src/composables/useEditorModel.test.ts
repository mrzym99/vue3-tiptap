import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref, shallowRef } from "vue";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { CharacterCount } from "@tiptap/extensions";
import { useEditorModel } from "./useEditorModel";
import type { Transaction } from "@tiptap/pm/state";

// CharacterCount is included because handleCreate's maxLength guard reads
// `editor.storage.characterCount.characters()` directly (mirrors the component).
const base = [Document, Paragraph, Text, CharacterCount];

function createEditor(html = "<p></p>") {
  // v3 instantiates via `new Editor(...)` (synchronously), not a static create.
  // Provide an `element` so a real ProseMirror view is created — without one the
  // view isn't attached and dispatching (setContent / deleteRange) fails with a
  // "mismatched transaction" in the headless test environment.
  return new Editor({ content: html, extensions: base, element: document.createElement("div") });
}

const noopTxn = {} as Transaction;

// useEditorModel() calls onUnmounted(), which has no active instance outside a
// component — silence the resulting console message so the run is clean.
let warnSpy: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  // Only the debounce tests turn fake timers on (tiptap v3's editor uses
  // requestAnimationFrame internally, so faking timers globally breaks
  // ProseMirror's dispatch outside those cases).
  vi.useRealTimers();
  warnSpy.mockRestore();
});

describe("useEditorModel", () => {
  it("debounces the HTML write-back to modelValue", async () => {
    vi.useFakeTimers();
    const editor = createEditor("<p>hello</p>");
    const editorRef = shallowRef(editor);
    const modelValue = ref("");
    let updates = 0;
    const model = useEditorModel({
      editor: editorRef,
      modelValue,
      maxLength: () => 0,
      onUpdate: () => updates++,
    });
    model.handleCreate(editor);
    model.watchModel();

    model.handleUpdate(editor, noopTxn);
    expect(updates).toBe(1);
    // Not written back before the debounce delay elapses.
    expect(modelValue.value).toBe("");

    await vi.advanceTimersByTimeAsync(300);
    expect(modelValue.value).toBe("<p>hello</p>");
  });

  it("coalesces rapid updates into a single write-back of the latest content", async () => {
    vi.useFakeTimers();
    const editor = createEditor();
    const editorRef = shallowRef(editor);
    const modelValue = ref("");
    const model = useEditorModel({ editor: editorRef, modelValue, maxLength: () => 0 });
    model.handleCreate(editor);
    model.watchModel();

    editor.commands.setContent("<p>a</p>");
    model.handleUpdate(editor, noopTxn);
    editor.commands.setContent("<p>b</p>");
    model.handleUpdate(editor, noopTxn);

    await vi.advanceTimersByTimeAsync(150);
    expect(modelValue.value).toBe("");
    await vi.advanceTimersByTimeAsync(200);
    expect(modelValue.value).toBe("<p>b</p>");
  });

  it("applies a modelValue set before the editor was ready", async () => {
    const editorRef = shallowRef<Editor | undefined>(undefined);
    const modelValue = ref("");
    const model = useEditorModel({ editor: editorRef, modelValue, maxLength: () => 0 });
    model.watchModel();
    // Value arrives while editor is still undefined.
    modelValue.value = "<p>pending</p>";
    // Let the watcher run (flush "pre" → microtask) before the editor exists so
    // it records the value as pendingContent rather than pushing it live.
    await nextTick();

    const editor = createEditor();
    editorRef.value = editor;
    model.handleCreate(editor);
    expect(editor.getHTML()).toBe("<p>pending</p>");
  });

  it("pushes external modelValue changes into the editor", async () => {
    const editor = createEditor("<p>origin</p>");
    const editorRef = shallowRef(editor);
    const modelValue = ref(editor.getHTML());
    const model = useEditorModel({ editor: editorRef, modelValue, maxLength: () => 0 });
    model.handleCreate(editor);
    model.watchModel();

    modelValue.value = "<p>external</p>";
    await nextTick();
    expect(editor.getHTML()).toBe("<p>external</p>");
  });

  it("truncates over-limit content on create", async () => {
    const editor = createEditor("<p>hello world</p>");
    const editorRef = shallowRef(editor);
    const modelValue = ref(editor.getHTML());
    let truncated = 0;
    const model = useEditorModel({
      editor: editorRef,
      modelValue,
      maxLength: () => 5,
      onTruncated: () => truncated++,
    });
    model.handleCreate(editor);
    expect(truncated).toBe(1);
    expect(editor.getText().length).toBeLessThanOrEqual(5);
  });

  it("truncates on create even when CharacterCount is not loaded", () => {
    // Eager maximum-length guard reads compound from storage.characterCount; with
    // a bare extension set the fast-path fallback (plain text length) must still
    // cover it and truncate without throwing.
    const editor = new Editor({
      content: "<p>hello world</p>",
      extensions: [Document, Paragraph, Text],
      element: document.createElement("div"),
    });
    const editorRef = shallowRef(editor);
    const modelValue = ref(editor.getHTML());
    let truncated = 0;
    const model = useEditorModel({
      editor: editorRef,
      modelValue,
      maxLength: () => 6,
      onTruncated: () => truncated++,
    });
    model.handleCreate(editor);
    expect(truncated).toBe(1);
    expect(editor.getText().length).toBeLessThanOrEqual(6);
  });
});