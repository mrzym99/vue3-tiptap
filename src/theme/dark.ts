import type { Theme } from "@/types";

/**
 * Dark theme — popover/input/menu follow the theme via base colors;
 * only the tooltip is fixed (black bg, white text) in base.ts.
 *
 * Values extracted from the TT design system:
 *   bg:         --black           rgba(14, 14, 17, 1)
 *   text:       --tt-gray-dark-900 rgba(245, 245, 245, 1)
 *   text-3:     --tt-gray-dark-500 rgba(124, 124, 131, 1)
 *   border:     --tt-border-color rgba(238, 238, 246, 0.11)
 *   btn hover:  --tt-gray-dark-a-100
 *   btn active: --tt-gray-dark-a-200
 *   shadow:     --tt-shadow-elevated-md (dark)
 */
export const darkTheme: Theme = {
  "--tiptap-color-text": "rgba(245, 245, 245, 1)",
  "--tiptap-color-bg": "rgba(14, 14, 17, 1)",
  "--tiptap-color-border": "rgba(238, 238, 246, 0.11)",
  "--tiptap-color-text-3": "rgba(124, 124, 131, 1)",
  "--tiptap-btn--bg-hover": "rgba(231, 231, 243, 0.07)",
  "--tiptap-btn--bg-active": "rgba(238, 238, 246, 0.11)",

  // popover / menu (follow the theme)
  "--tiptap-popover-bg": "var(--tiptap-color-bg)",
  "--tiptap-popover-text": "var(--tiptap-color-text)",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow":
    "0px 16px 48px 0px rgba(0, 0, 0, 0.50), 0px 12px 24px 0px rgba(0, 0, 0, 0.24), 0px 6px 8px 0px rgba(0, 0, 0, 0.22), 0px 2px 3px 0px rgba(0, 0, 0, 0.12)",

  // menu item (follow the theme)
  "--tiptap-menu-item-hover": "var(--tiptap-btn--bg-hover)",
  "--tiptap-menu-item-active": "var(--tiptap-btn--bg-active)",

  // input (follow the theme)
  "--tiptap-input-bg": "var(--tiptap-color-bg)",
  "--tiptap-input-border": "var(--tiptap-color-border)",
  "--tiptap-input-border-hover": "rgba(239, 239, 245, 0.22)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
  "--tiptap-input-placeholder": "var(--tiptap-color-text-3)",

  // mark / highlight (functional color)
  "--tiptap-mark-bg": "rgba(250, 204, 21, 0.25)",
};
