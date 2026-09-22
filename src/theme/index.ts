import type { Theme, ThemeName } from "@/types";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";
import { baseTheme } from "./base";

function getTheme(name: ThemeName): Theme {
  return name === "dark" ? darkTheme : lightTheme;
}

/** Apply base + selected color theme + overrides as `--tiptap-*` vars on the target element. */
export function applyTheme(name: ThemeName, target: HTMLElement = document.documentElement, overrides?: Theme) {
  const merged: Theme = { ...baseTheme, ...getTheme(name), ...overrides };
  // Drop previously applied `--tiptap-*` variables first so removed keys
  // (e.g. a deleted override or a theme switch) don't leak stale values.
  Array.from(target.style).forEach((prop) => {
    if (prop.startsWith("--tiptap-")) {
      target.style.removeProperty(prop);
    }
  });
  Object.entries(merged).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}
