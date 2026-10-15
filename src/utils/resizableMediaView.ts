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
        editor.chain().focus().updateAttributes(nodeName, { width, height }).run();
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

    // The base class coerces width/height attrs to `${value}px` in its
    // (private) applyInitialSize, corrupting percentage defaults such as the
    // video's "100%" width into 100px. Re-apply percentage attrs verbatim;
    // the aspect ratio is re-measured from the element on drag start, so no
    // internal state needs fixing up. The first drag commits concrete px.
    const isPercent = (value: unknown) => typeof value === "string" && value.trim().endsWith("%");
    if (isPercent(node.attrs.width)) {
      element.style.width = node.attrs.width;
      // The container is a flex row, so the wrapper shrink-wraps its content
      // and a percentage width collapses to the media's fallback (~300px).
      // Stretch the wrapper so the percentage resolves against the full row.
      resizable.wrapper.style.width = "100%";
    }
    if (isPercent(node.attrs.height)) {
      element.style.height = node.attrs.height;
    }

    // Cap the drag at the editor's live content width — without it the media
    // element keeps growing past the visible edge (clipped by overflow) while
    // the stored width attribute still increases. maxSize is consulted on
    // every pointer move, so expose it as a getter that re-measures (the
    // editor width can change with the window).
    Object.defineProperty(resizable, "maxSize", {
      get: () => {
        const dom = editor.view.dom;
        const padding = getComputedStyle(dom);
        return {
          width: dom.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight),
        };
      },
    });

    return resizable;
  };
};
