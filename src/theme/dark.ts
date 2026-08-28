import type { Theme } from "@/types";

/**
 * Dark theme — mirrors the Notion light token structure.
 * Kept minimal: the color family follows the light theme's semantic roles,
 * with dark-suited values. Only the tooltip is fixed (black bg, white text) in base.ts.
 *
 * Dark Notion palette (adapted):
 *   bg canvas:  #191919
 *   bg:         #1f1f1f
 *   hover:      #262626  (block highlighting)
 *   active:     #2f2f2f  (micro-click)
 *   text:       #e6e6e6
 *   border:     #3a3a3a  (neutral gray-800 family)
 *   focus ring: #2eaadc  at 30%
 */
export const darkTheme: Theme = {
  // --- surfaces ---
  "--tiptap-color-bg": "#1F1F1F",
  "--tiptap-color-bg-canvas": "#191919",
  "--tiptap-color-bg-hover": "#262626",
  "--tiptap-color-bg-active": "#2F2F2F",
  "--tiptap-color-bg-subtle": "#2B2B2B",

  // --- text ---
  "--tiptap-color-text": "#E6E6E6",
  "--tiptap-color-text-secondary": "#A6A6A6",
  "--tiptap-color-text-muted": "#7A7A7A",

  // --- borders ---
  "--tiptap-color-border": "#3A3A3A",
  "--tiptap-color-border-strong": "#4A4A4A",

  // --- accents (text + soft bg) ---
  "--tiptap-accent-blue": "#9480F4",
  "--tiptap-accent-red": "#EB5757",
  "--tiptap-accent-green": "#2E8B7E",
  "--tiptap-accent-yellow": "#DFAB01",
  "--tiptap-accent-blue-bg": "rgba(124, 92, 240, 0.22)",
  "--tiptap-accent-red-bg": "rgba(235, 87, 87, 0.14)",
  "--tiptap-accent-green-bg": "rgba(15, 123, 108, 0.18)",
  "--tiptap-accent-yellow-bg": "rgba(223, 171, 1, 0.14)",

  // --- buttons (transparent default, hover/active only deepen bg) ---
  "--tiptap-btn-bg": "transparent",
  "--tiptap-btn-bg-hover": "#262626",
  "--tiptap-btn-bg-active": "#2F2F2F",
  "--tiptap-btn-primary-bg": "#7C6CE0",
  "--tiptap-btn-primary-bg-hover": "#8B7CE8",
  "--tiptap-btn-primary-text": "#FFFFFF",
  "--tiptap-btn-secondary-bg": "#2B2B2B",
  "--tiptap-btn-secondary-text": "#CFCFCF",

  // --- interaction feedback ---
  "--tiptap-focus-ring": "rgba(148, 128, 244, 0.32)",
  "--tiptap-selection-bg": "rgba(148, 128, 244, 0.28)",
  "--tiptap-drag-handle": "rgba(230, 230, 230, 0.35)",

  // popover / menu (follow the theme)
  "--tiptap-popover-bg": "var(--tiptap-color-bg)",
  "--tiptap-popover-text": "var(--tiptap-color-text)",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow":
    "0 1px 3px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)",

  // menu item (follow the theme)
  "--tiptap-menu-item-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-menu-item-active": "var(--tiptap-color-bg-active)",

  // input (follow the theme)
  "--tiptap-input-bg": "var(--tiptap-color-bg)",
  "--tiptap-input-border": "var(--tiptap-color-border)",
  "--tiptap-input-border-hover": "var(--tiptap-accent-blue)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
  "--tiptap-input-placeholder": "var(--tiptap-color-text-muted)",

  // content elements
  "--tiptap-mark-bg": "rgba(250, 204, 21, 0.25)",
  "--tiptap-link-color": "var(--tiptap-accent-blue)",
  "--tiptap-code-bg": "var(--tiptap-color-bg-subtle)",
  "--tiptap-code-text": "var(--tiptap-color-text)",

  // --- fixed tooltip colors (black bg + white text, same value in both themes) ---
  "--tiptap-tooltip-bg": "#111111",
  "--tiptap-tooltip-text": "#FFFFFF",

  // --- backward-compatible aliases (used by existing components) ---
  "--tiptap-color-text-3": "var(--tiptap-color-text-muted)",
  "--tiptap-btn--bg-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-btn--bg-active": "var(--tiptap-color-bg-active)",
};
