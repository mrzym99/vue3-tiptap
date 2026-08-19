import type { Theme } from "@/types";

/**
 * Dark theme: only base colors are defined here.
 * Semantic tokens (popover/tooltip/input…) reference these base colors
 * via `var(--tiptap-*)` — no standalone colors for components.
 */
export const darkTheme: Theme = {
  "--tiptap-color-text": "#FFFFFF",
  "--tiptap-color-bg": "#121212",
  "--tiptap-btn--bg-hover": "#494949",
  "--tiptap-btn--bg-active": "#595959",
  "--tiptap-color-border": "#6D737B",
  "--tiptap-color-text-3": "#7A7A7A",

  // popover / menu (derived from base colors)
  "--tiptap-popover-bg": "#FFFFFF",
  "--tiptap-popover-border": "#FFFFFF",
  "--tiptap-popover-shadow": "0 4px 12px rgba(201, 198, 198, 0.5)",

  // tooltip (derived from base colors)
  "--tiptap-tooltip-bg": "#FFFFFF",
  "--tiptap-tooltip-text": "#222F3E",

  // input (derived from base colors)
  "--tiptap-input-bg": "var(--tiptap-color-bg)",
  "--tiptap-input-border": "var(--tiptap-color-border)",
  "--tiptap-input-border-hover": "var(--tiptap-color-text-3)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
};
