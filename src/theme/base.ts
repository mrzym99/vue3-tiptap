import type { Theme } from "@/types";

/**
 * Base tokens: non-color values only (sizes/radius/spacing/z-index).
 * All colors live in the concrete themes (light.ts / dark.ts) — including the
 * FIXED tooltip colors (black bg + white text), which both themes set to the
 * same value so the tooltip does not follow the theme, unlike the popover.
 */
export const baseTheme: Theme = {
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
  "--tiptap-font-size": "1em",

  // --- non-color, theme-independent values ---
  "--tiptap-tooltip-radius": "8px",
  "--tiptap-z-popover": "1000",
  "--tiptap-z-dialog": "1100",
  "--tiptap-input-radius": "8px",
  "--tiptap-input-padding": "6px 10px",

  "--tiptap-min-width": "220px",

  // 编辑区(正文容器)留白:页面级密度,大于控件级 padding 档(最大 12px),
  // 宿主可按嵌入场景覆盖(窄侧栏可调小,文档式布局可调大到 32px+)
  "--tiptap-content-padding": "24px",
};
