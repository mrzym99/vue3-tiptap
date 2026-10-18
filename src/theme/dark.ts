import type { Theme } from "@/types";

/** Dark theme — Soft UI dark palette mirroring the light theme's token structure. */
export const darkTheme: Theme = {
  // --- surfaces (slate-tinted, soft) ---
  "--tiptap-color-bg": "#1F1F1F",
  "--tiptap-color-bg-canvas": "#191A1D",
  "--tiptap-color-bg-hover": "#2A2B30",
  "--tiptap-color-bg-active": "#34353B",
  "--tiptap-color-bg-subtle": "#26272B",

  // --- text ---
  "--tiptap-color-text": "#E6E6E6",
  "--tiptap-color-text-secondary": "#A6A6A6",
  "--tiptap-color-text-muted": "#7A7A7A",

  // --- borders (kept hairline-soft; shadows carry the layering) ---
  "--tiptap-color-border": "#34353B",
  "--tiptap-color-border-strong": "#44454C",

  // --- accents (primary accent hue; everything derived follows it via color-mix) ---
  "--tiptap-accent-primary": "#818CF8", // indigo-400
  "--tiptap-accent-danger": "#EB5757",
  "--tiptap-accent-success": "#2E8B7E",
  "--tiptap-accent-warning": "#DFAB01",
  "--tiptap-accent-primary-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 25%, transparent)",
  "--tiptap-accent-danger-bg": "rgba(235, 87, 87, 0.14)",
  "--tiptap-accent-success-bg": "rgba(15, 123, 108, 0.18)",
  "--tiptap-accent-warning-bg": "rgba(223, 171, 1, 0.14)",

  // --- buttons (transparent default, hover/active only deepen bg) ---
  "--tiptap-btn-bg": "transparent",
  "--tiptap-btn-bg-hover": "#2A2B30",
  "--tiptap-btn-bg-active": "#34353B",
  "--tiptap-btn-primary-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 88%, black)",
  "--tiptap-btn-primary-bg-hover": "var(--tiptap-accent-primary)",
  "--tiptap-btn-primary-text": "#FFFFFF",
  "--tiptap-btn-primary-shadow": "0 4px 14px rgba(0, 0, 0, 0.35), 0 4px 14px color-mix(in srgb, var(--tiptap-accent-primary) 25%, transparent)",
  "--tiptap-btn-primary-shadow-hover": "0 8px 20px rgba(0, 0, 0, 0.4), 0 8px 20px color-mix(in srgb, var(--tiptap-accent-primary) 32%, transparent)",
  "--tiptap-btn-danger-bg": "#EB5757",
  "--tiptap-btn-danger-bg-hover": "#F26D6D",
  "--tiptap-btn-danger-text": "#FFFFFF",
  "--tiptap-btn-danger-shadow": "0 4px 14px rgba(0, 0, 0, 0.35), 0 4px 14px rgba(235, 87, 87, 0.22)",
  "--tiptap-btn-danger-shadow-hover": "0 8px 20px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(235, 87, 87, 0.28)",
  "--tiptap-btn-secondary-bg": "#2B2B2B",
  "--tiptap-btn-secondary-text": "#CFCFCF",

  // --- interaction feedback (Halo Focus: soft large-radius ring) ---
  "--tiptap-focus-ring": "color-mix(in srgb, var(--tiptap-accent-primary) 30%, transparent)",
  "--tiptap-selection-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 38%, transparent)",
  "--tiptap-drag-handle": "rgba(230, 230, 230, 0.35)",

  // popover / menu (follow the theme; shadows carry color tint, never hard)
  "--tiptap-popover-bg": "var(--tiptap-color-bg)",
  "--tiptap-popover-text": "var(--tiptap-color-text)",
  "--tiptap-popover-border": "var(--tiptap-color-border)",
  "--tiptap-popover-shadow":
    "0 2px 8px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.35)",

  // toolbar divider (deeper black layers — dark-on-dark is the only visible tint here)
  "--tiptap-toolbar-shadow": "0 1px 2px rgba(0, 0, 0, 0.45), 0 4px 14px rgba(0, 0, 0, 0.35)",

  // dialog (modal mask; dialog panel follows popover tokens)
  "--tiptap-dialog-mask": "rgba(0, 0, 0, 0.6)",

  // menu item (follow the theme)
  "--tiptap-menu-item-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-menu-item-active": "var(--tiptap-color-bg-active)",

  // input (Soft UI: borderless, tinted field bg, focus ring carries feedback)
  "--tiptap-input-bg": "#26272B",
  "--tiptap-input-border": "transparent",
  "--tiptap-input-border-hover": "var(--tiptap-accent-primary)",
  "--tiptap-input-text": "var(--tiptap-color-text)",
  "--tiptap-input-placeholder": "var(--tiptap-color-text-muted)",

  // content elements
  "--tiptap-mark-bg": "rgba(250, 204, 21, 0.25)",
  "--tiptap-link-color": "var(--tiptap-accent-primary)",
  "--tiptap-code-bg": "var(--tiptap-color-bg-subtle)",
  "--tiptap-code-text": "var(--tiptap-color-text)",

  // --- fixed tooltip colors (black bg + white text, same value in both themes) ---
  "--tiptap-tooltip-bg": "#111111",
  "--tiptap-tooltip-text": "#FFFFFF",

  // --- backward-compatible aliases (used by existing components) ---
  "--tiptap-color-text-3": "var(--tiptap-color-text-muted)",
  "--tiptap-btn--bg-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-btn--bg-active": "#34353B",
  "--tiptap-btn--bg-active-hover": "#3C3D44",
};
