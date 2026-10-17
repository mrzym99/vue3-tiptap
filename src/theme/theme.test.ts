import { describe, expect, it } from "vitest";

import { applyTheme } from "./index";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

describe("theme accent derivation", () => {
  it("derives accent tokens from --tiptap-accent-blue via color-mix, not hardcoded indigo hex", () => {
    const derivedTokens = [
      "--tiptap-accent-blue-bg",
      "--tiptap-btn-primary-bg",
      "--tiptap-btn-primary-bg-hover",
      "--tiptap-btn-primary-shadow",
      "--tiptap-btn-primary-shadow-hover",
      "--tiptap-focus-ring",
      "--tiptap-selection-bg",
    ];
    for (const theme of [lightTheme, darkTheme]) {
      for (const token of derivedTokens) {
        const value = theme[token as keyof typeof theme] as string;
        expect(
          value.includes("color-mix") || value.includes("var(--tiptap-accent-blue)"),
          `${token} in ${theme === lightTheme ? "light" : "dark"} should derive from the accent hue`,
        ).toBe(true);
      }
    }
  });

  it("applyTheme writes a custom primary color onto the target element", () => {
    const target = document.createElement("div");
    applyTheme("dark", target, { "--tiptap-accent-blue": "#7C3AED" });
    expect(target.style.getPropertyValue("--tiptap-accent-blue")).toBe("#7C3AED");
    // derived tokens still present as color-mix expressions
    expect(target.style.getPropertyValue("--tiptap-selection-bg")).toContain("color-mix");
  });
});
