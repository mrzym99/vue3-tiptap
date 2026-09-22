// Adapted from @tiptap/extension-drag-handle v3.31.3 (MIT)
// Copyright (c) Tiptap GmbH — collaboration (Yjs) support removed.
import type { Editor } from "@tiptap/core";
import type { Node as PMNode, ResolvedPos, Slice } from "@tiptap/pm/model";
import type { NodeSelection as NodeSelectionType } from "@tiptap/pm/state";
import type { Transaction } from "@tiptap/pm/state";

import { NodeRangeSelection, getSelectionRanges, isNodeRangeSelection } from "@tiptap/extension-node-range";
import { NodeSelection } from "@tiptap/pm/state";

import { findElementNextToCoords, type NormalizedNestedDragHandleOptions } from "./rules";

export function getCSSText(element: Element, properties?: string[]): string {
  const style = getComputedStyle(element);
  if (properties) {
    return properties
      .map((property) => property.trim())
      .filter((property) => property.length > 0)
      .map((property) => `${property}:${style.getPropertyValue(property)};`)
      .join("");
  }
  let value = "";
  for (let i = 0; i < style.length; i += 1) {
    value += `${style[i]}:${style.getPropertyValue(style[i])};`;
  }
  return value;
}

/** Clones a node with (a subset of) its computed styles inlined. */
export function cloneElement(node: HTMLElement, properties?: string[]): HTMLElement {
  const clonedNode = node.cloneNode(true) as HTMLElement;
  const sourceElements = [node, ...Array.from(node.getElementsByTagName("*"))] as HTMLElement[];
  const targetElements = [clonedNode, ...Array.from(clonedNode.getElementsByTagName("*"))] as HTMLElement[];
  sourceElements.forEach((sourceElement, index) => {
    targetElements[index].style.cssText = getCSSText(sourceElement, properties);
  });
  return clonedNode;
}

/** Resolves the DOM element that visually represents the dragged block. */
export function getDraggedBlockElement(view: Editor["view"], pos: number): HTMLElement | null {
  const nodeDom = view.nodeDOM(pos);
  if (nodeDom instanceof Element && nodeDom !== view.dom) return nodeDom as HTMLElement;
  const { node, offset } = view.domAtPos(pos);
  const child = node.childNodes[offset];
  if (child instanceof Element) return child as HTMLElement;
  if (node instanceof Element) return node as HTMLElement;
  if (node.nodeType === globalThis.Node.TEXT_NODE && node.parentElement) return node.parentElement;
  return null;
}

/** Resolves the text direction for the block being dragged. */
export function getDraggedBlockDir(view: Editor["view"], pos: number): string {
  const draggedDom = getDraggedBlockElement(view, pos);
  return (draggedDom ? getComputedStyle(draggedDom).direction : getComputedStyle(view.dom).direction) || "ltr";
}

export function removeNode(node: globalThis.Node | null | undefined): void {
  node?.parentNode?.removeChild(node);
}

function getDragImageOffset(direction: string, wrapperWidth: number): number {
  return direction === "rtl" ? wrapperWidth : 0;
}

function shouldResetMargin(dragImageProperties?: string[]): boolean {
  if (!dragImageProperties) return true;
  return !dragImageProperties.some((property) => {
    const p = property.trim().toLowerCase();
    return p === "margin" || p.startsWith("margin-");
  });
}

interface DragHandleRange {
  $from: ResolvedPos;
  $to: ResolvedPos;
}

/** Ranges to drag: the hovered block, or the current NodeRange selection when inside one. */
function getDragHandleRanges(
  event: DragEvent,
  editor: Editor,
  nestedOptions: NormalizedNestedDragHandleOptions,
  dragContext: { node: PMNode | null; pos: number },
): DragHandleRange[] {
  const { doc } = editor.view.state;
  if (nestedOptions.enabled && dragContext.node && dragContext.pos >= 0) {
    const nodeStart = dragContext.pos;
    const nodeEnd = dragContext.pos + dragContext.node.nodeSize;
    return [{ $from: doc.resolve(nodeStart), $to: doc.resolve(nodeEnd) }];
  }
  const result = findElementNextToCoords({
    editor,
    x: event.clientX,
    y: event.clientY,
    nestedOptions,
  });
  if (!result.resultNode || result.pos === null) return [];
  const offset = result.resultNode.isText || result.resultNode.isAtom ? 0 : -1;
  const $from = doc.resolve(result.pos);
  const $to = doc.resolve(result.pos + result.resultNode.nodeSize + offset);
  return getSelectionRanges($from, $to, 0, { extendOnBoundaryOverlap: false });
}

/** dragstart on the handle: build the drag preview, set `view.dragging`, dispatch the selection. */
export function dragHandler(
  event: DragEvent,
  editor: Editor,
  nestedOptions: NormalizedNestedDragHandleOptions,
  dragContext: { node: PMNode | null; pos: number },
  dragImageProperties?: string[],
): void {
  const { view } = editor;
  if (!event.dataTransfer) return;
  const { empty, $from, $to } = view.state.selection;
  const dragHandleRanges = getDragHandleRanges(event, editor, nestedOptions, dragContext);
  const selectionRanges = getSelectionRanges($from, $to, 0, { extendOnBoundaryOverlap: false });
  const isDragHandleWithinSelection = selectionRanges.some((range) => {
    return dragHandleRanges.find((dragHandleRange) => {
      return dragHandleRange.$from === range.$from && dragHandleRange.$to === range.$to;
    });
  });
  const ranges = empty || !isDragHandleWithinSelection ? dragHandleRanges : selectionRanges;
  if (!ranges.length) return;
  const { tr } = view.state;

  const wrapper = document.createElement("div");
  const from = ranges[0].$from.pos;
  const to = ranges[ranges.length - 1].$to.pos;
  const direction = getDraggedBlockDir(view, from);
  wrapper.setAttribute("dir", direction);

  const isNestedDrag = nestedOptions.enabled && dragContext.node;
  const isSingleBlock = ranges.length === 1;

  let slice: Slice;
  let selection: NodeSelectionType | NodeRangeSelection;
  if (isNestedDrag && isSingleBlock) {
    slice = view.state.doc.slice(from, to);
    selection = NodeSelection.create(view.state.doc, from);
  } else {
    selection = NodeRangeSelection.create(view.state.doc, from, to);
    slice = selection.content();
  }

  const resetMargin = shouldResetMargin(dragImageProperties);
  ranges.forEach((range) => {
    const element = getDraggedBlockElement(view, range.$from.pos);
    if (!element) return;
    const clonedElement = cloneElement(element, dragImageProperties);
    if (resetMargin) clonedElement.style.margin = "0";
    wrapper.append(clonedElement);
  });
  wrapper.style.position = "absolute";
  wrapper.style.top = "-10000px";
  wrapper.style.pointerEvents = "none";
  document.body.append(wrapper);

  event.dataTransfer.clearData();
  const dragImageX = getDragImageOffset(direction, wrapper.getBoundingClientRect().width);
  event.dataTransfer.setDragImage(wrapper, dragImageX, 0);

  let cleanedUp = false;
  const cleanupDragPreview = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    removeNode(wrapper);
    document.removeEventListener("drop", cleanupDragPreview);
    document.removeEventListener("dragend", cleanupDragPreview);
    document.removeEventListener("keydown", cleanupDragPreview);
    document.removeEventListener("pointercancel", cleanupDragPreview);
  };
  // Safety net: extreme cancel paths (Escape etc.) fire neither drop nor
  // dragend, leaving the preview node behind
  document.addEventListener("keydown", cleanupDragPreview, { once: true });
  document.addEventListener("pointercancel", cleanupDragPreview, { once: true });

  const nodeSelection = selection instanceof NodeSelection ? selection : undefined;
  // prosemirror-view's types omit the `node` field, but it works at runtime
  // (same as the official source)
  view.dragging = { slice, move: true, node: nodeSelection } as typeof view.dragging;
  tr.setSelection(selection);
  view.dispatch(tr);
  document.addEventListener("drop", cleanupDragPreview);
  document.addEventListener("dragend", cleanupDragPreview);
}

export const getOuterNodePos = (doc: PMNode, pos: number): number => {
  const resolvedPos = doc.resolve(pos);
  const { depth } = resolvedPos;
  if (depth === 0) return pos;
  return resolvedPos.pos - resolvedPos.parentOffset - 1;
};

export const getOuterNode = (doc: PMNode, pos: number): PMNode | null => {
  const node = doc.nodeAt(pos);
  const resolvedPos = doc.resolve(pos);
  let { depth } = resolvedPos;
  let parent = node;
  while (depth > 0) {
    const currentNode = resolvedPos.node(depth);
    depth -= 1;
    if (depth === 0) parent = currentNode;
  }
  return parent;
};

export interface PendingDropRestore {
  anchorPos: number;
  nodeCount: number;
  depth: number;
}

/** Map the pending drop-restore anchor through a doc change; null when deleted. */
export function mapPendingRestoreAnchor(
  pendingRestore: PendingDropRestore,
  tr: Transaction,
): PendingDropRestore | null {
  if (!tr.docChanged) return pendingRestore;
  const mappedResult = tr.mapping.mapResult(pendingRestore.anchorPos, 1);
  if (mappedResult.deleted) return null;
  return { ...pendingRestore, anchorPos: mappedResult.pos };
}

function sumNodeSizes(parent: PMNode, from: number, to: number): number {
  let size = 0;
  for (let i = from; i < to; i += 1) size += parent.child(i).nodeSize;
  return size;
}

export function getActiveDragRange(selection: import("@tiptap/pm/state").Selection): PendingDropRestore | null {
  if (!isNodeRangeSelection(selection)) return null;
  return {
    anchorPos: selection.from,
    nodeCount: selection.ranges.length,
    depth: selection.depth ?? 0,
  };
}

/** Position range of the freshly dropped blocks, for restoring the selection. */
function getDroppedBlockRange(
  doc: PMNode,
  anchorPos: number,
  nodeCount: number,
  depth: number,
): { anchor: number; head: number; count: number } | null {
  const $pos = doc.resolve(anchorPos);
  const parent = $pos.node(depth);
  let index = $pos.index(depth);
  if (index >= parent.childCount) index = Math.max(0, parent.childCount - nodeCount);
  const count = Math.min(nodeCount, parent.childCount - index);
  if (count <= 0) return null;
  const blockStart = $pos.start(depth) + sumNodeSizes(parent, 0, index);
  return {
    anchor: blockStart,
    head: blockStart + sumNodeSizes(parent, index, index + count),
    count,
  };
}

export function createDroppedNodeRangeSelection(
  doc: PMNode,
  anchorPos: number,
  nodeCount: number,
  depth: number,
): NodeRangeSelection | null {
  try {
    const range = getDroppedBlockRange(doc, anchorPos, nodeCount, depth);
    if (!range) return null;
    const selection = NodeRangeSelection.create(doc, range.anchor, range.head, depth);
    return selection.ranges.length === nodeCount ? selection : null;
  } catch {
    return null;
  }
}
