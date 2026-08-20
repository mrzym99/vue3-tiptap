import type { Theme } from "@/types";

/**
 * Light theme — popover/input/menu follow the theme via base colors;
 * only the tooltip is fixed (black bg, white text) in base.ts.
 *
 * Values extracted from the TT design system:
 *   bg:         --white / --tt-bg-color
 *   text:       --tt-gray-light-900  rgba(34, 35, 37, 1)
 *   text-3:     --tt-gray-light-500  rgba(125, 127, 130, 1)
 *   border:     --tt-border-color    rgba(37, 39, 45, 0.10)
 *   btn hover:  --tt-gray-light-a-100
 *   btn active: --tt-gray-light-a-200
 *   shadow:     --tt-shadow-elevated-md (light)
 */
export const lightTheme: Theme = {
  "--tiptap-color-text": "rgba(34, 35, 37, 1)",
  "--tiptap-color-bg": "#FFFFFF",
  "--tiptap-color-border": "rgba(37, 39, 45, 0.10)",
  "--tiptap-color-text-3": "rgba(125, 127, 130, 1)",
  "--tiptap-btn--bg-hover": "rgba(15, 22, 36, 0.05)",
  "--tiptap-btn--bg-active": "rgba(37, 39, 45, 0.10)",

  // popover / menu (follow the theme)
  "--tiptap-popover-bg": "var(--tiptap-color-bg)",
  "--tiptap-popover-text": "var(--tiptap-color-text)",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow":
    "0px 16px 48px 0px rgba(17, 24, 39, 0.04), 0px 12px 24px 0px rgba(17, 24, 39, 0.04), 0px 6px 8px 0px rgba(17, 24, 39, 0.02), 0px 2px 3px 0px rgba(17, 24, 39, 0.02)",

  // menu item (follow the theme)
  "--tiptap-menu-item-hover": "var(--tiptap-btn--bg-hover)",
  "--tiptap-menu-item-active": "var(--tiptap-btn--bg-active)",

  // input (follow the theme)
  "--tiptap-input-bg": "var(--tiptap-color-bg)",
  "--tiptap-input-border": "var(--tiptap-color-border)",
  "--tiptap-input-border-hover": "rgba(47, 50, 55, 0.20)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
  "--tiptap-input-placeholder": "var(--tiptap-color-text-3)",

  // mark / highlight (functional color)
  "--tiptap-mark-bg": "#fde68a",
};
