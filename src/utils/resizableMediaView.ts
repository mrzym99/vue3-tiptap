import { ResizableNodeView } from "@tiptap/core";
import type { NodeViewRendererProps } from "@tiptap/core";
import type { ResizableNodeViewDirection } from "@tiptap/core";

export interface ResizableMediaViewOptions {
  /**
   * Node type name — the target of `updateAttributes` when a resize commits
   * (e.g. `"image"`, `"video"`). The node must declare `width`/`height` attrs.
   */
  nodeName: string;
  /**
   * Build the media element (img / iframe / video) that the drag handles wrap.
   * Returned element gets its inline `width`/`height` driven by the resize.
   */
  createElement: (node: NodeViewRendererProps["node"]) => HTMLElement;
  /**
   * Which handles to attach. Defaults to the four corners only.
   * Pass edge directions (`left`/`right`/`top`/`bottom`) for 1-axis resizes.
   */
  directions?: ResizableNodeViewDirection[];
  /** Lock the aspect ratio while dragging (default `true`; Shift temporarily unlocks when off). */
  preserveAspectRatio?: boolean;
}

/**
 * Shared Notion-style drag-resize node view for media nodes.
 *
 * Backed by tiptap's built-in `ResizableNodeView` (corner handles, aspect-locked,
 * Shift to temporarily unlock), so there's no hand-rolled pointer math per media
 * type. Size is persisted to the node's `width`/`height` attributes; the handles
 * share one `.tiptap-media-resizer*` CSS class set.
 */
export const createResizableMediaView = ({
  nodeName,
  createElement,
  directions,
  preserveAspectRatio = true,
}: ResizableMediaViewOptions) => {
  return ({ node, getPos, editor }: NodeViewRendererProps) => {
    const element = createElement(node);

    const resizable = new ResizableNodeView({
      element,
      node,
      getPos,
      editor,
      onResize: (width, height) => {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
      },
      onCommit: (width, height) => {
        const pos = getPos();
        if (typeof pos !== "number") return;
        editor.chain().setNodeSelection(pos).updateAttributes(nodeName, { width, height }).run();
      },
      onUpdate: () => true,
      options: {
        min: { width: 40, height: 40 },
        preserveAspectRatio,
        ...(directions ? { directions } : {}),
        className: {
          container: "tiptap-media-resizer",
          wrapper: "tiptap-media-resizer-wrapper",
          handle: "tiptap-media-resize-handle",
          resizing: "tiptap-media-is-resizing",
        },
      },
    });

    const contentWidth = () => {
      const dom = editor.view.dom;
      const padding = getComputedStyle(dom);
      return dom.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight);
    };
    const isPercent = (value: unknown) => typeof value === "string" && value.trim().endsWith("%");
    if (isPercent(node.attrs.width)) {
      element.style.width = `${contentWidth()}px`;
    }
    if (isPercent(node.attrs.height)) {
      element.style.height = node.attrs.height;
    }

    // Cap the drag at the editor's live content width — without it the media
    // keeps growing past the visible edge. A no-op `set` swallows any upstream
    // self-assignment (`this.maxSize = ...` would throw in strict mode with a
    // getter-only accessor); `configurable` lets a future upgrade replace it.
    Object.defineProperty(resizable, "maxSize", {
      configurable: true,
      get: () => ({ width: contentWidth() }),
      set: () => {},
    });

    return resizable;
  };
};
