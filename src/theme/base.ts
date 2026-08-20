import type { Theme } from "@/types";

/**
 * Base tokens: non-color values (sizes/radius/spacing/motion/z-index) plus
 * the FIXED tooltip colors (black bg + white text) — tooltip intentionally
 * does NOT follow the theme, unlike the popover which does (see light/dark).
 */
export const baseTheme: Theme = {
  "--tiptap-bezier": "cubic-bezier(0.4, 0, 0.2, 1)",
  "--tiptap-btn-size": "32px",
  "--tiptap-gap-xs": "2px",
  "--tiptap-gap-sm": "4px",
  "--tiptap-padding-xs": "2px",
  "--tiptap-padding-sm": "4px",
  "--tiptap-padding-md": "8px",
  "--tiptap-padding-lg": "12px",
  "--tiptap-border-radius-sm": "4px",
  "--tiptap-border-radius-md": "8px",
  "--tiptap-border-radius-lg": "12px",
  "--tiptap-gap": "8px",
  "--tiptap-font-size-sm": "12px",

  // --- fixed tooltip colors (black bg, white text, theme-independent) ---
  "--tiptap-tooltip-bg": "#111111",
  "--tiptap-tooltip-text": "#FFFFFF",
  "--tiptap-tooltip-radius": "8px",

  // --- non-color, theme-independent values ---
  "--tiptap-z-popover": "1000",
  "--tiptap-input-radius": "8px",
  "--tiptap-input-padding": "6px 10px",
};
