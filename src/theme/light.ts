import type { Theme } from "@/types";

/** Light theme — Soft UI (docs/style/soft-ui-hard-prompt.md); old token names stay as aliases. */
export const lightTheme: Theme = {
  // native widgets (scrollbars, form controls) follow the theme
  "--tiptap-color-scheme": "light",

  // --- surfaces (hover/active are interaction feedback: accent-tinted via color-mix) ---
  "--tiptap-color-bg": "#FFFFFF",
  "--tiptap-color-bg-hover": "color-mix(in srgb, var(--tiptap-accent-primary) 8%, white)",
  "--tiptap-color-bg-active": "color-mix(in srgb, var(--tiptap-accent-primary) 15%, white)",
  "--tiptap-color-bg-subtle": "#F6F7F9",

  // --- text ---
  "--tiptap-color-text": "#1F2937", // gray-800
  "--tiptap-color-text-secondary": "#4B5563", // gray-600
  "--tiptap-color-text-muted": "#9CA3AF", // gray-400

  // --- borders (kept hairline-soft; shadows carry the layering) ---
  "--tiptap-color-border": "#E8EAEE",
  "--tiptap-color-border-strong": "#D5D9E0",

  // --- accents (primary accent hue; everything derived follows it via color-mix) ---
  "--tiptap-accent-primary": "#6366F1", // indigo-500
  "--tiptap-accent-danger": "#EB5757",
  "--tiptap-accent-success": "#0F7B6C",
  "--tiptap-accent-warning": "#DFAB01",
  "--tiptap-accent-primary-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 10%, white)",

  // --- buttons (transparent default; hover/active follow the accent-derived surfaces) ---
  "--tiptap-btn-bg": "transparent",
  "--tiptap-btn-bg-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-btn-bg-active": "var(--tiptap-color-bg-active)",
  "--tiptap-btn-primary-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 90%, black)",
  "--tiptap-btn-primary-bg-hover": "color-mix(in srgb, var(--tiptap-accent-primary) 78%, black)",
  "--tiptap-btn-primary-text": "#FFFFFF",
  "--tiptap-btn-primary-shadow": "0 4px 14px color-mix(in srgb, var(--tiptap-accent-primary) 28%, transparent)",
  "--tiptap-btn-primary-shadow-hover": "0 8px 20px color-mix(in srgb, var(--tiptap-accent-primary) 35%, transparent)",
  "--tiptap-btn-danger-bg": "var(--tiptap-accent-danger)",
  "--tiptap-btn-danger-bg-hover": "#D64545",
  "--tiptap-btn-danger-text": "#FFFFFF",
  "--tiptap-btn-danger-shadow": "0 4px 14px rgba(235, 87, 87, 0.25)",
  "--tiptap-btn-danger-shadow-hover": "0 8px 20px rgba(235, 87, 87, 0.32)",

  // --- interaction feedback (Halo Focus: soft large-radius ring) ---
  "--tiptap-focus-ring": "color-mix(in srgb, var(--tiptap-accent-primary) 25%, transparent)",
  "--tiptap-selection-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 26%, transparent)",

  // popover / menu (follow the theme; shadows carry color tint, never hard)
  "--tiptap-popover-bg": "var(--tiptap-color-bg)",
  "--tiptap-popover-text": "var(--tiptap-color-text)",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow":
    "0 2px 6px color-mix(in srgb, var(--tiptap-accent-primary) 6%, transparent), 0 12px 32px rgba(15, 15, 15, 0.08)",

  // toolbar divider (soft tinted shadow instead of a hard border line)
  "--tiptap-toolbar-shadow":
    "0 1px 3px rgba(15, 15, 15, 0.06), 0 4px 12px color-mix(in srgb, var(--tiptap-accent-primary) 6%, transparent)",

  // dialog (modal mask; dialog panel follows popover tokens)
  "--tiptap-dialog-mask": "rgba(30, 27, 45, 0.35)",

  // menu item (follow the theme)
  "--tiptap-menu-item-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-menu-item-active": "var(--tiptap-color-bg-active)",

  // input (Soft UI: borderless, tinted field bg, focus ring carries feedback)
  "--tiptap-input-bg": "var(--tiptap-color-bg-subtle)",
  "--tiptap-input-border": "transparent",
  "--tiptap-input-border-hover": "var(--tiptap-accent-primary)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
  "--tiptap-input-placeholder": "var(--tiptap-color-text-muted)",

  // content elements
  "--tiptap-mark-bg": "#FDE68A",
  "--tiptap-link-color": "var(--tiptap-accent-primary)",
  "--tiptap-code-bg": "#F0F1F4",
  "--tiptap-code-text": "var(--tiptap-color-text)",

  // --- fixed tooltip colors (black bg + white text, same value in both themes) ---
  "--tiptap-tooltip-bg": "#111111",
  "--tiptap-tooltip-text": "#FFFFFF",

  // --- backward-compatible aliases (used by existing components) ---
  "--tiptap-btn--bg-hover": "var(--tiptap-btn-bg-hover)",
  "--tiptap-btn--bg-active": "var(--tiptap-btn-bg-active)",
  "--tiptap-btn--bg-active-hover": "color-mix(in srgb, var(--tiptap-accent-primary) 20%, white)",
};
