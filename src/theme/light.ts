import type { Theme } from "@/types";

/** Light theme — Notion style (docs/style/notion.md); old token names stay as aliases. */
export const lightTheme: Theme = {
  // --- surfaces ---
  "--tiptap-color-bg": "#FFFFFF",
  "--tiptap-color-bg-canvas": "#F7F6F3",
  "--tiptap-color-bg-hover": "#EFEDEA",
  "--tiptap-color-bg-active": "#E3E1DB",
  "--tiptap-color-bg-subtle": "#F5F5F5", // gray-100

  // --- text ---
  "--tiptap-color-text": "#37352F",
  "--tiptap-color-text-secondary": "#525252", // gray-600
  "--tiptap-color-text-muted": "#A3A3A3", // gray-400

  // --- borders ---
  "--tiptap-color-border": "#E5E5E5", // gray-200
  "--tiptap-color-border-strong": "#D4D4D4", // gray-300

  // --- accents (primary accent is purple; text + soft bg) ---
  "--tiptap-accent-blue": "#7C5CF0",
  "--tiptap-accent-red": "#EB5757",
  "--tiptap-accent-green": "#0F7B6C",
  "--tiptap-accent-yellow": "#DFAB01",
  "--tiptap-accent-blue-bg": "#EFEAFE",
  "--tiptap-accent-red-bg": "#FEF2F2", // red-50
  "--tiptap-accent-green-bg": "#F0FDF4", // green-50
  "--tiptap-accent-yellow-bg": "#FEFCE8", // yellow-50

  // --- buttons (transparent default, hover/active only deepen bg) ---
  "--tiptap-btn-bg": "transparent",
  "--tiptap-btn-bg-hover": "#EFEDEA",
  "--tiptap-btn-bg-active": "#E3E1DB",
  "--tiptap-btn-primary-bg": "#7C5CF0",
  "--tiptap-btn-primary-bg-hover": "#6748E8",
  "--tiptap-btn-primary-text": "#FFFFFF",
  "--tiptap-btn-secondary-bg": "#F5F5F5", // gray-100
  "--tiptap-btn-secondary-text": "#404040", // gray-700

  // --- interaction feedback ---
  "--tiptap-focus-ring": "rgba(124, 92, 240, 0.30)",
  "--tiptap-selection-bg": "rgba(124, 92, 240, 0.20)",
  "--tiptap-drag-handle": "rgba(55, 53, 47, 0.35)",

  // popover / menu (follow the theme)
  "--tiptap-popover-bg": "var(--tiptap-color-bg)",
  "--tiptap-popover-text": "var(--tiptap-color-text)",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow":
    "0 1px 3px rgba(15, 15, 15, 0.13), 0 4px 16px rgba(15, 15, 15, 0.05)",

  // dialog (modal mask; dialog panel follows popover tokens)
  "--tiptap-dialog-mask": "rgba(15, 15, 15, 0.4)",

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
  "--tiptap-mark-bg": "#FDE68A",
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
