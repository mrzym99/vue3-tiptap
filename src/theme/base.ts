import type { Theme } from "@/types";

/**
 * Non-color tokens (sizes / radius / spacing / motion / z-index).
 * All color tokens live in the per-theme files (light/dark) so that
 * switching themes actually changes them.
 */
export const baseTheme: Theme = {
  "--tiptap-bezier": "cubic-bezier(.4, 0, .2, 1)",
  "--tiptap-btn-size": "32px",
  "--tiptap-gap-xs": "2px",
  "--tiptap-padding-xs": "2px",
  "--tiptap-padding-sm": "4px",
  "--tiptap-padding-md": "8px",
  "--tiptap-padding-lg": "12px",
  "--tiptap-border-radius-sm": "4px",
  "--tiptap-gap": "8px",
  "--tiptap-font-size-sm": "12px",

  // non-color, per-theme-independent values
  "--tiptap-tooltip-radius": "4px",
  "--tiptap-z-popover": "1000",
  "--tiptap-input-radius": "4px",
  "--tiptap-input-padding": "4px 8px",
};
