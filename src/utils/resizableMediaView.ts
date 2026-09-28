import { ResizableNodeView } from "@tiptap/core";
import type { NodeViewRendererProps } from "@tiptap/core";

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
}

/**
 * Shared Notion-style drag-resize node view for media nodes.
 *
 * Backed by tiptap's built-in `ResizableNodeView` (corner handles, aspect-locked,
 * Shift to temporarily unlock), so there's no hand-rolled pointer math per media
 * type. Size is persisted to the node's `width`/`height` attributes; the handles
 * share one `.tiptap-media-resizer*` CSS class set.
 */
export const createResizableMediaView = ({ nodeName, createElement }: ResizableMediaViewOptions) => {
  return ({ node, getPos, editor }: NodeViewRendererProps) => {
    const element = createElement(node);

    return new ResizableNodeView({
      element,
      node,
      getPos,
      editor,
      onResize: (width, height) => {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
      },
      onCommit: (width, height) => {
        editor.chain().focus().updateAttributes(nodeName, { width, height }).run();
      },
      onUpdate: () => true,
      options: {
        min: { width: 40, height: 40 },
        preserveAspectRatio: true,
        className: {
          container: "tiptap-media-resizer",
          wrapper: "tiptap-media-resizer-wrapper",
          handle: "tiptap-media-resize-handle",
          resizing: "tiptap-media-is-resizing",
        },
      },
    });
  };
};