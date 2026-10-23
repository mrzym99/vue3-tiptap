import type { Theme } from "@/types";

/** Dark theme — Soft UI dark palette mirroring the light theme's token structure. */
export const darkTheme: Theme = {
  // native widgets (scrollbars, form controls) follow the theme
  "--tiptap-color-scheme": "dark",

  // --- surfaces (hover/active are interaction feedback: accent-tinted via color-mix) ---
  "--tiptap-color-bg": "#1F1F1F",
  "--tiptap-color-bg-hover": "color-mix(in srgb, var(--tiptap-accent-primary) 10%, #1F1F1F)",
  "--tiptap-color-bg-active": "color-mix(in srgb, var(--tiptap-accent-primary) 16%, #1F1F1F)",
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

  // --- buttons (transparent default; hover/active share the neutral surface tokens) ---
  "--tiptap-btn-bg": "transparent",
  "--tiptap-btn-bg-hover": "var(--tiptap-color-bg-hover)",
  "--tiptap-btn-bg-active": "var(--tiptap-color-bg-active)",
  "--tiptap-btn-primary-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 88%, black)",
  "--tiptap-btn-primary-bg-hover": "var(--tiptap-accent-primary)",
  "--tiptap-btn-primary-text": "#FFFFFF",
  "--tiptap-btn-primary-shadow": "0 4px 14px rgba(0, 0, 0, 0.35), 0 4px 14px color-mix(in srgb, var(--tiptap-accent-primary) 25%, transparent)",
  "--tiptap-btn-primary-shadow-hover": "0 8px 20px rgba(0, 0, 0, 0.4), 0 8px 20px color-mix(in srgb, var(--tiptap-accent-primary) 32%, transparent)",
  "--tiptap-btn-danger-bg": "var(--tiptap-accent-danger)",
  "--tiptap-btn-danger-bg-hover": "#F26D6D",
  "--tiptap-btn-danger-text": "#FFFFFF",
  "--tiptap-btn-danger-shadow": "0 4px 14px rgba(0, 0, 0, 0.35), 0 4px 14px rgba(235, 87, 87, 0.22)",
  "--tiptap-btn-danger-shadow-hover": "0 8px 20px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(235, 87, 87, 0.28)",

  // --- interaction feedback (Halo Focus: soft large-radius ring) ---
  "--tiptap-focus-ring": "color-mix(in srgb, var(--tiptap-accent-primary) 30%, transparent)",
  "--tiptap-selection-bg": "color-mix(in srgb, var(--tiptap-accent-primary) 38%, transparent)",

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
  "--tiptap-input-bg": "var(--tiptap-color-bg-subtle)",
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
  "--tiptap-btn--bg-hover": "var(--tiptap-btn-bg-hover)",
  "--tiptap-btn--bg-active": "var(--tiptap-btn-bg-active)",
  "--tiptap-btn--bg-active-hover": "color-mix(in srgb, var(--tiptap-accent-primary) 22%, #1F1F1F)",
};
