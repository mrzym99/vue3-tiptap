import { describe, expect, it } from "vitest";
import type { Editor } from "@tiptap/core";
import { normalizeUrl, urlRules } from "./useMediaForm";

const t = (key: string) => key;
const editorWith = (options: Record<string, unknown> = {}, name = "video") =>
  ({ extensionManager: { extensions: [{ name, options }] } }) as unknown as Editor;
const check = (editor: Editor, value: string, name = "video") =>
  urlRules(editor, t, name).map((r) => r.validator(value));

describe("urlRules", () => {
  it("requires non-empty and http(s) or bare www by default", () => {
    const editor = editorWith();
    expect(check(editor, "")).toEqual([false, true]); // empty → only required fails
    expect(check(editor, "ftp://x")).toEqual([true, false]); // not http(s)/www
    expect(check(editor, "https://a.com/b")).toEqual([true, true]);
    expect(check(editor, "www.a.com")).toEqual([true, true]); // bare www allowed
  });

  it("configured validate adds a stricter check on top of the floor, after www-normalization", () => {
    const editor = editorWith({ validate: (url: string) => url.includes("bilibili.com") });
    expect(check(editor, "https://youtube.com/x")).toEqual([true, true, false]);
    expect(check(editor, "https://bilibili.com/x")).toEqual([true, true, true]);
    expect(check(editor, "www.bilibili.com/x")).toEqual([true, true, true]); // sees https://www.bilibili.com/x
  });

  it("validateMessage replaces the default error on the validate rule only", () => {
    const editor = editorWith({ validate: (url: string) => url.includes("b"), validateMessage: "only b sites" });
    const rules = urlRules(editor, t, "video");
    expect(rules[2].message).toBe("only b sites");
    expect(rules[1].message).toBe("mediaUrlInvalid"); // the floor keeps the generic error
    const without = urlRules(editorWith({ validate: (url: string) => url.includes("b") }), t, "video");
    expect(without[2].message).toBe("mediaUrlInvalid"); // omitted → falls back, never silent
  });

  it("extra protocols pass the floor only when configured via `protocols`", () => {
    const link = (protocols?: string[], validate?: (url: string) => boolean) =>
      editorWith({ protocols, validate }, "link");
    expect(check(link(), "mailto:a@b.com", "link")).toEqual([true, false]); // not opted in → floor blocks
    expect(check(link(["mailto", "tel"]), "mailto:a@b.com", "link")).toEqual([true, true]);
    expect(check(link(["mailto", "tel"]), "tel:13800138000", "link")).toEqual([true, true]);
    // configured validate still applies to scheme URLs
    expect(
      check(
        link(["mailto"], (url) => url.startsWith("tel:")),
        "mailto:a@b.com",
        "link",
      ),
    ).toEqual([true, true, false]);
    // object-style protocol entries (upstream LinkProtocolOptions) work too
    expect(check(link([{ scheme: "sms" }] as never), "sms:10086", "link")).toEqual([true, true]);
  });

  it("normalizeUrl prefixes bare www with https://", () => {
    expect(normalizeUrl("www.a.com/x")).toBe("https://www.a.com/x");
    expect(normalizeUrl("https://a.com")).toBe("https://a.com");
    expect(normalizeUrl("mailto:a@b.com")).toBe("mailto:a@b.com");
  });
});
