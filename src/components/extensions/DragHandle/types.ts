// Adapted from @tiptap/extension-drag-handle v3.31.3 (MIT)
// Copyright (c) Tiptap GmbH — collaboration (Yjs) support removed.
import type { Node, ResolvedPos } from "@tiptap/pm/model";
import type { EditorView } from "@tiptap/pm/view";

/**
 * Context provided to each rule evaluation function: the node being evaluated
 * and its position in the ProseMirror document tree.
 */
export interface RuleContext {
  /** The ProseMirror node being evaluated as a potential drag target */
  node: Node;
  /** Absolute position of the node in the document */
  pos: number;
  /**
   * Depth in the document tree (0 = document root).
   * A paragraph inside a listItem inside a bulletList has depth 3.
   */
  depth: number;
  /** Parent node, or `null` when the node is the document root. */
  parent: Node | null;
  /** This node's index among its parent's children (0-based) */
  index: number;
  /** `true` when this node is the first child of its parent */
  isFirst: boolean;
  /** `true` when this node is the last child of its parent */
  isLast: boolean;
  /** The resolved position for advanced ProseMirror queries. */
  $pos: ResolvedPos;
  /** The editor view for DOM access if needed in custom rules. */
  view: EditorView;
}

/** Edge detection preset strings for common use cases. */
export type EdgeDetectionPreset = "left" | "right" | "both" | "none";

/** Fine-grained edge detection configuration. */
export interface EdgeDetectionConfig {
  /** Which edges trigger parent preference. @default ['left', 'top'] */
  edges: Array<"left" | "right" | "top" | "bottom">;
  /** Distance in pixels from the element edge that triggers the deduction. @default 12 */
  threshold: number;
  /** Deduction multiplier per depth level (`strength * depth`). @default 500 */
  strength: number;
}
