// Thin wrapper around the OFFICIAL @tiptap/extension-drag-handle (v3.32+).
// The previous hand-fork of v3.31.3 has been removed; upstream now ships the
// nested scoring rules and drop-restore logic. Remaining known upstream gaps
// we accepted: no scroll-follow repositioning, no `ariaLabel` option.
import type { DragHandleOptions as TiptapDragHandleOptions } from "@tiptap/extension-drag-handle";
import type { Editor } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";

import { DragHandle as TiptapDragHandle } from "@tiptap/extension-drag-handle";

// Keep the names this library has always exported, mapped onto the official ones
export type {
  DragHandleRule,
  EdgeDetectionConfig,
  EdgeDetectionPreset,
  RuleContext,
  NestedOptions as NestedDragHandleOptions,
} from "@tiptap/extension-drag-handle";

export interface DragHandleOptions extends Omit<TiptapDragHandleOptions, "onNodeChange"> {
  /** Called when the hovered node changes; upstream passes `pos` at runtime. */
  onNodeChange?: (options: { node: PMNode | null; editor: Editor; pos: number }) => void;
}

// Grip icon inlined as SVG: the handle is plain DOM, `~icons/` imports unavailable
const GRIP_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="9" cy="6" r="0.5" fill="currentColor"/><circle cx="15" cy="6" r="0.5" fill="currentColor"/><circle cx="9" cy="12" r="0.5" fill="currentColor"/><circle cx="15" cy="12" r="0.5" fill="currentColor"/><circle cx="9" cy="18" r="0.5" fill="currentColor"/><circle cx="15" cy="18" r="0.5" fill="currentColor"/></svg>';

export const DragHandle = /* @__PURE__ */ TiptapDragHandle.extend<DragHandleOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as DragHandleOptions),
      // Official default render is a bare `div.drag-handle` (no icon) — restore
      // the grip markup our stylesheet (`editor-content`) expects.
      render() {
        const element = document.createElement("div");
        element.classList.add("drag-handle");
        element.dataset.dragHandle = "";
        element.setAttribute("aria-label", "Drag to move");
        element.title = "Drag to move";
        element.innerHTML = GRIP_SVG;
        return element;
      },
    };
  },
});
