// Adapted from @tiptap/extension-drag-handle v3.31.3 (MIT)
// Copyright (c) Tiptap GmbH — collaboration (Yjs) support removed.
import type { Node as PMNode, ResolvedPos } from "@tiptap/pm/model";
import type { EditorView } from "@tiptap/pm/view";

import type { EdgeDetectionConfig, EdgeDetectionPreset, RuleContext } from "./types";

/**
 * Context provided to each rule evaluation function.
 *
 * Contains information about the node being evaluated and its position in the
 * ProseMirror document tree. This is the full context available for making
 * scoring decisions in custom `DragHandleRule` implementations.
 */
export interface DragHandleRule {
  /** Unique identifier for debugging and rule management. */
  id: string;
  /**
   * Evaluate the node and return a score deduction.
   *
   * The return value is subtracted from the node's base score (1000).
   * `0` keeps the node fully eligible, `>= 1000` excludes it.
   */
  evaluate: (context: RuleContext) => number;
}

/**
 * Edge detection helps grab parent containers (lists, blockquotes, etc.) by
 * moving the cursor near the edge of a nested element: the scoring system
 * deducts `strength * depth` from deeper nodes near a configured edge, making
 * the outer container the easier target.
 */
export type NestedDragHandleOptions = {
  /** Custom rules evaluated after the default rules. */
  rules?: DragHandleRule[];
  /** Include the built-in default rules before custom `rules`. @default true */
  defaultRules?: boolean;
  /** Restrict nested dragging to cursors inside these container node types. */
  allowedContainers?: string[];
  /** Cursor proximity to element edges prefers parent nodes. @default 'left' */
  edgeDetection?: EdgeDetectionPreset | Partial<EdgeDetectionConfig>;
};

/** Fully resolved nested options produced by {@link normalizeNestedOptions}. */
export interface NormalizedNestedDragHandleOptions {
  enabled: boolean;
  rules: DragHandleRule[];
  defaultRules: boolean;
  allowedContainers: string[] | undefined;
  edgeDetection: EdgeDetectionConfig;
}

/**
 * All default rules. Users can extend these or replace them entirely.
 */
export const defaultRules: DragHandleRule[] = [
  {
    id: "listItemFirstChild",
    evaluate: ({ parent, isFirst }) => {
      if (!isFirst) return 0;
      if (parent && ["listItem", "taskItem"].includes(parent.type.name)) return 1000;
      return 0;
    },
  },
  {
    id: "listWrapperDeprioritize",
    evaluate: ({ node }) => {
      const listItemTypes = ["listItem", "taskItem"];
      const firstChild = node.firstChild;
      if (firstChild && listItemTypes.includes(firstChild.type.name)) return 1000;
      return 0;
    },
  },
  {
    id: "tableStructure",
    evaluate: ({ node, parent }) => {
      if (["tableRow", "tableCell", "tableHeader"].includes(node.type.name)) return 1000;
      if (parent && parent.type.name === "tableHeader") return 1000;
      return 0;
    },
  },
  {
    id: "inlineContent",
    evaluate: ({ node }) => {
      if (node.isInline || node.isText) return 1000;
      return 0;
    },
  },
];

const DEFAULT_EDGE_CONFIG: EdgeDetectionConfig = {
  edges: ["left", "top"],
  threshold: 12,
  strength: 500,
};

export function normalizeEdgeDetection(
  input: EdgeDetectionPreset | Partial<EdgeDetectionConfig> | undefined,
): EdgeDetectionConfig {
  if (input === undefined || input === "left") return { ...DEFAULT_EDGE_CONFIG };
  if (input === "right") return { edges: ["right", "top"], threshold: 12, strength: 500 };
  if (input === "both") return { edges: ["left", "right", "top"], threshold: 12, strength: 500 };
  if (input === "none") return { edges: [], threshold: 0, strength: 0 };
  return { ...DEFAULT_EDGE_CONFIG, ...input };
}

export function normalizeNestedOptions(
  input: boolean | NestedDragHandleOptions | undefined,
): NormalizedNestedDragHandleOptions {
  if (input === false || input === undefined) {
    return {
      enabled: false,
      rules: [],
      defaultRules: true,
      allowedContainers: undefined,
      edgeDetection: normalizeEdgeDetection("none"),
    };
  }
  if (input === true) {
    return {
      enabled: true,
      rules: [],
      defaultRules: true,
      allowedContainers: undefined,
      edgeDetection: normalizeEdgeDetection("left"),
    };
  }
  return {
    enabled: true,
    rules: input.rules ?? [],
    defaultRules: input.defaultRules ?? true,
    allowedContainers: input.allowedContainers,
    edgeDetection: normalizeEdgeDetection(input.edgeDetection),
  };
}

/** True if the cursor is within the threshold zone of any configured edge. */
function isNearEdge(
  coords: { x: number; y: number },
  element: Element,
  config: EdgeDetectionConfig,
): boolean {
  if (config.edges.length === 0) return false;
  const rect = element.getBoundingClientRect();
  const { threshold, edges } = config;
  return edges.some((edge) => {
    if (edge === "left") return coords.x - rect.left < threshold;
    if (edge === "right") return rect.right - coords.x < threshold;
    if (edge === "top") return coords.y - rect.top < threshold;
    if (edge === "bottom") return rect.bottom - coords.y < threshold;
    return false;
  });
}

/**
 * Deeper nodes get larger deductions near edges, making shallower (parent)
 * nodes win.
 */
function calculateEdgeDeduction(
  coords: { x: number; y: number },
  element: Element | null,
  config: EdgeDetectionConfig,
  depth: number,
): number {
  if (!element || config.edges.length === 0) return 0;
  if (isNearEdge(coords, element, config)) return config.strength * depth;
  return 0;
}

/** Base score for all nodes; score <= 0 excludes a node as a drag target. */
const BASE_SCORE = 1000;

function calculateScore(
  context: RuleContext,
  rules: DragHandleRule[],
  edgeConfig: EdgeDetectionConfig,
  coords: { x: number; y: number },
): number {
  let score = BASE_SCORE;
  let excluded = false;
  rules.every((rule) => {
    const deduction = rule.evaluate(context);
    score -= deduction;
    if (score <= 0) {
      excluded = true;
      return false;
    }
    return true;
  });
  if (excluded) return -1;
  const dom = context.view.nodeDOM(context.pos);
  score -= calculateEdgeDeduction(coords, dom instanceof Element ? dom : null, edgeConfig, context.depth);
  if (score <= 0) return -1;
  return score;
}

/** Checks if any ancestor at or above the given depth is in the allowed list. */
function hasAncestorOfType($pos: ResolvedPos, depth: number, allowedTypes: string[]): boolean {
  return Array.from({ length: depth }, (_, i) => depth - 1 - i).some((d) =>
    allowedTypes.includes($pos.node(d).type.name),
  );
}

interface DragTargetCandidate {
  node: PMNode;
  pos: number;
  depth: number;
  score: number;
  dom: unknown;
}

/**
 * Finds the best drag target at the given coordinates using the scoring
 * system (nested mode only).
 */
function findBestDragTarget(
  view: EditorView,
  coords: { x: number; y: number },
  options: NormalizedNestedDragHandleOptions,
): { node: PMNode; pos: number; dom: unknown } | null {
  if (!Number.isFinite(coords.x) || !Number.isFinite(coords.y)) return null;
  const posInfo = view.posAtCoords({ left: coords.x, top: coords.y });
  if (!posInfo) return null;

  const { doc } = view.state;
  const $pos = doc.resolve(posInfo.pos);

  const rules: DragHandleRule[] = [];
  if (options.defaultRules) rules.push(...defaultRules);
  rules.push(...options.rules);

  const candidates = Array.from({ length: $pos.depth }, (_, i) => $pos.depth - i)
    .map((depth): DragTargetCandidate | null => {
      const node = $pos.node(depth);
      const nodePos = $pos.before(depth);
      if (options.allowedContainers && depth > 0) {
        if (!hasAncestorOfType($pos, depth, options.allowedContainers)) return null;
      }
      const parent = depth > 0 ? $pos.node(depth - 1) : null;
      const index = depth > 0 ? $pos.index(depth - 1) : 0;
      const siblingCount = parent ? parent.childCount : 1;
      const score = calculateScore(
        {
          node,
          pos: nodePos,
          depth,
          parent,
          index,
          isFirst: index === 0,
          isLast: index === siblingCount - 1,
          $pos,
          view,
        },
        rules,
        options.edgeDetection,
        coords,
      );
      if (score < 0) return null;
      return { node, pos: nodePos, depth, score, dom: view.nodeDOM(nodePos) };
    })
    .filter((candidate): candidate is DragTargetCandidate => candidate !== null);

  const nodeAfter = $pos.nodeAfter;
  if (nodeAfter && nodeAfter.isAtom && !nodeAfter.isInline) {
    const nodePos = posInfo.pos;
    const depth = $pos.depth + 1;
    const parent = $pos.parent;
    const index = $pos.index();
    const siblingCount = parent.childCount;
    let inAllowedContainer = true;
    if (options.allowedContainers) inAllowedContainer = hasAncestorOfType($pos, depth, options.allowedContainers);
    if (inAllowedContainer) {
      const score = calculateScore(
        {
          node: nodeAfter,
          pos: nodePos,
          depth,
          parent,
          index,
          isFirst: index === 0,
          isLast: index === siblingCount - 1,
          $pos,
          view,
        },
        rules,
        options.edgeDetection,
        coords,
      );
      if (score >= 0) {
        const dom = view.nodeDOM(nodePos);
        if (dom) candidates.push({ node: nodeAfter, pos: nodePos, depth, score, dom });
      }
    }
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.depth - a.depth;
  });

  const winner = candidates[0];
  if (!winner.dom) return null;
  return { node: winner.node, pos: winner.pos, dom: winner.dom };
}

/**
 * Finds the draggable block element that is a direct child of view.dom,
 * skipping widget decorations.
 */
function findClosestTopLevelBlock(element: Element | null, view: EditorView): HTMLElement | undefined {
  let current: globalThis.Node | null = element;
  while (current instanceof Element && current.parentElement && current.parentElement !== view.dom) {
    current = current.parentElement;
  }
  if (!(current instanceof Element) || current.parentElement !== view.dom) return;
  const pmViewDesc = (current as { pmViewDesc?: { node?: unknown } }).pmViewDesc;
  if (!pmViewDesc?.node) return;
  return current as HTMLElement;
}

/** Checks if a DOMRect has valid, finite dimensions. */
function isValidRect(rect: DOMRect): boolean {
  return (
    Number.isFinite(rect.top) &&
    Number.isFinite(rect.bottom) &&
    Number.isFinite(rect.left) &&
    Number.isFinite(rect.right) &&
    rect.width > 0 &&
    rect.height > 0
  );
}

/**
 * Returns the bounding rect of the first or last child of `container` that
 * has a valid (non-zero) layout box, skipping zero-size widget decorations.
 */
function edgeBlockRect(container: HTMLElement, edge: "first" | "last"): DOMRect | null {
  let current = edge === "first" ? container.firstElementChild : container.lastElementChild;
  while (current) {
    const rect = current.getBoundingClientRect();
    if (isValidRect(rect)) return rect;
    current = edge === "first" ? current.nextElementSibling : current.previousElementSibling;
  }
  return null;
}

/** Clamps coordinates to content bounds with O(1) layout reads. */
function clampToContent(
  view: EditorView,
  x: number,
  y: number,
  inset = 5,
): { x: number; y: number } | null {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const container = view.dom as HTMLElement;
  const topRect = edgeBlockRect(container, "first");
  const botRect = edgeBlockRect(container, "last");
  if (!topRect || !botRect) return null;
  const clampedY = Math.min(Math.max(topRect.top + inset, y), botRect.bottom - inset);
  // The official source always clamps against the top block's horizontal
  // bounds (kept for behavior parity).
  const clampedX = Math.min(Math.max(topRect.left + inset, x), topRect.right - inset);
  if (!Number.isFinite(clampedX) || !Number.isFinite(clampedY)) return null;
  return { x: clampedX, y: clampedY };
}

export type FoundNodeResult = {
  resultElement: HTMLElement | null;
  resultNode: PMNode | null;
  pos: number | null;
};

/**
 * Finds the block node next to the given viewport coordinates — via the
 * nested scoring system when enabled, else via the closest top-level block.
 */
export const findElementNextToCoords = (options: {
  x: number;
  y: number;
  editor: import("@tiptap/core").Editor;
  nestedOptions: NormalizedNestedDragHandleOptions;
}): FoundNodeResult => {
  const { x, y, editor, nestedOptions } = options;
  const { view, state } = editor;
  const clamped = clampToContent(view, x, y, 5);
  if (!clamped) return { resultElement: null, resultNode: null, pos: null };
  const { x: clampedX, y: clampedY } = clamped;

  if (nestedOptions.enabled) {
    const target = findBestDragTarget(view, { x: clampedX, y: clampedY }, nestedOptions);
    if (!target) return { resultElement: null, resultNode: null, pos: null };
    return {
      resultElement: target.dom instanceof HTMLElement ? target.dom : null,
      resultNode: target.node,
      pos: target.pos,
    };
  }

  const elements = view.root.elementsFromPoint(clampedX, clampedY);
  let block: HTMLElement | undefined;
  Array.prototype.some.call(elements, (el: Element) => {
    if (!view.dom.contains(el)) return false;
    const candidate = findClosestTopLevelBlock(el, view);
    if (candidate) {
      block = candidate;
      return true;
    }
    return false;
  });

  if (!block) {
    const coords = view.posAtCoords({ left: clampedX, top: clampedY });
    if (coords) {
      const $pos = state.doc.resolve(coords.pos);
      const depth = Math.min($pos.depth, 1);
      const blockPos = depth > 0 ? $pos.before(depth) : $pos.pos;
      const blockNode = state.doc.nodeAt(blockPos);
      if (blockNode) {
        const dom = view.nodeDOM(blockPos);
        return {
          resultElement: dom instanceof HTMLElement ? dom : null,
          resultNode: blockNode,
          pos: blockPos,
        };
      }
    }
    return { resultElement: null, resultNode: null, pos: null };
  }

  let pos: number;
  try {
    pos = view.posAtDOM(block, 0);
  } catch {
    return { resultElement: null, resultNode: null, pos: null };
  }
  const node = state.doc.nodeAt(pos);
  if (!node) {
    const resolvedPos = state.doc.resolve(pos);
    const parent = resolvedPos.parent;
    return { resultElement: block, resultNode: parent, pos: resolvedPos.start() };
  }
  return { resultElement: block, resultNode: node, pos };
};
