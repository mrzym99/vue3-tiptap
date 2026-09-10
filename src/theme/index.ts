import type { Theme, ThemeName } from "@/types";
import { lightTheme } from "./light";
import { darkTheme } from "./dark";
import { baseTheme } from "./base";

function getTheme(name: ThemeName): Theme {
  return name === "dark" ? darkTheme : lightTheme;
}

/**
 * Apply theme CSS variables to a target element (defaults to the document root).
 *
 * - base tokens (sizes / radius / spacing) are always applied
 * - color tokens come from the selected built-in theme (`light` | `dark`)
 * - `overrides` are merged last, so custom variables win over built-ins
 *
 * Scoping to an element (e.g. the component root) makes multiple editor
 * instances with different themes independent of each other.
 */
export function applyTheme(
  name: ThemeName,
  target: HTMLElement = document.documentElement,
  overrides?: Theme,
) {
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
