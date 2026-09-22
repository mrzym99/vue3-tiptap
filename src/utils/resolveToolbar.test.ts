import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveToolbar } from "./resolveToolbar";

const allKeys = ["undo", "bold", "italic", "underline", "strike"];

// resolveToolbar warns when the defaultToolbar lists keys that aren't loaded —
// silence that so the output below stays readable.
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("resolveToolbar", () => {
  it("falls back to defaultToolbar when toolbar is undefined", () => {
    const layout = resolveToolbar(undefined, allKeys);
    // Only the keys present in allKeys survive; order matches defaultToolbar.
    expect(layout.keys).toEqual(["undo", "bold", "italic", "strike", "underline"]);
    expect(layout.separators.length).toBeGreaterThan(0);
  });

  it("parses a TinyMCE-style string and inserts group separators", () => {
    const layout = resolveToolbar("bold italic | underline strike", allKeys);
    expect(layout.keys).toEqual(["bold", "italic", "underline", "strike"]);
    expect(layout.separators).toEqual([1]);
  });

  it("renders an array in the given order without separators", () => {
    const layout = resolveToolbar(["strike", "bold"], allKeys);
    expect(layout.keys).toEqual(["strike", "bold"]);
    expect(layout.separators).toEqual([]);
  });

  it("supports { include } as an ordered subset", () => {
    const layout = resolveToolbar({ include: ["strike", "bold"] }, allKeys);
    expect(layout.keys).toEqual(["strike", "bold"]);
  });

  it("supports { exclude }", () => {
    const layout = resolveToolbar({ exclude: ["bold"] }, allKeys);
    expect(layout.keys).toContain("italic");
    expect(layout.keys).not.toContain("bold");
  });

  it("ignores unknown keys", () => {
    const layout = resolveToolbar("bold nope | nada", allKeys);
    expect(layout.keys).toEqual(["bold"]);
  });
});
