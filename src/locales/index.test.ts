import { afterEach, describe, expect, it, vi } from "vitest";
import { createLocaleContext, detectLocale } from "./index";

describe("detectLocale", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns zh for a Chinese browser", () => {
    vi.stubGlobal("navigator", { language: "zh-CN" });
    expect(detectLocale()).toBe("zh");
  });

  it("returns en for a non-Chinese browser", () => {
    vi.stubGlobal("navigator", { language: "en-US" });
    expect(detectLocale()).toBe("en");
  });

  it("returns en when navigator is unavailable", () => {
    vi.stubGlobal("navigator", undefined);
    expect(detectLocale()).toBe("en");
  });
});

describe("createLocaleContext().t", () => {
  afterEach(() => vi.restoreAllMocks());

  it("translates a known key", () => {
    const ctx = createLocaleContext("zh");
    expect(ctx.t("bold")).toBe("加粗");
  });

  it("falls back to the raw key for a missing translation, warning once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // Unknown locale id -> every key is missing.
    const ctx = createLocaleContext("xx");
    expect(ctx.t("some.missing.key")).toBe("some.missing.key");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("resolves host-provided translations for a custom locale", () => {
    const ctx = createLocaleContext("fr", { fr: { bold: "Gras" } });
    expect(ctx.t("bold")).toBe("Gras");
  });
});