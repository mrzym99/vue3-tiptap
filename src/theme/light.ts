import type { Theme } from "@/types";

/**
 * Light theme: only base colors are defined here.
 * Semantic tokens (popover/tooltip/input…) reference these base colors
 * via `var(--tiptap-*)` — no standalone colors for components.
 */
export const lightTheme: Theme = {
  "--tiptap-color-text": "#222F3E",
  "--tiptap-color-bg": "#FFFFFF",
  "--tiptap-btn--bg-hover": "#CDCDCD",
  "--tiptap-btn--bg-active": "#D5D5D5",
  "--tiptap-color-border": "#CCCCCC",
  "--tiptap-color-text-3": "#86909C",

  // popover / menu (derived from base colors)
  "--tiptap-popover-bg": "#121212",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow": "0 4px 12px rgba(0, 0, 0, 0.12)",

  // tooltip (derived from base colors)
  "--tiptap-tooltip-bg": "#121212",
  "--tiptap-tooltip-text": "#FFFFFF",

  // input (derived from base colors)
  "--tiptap-input-bg": "var(--tiptap-color-bg)",
  "--tiptap-input-border": "var(--tiptap-color-border)",
  "--tiptap-input-border-hover": "var(--tiptap-color-text-3)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
};
