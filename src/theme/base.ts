import type { Theme } from "@/types";

/** Base tokens: non-color values only; colors (incl. fixed tooltip colors) live in light.ts / dark.ts. */
export const baseTheme: Theme = {
  "--tiptap-btn-size": "32px",
  "--tiptap-gap-xs": "3px",
  "--tiptap-gap-sm": "6px",
  "--tiptap-padding-xs": "2px",
  "--tiptap-padding-sm": "4px",
  "--tiptap-padding-md": "8px",
  "--tiptap-padding-lg": "12px",
  "--tiptap-border-radius-sm": "8px",
  "--tiptap-border-radius-md": "12px",
  "--tiptap-border-radius-lg": "16px",
  "--tiptap-gap": "8px",
  "--tiptap-font-size": "1em",

  // --- non-color, theme-independent values ---
  "--tiptap-tooltip-radius": "10px",
  "--tiptap-z-popover": "1000",
  "--tiptap-z-dialog": "1100",
  "--tiptap-input-radius": "12px",
  "--tiptap-input-padding": "6px 10px",

  "--tiptap-min-width": "220px",
  "--tiptap-max-content-width": "648px",

  "--tiptap-content-padding": "24px",
};
