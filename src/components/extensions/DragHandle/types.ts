// Adapted from @tiptap/extension-drag-handle v3.31.3 (MIT)
// Copyright (c) Tiptap GmbH — collaboration (Yjs) support removed.
import type { Node, ResolvedPos } from "@tiptap/pm/model";
import type { EditorView } from "@tiptap/pm/view";

/** Context provided to each rule evaluation function. */
export interface RuleContext {
  /** The node being evaluated as a potential drag target */
  node: Node;
  /** Absolute position of the node in the document */
  pos: number;
  /** Depth in the document tree (0 = document root) */
  depth: number;
  /** Parent node, or `null` when the node is the document root */
  parent: Node | null;
  /** 0-based index among the parent's children */
  index: number;
  isFirst: boolean;
  isLast: boolean;
  /** Resolved position for advanced ProseMirror queries */
  $pos: ResolvedPos;
  /** The editor view, for DOM access in custom rules */
  view: EditorView;
}

export type EdgeDetectionPreset = "left" | "right" | "both" | "none";

export interface EdgeDetectionConfig {
  /** Which edges trigger parent preference */
  edges: Array<"left" | "right" | "top" | "bottom">;
  /** Distance in px from the element edge that triggers the deduction */
  threshold: number;
  /** Deduction per depth level (`strength * depth`) */
  strength: number;
}
