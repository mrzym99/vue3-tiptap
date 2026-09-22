// Adapted from @tiptap/extension-drag-handle v3.31.3 (MIT)
// Copyright (c) Tiptap GmbH — collaboration (Yjs) support removed.
//
// Deliberate deviations from the official source (do not "re-sync" these):
// 1. Scroll following — official has none; the handle wrapper is anchored
//    outside the inner scroll container, so we reposition on scroll.
// 2. Nested update() — official promotes the current target to the top-level
//    node on every doc change, which makes the handle jump away from nested
//    blocks (details/blockquote) after drops; we keep the nested target.
// 3. Handle-proximity guard — approaching the handle must not retarget.
// See rules.ts for the edge-detection deviations.
import type { Editor } from "@tiptap/core";
import type { ComputePositionConfig, VirtualElement } from "@floating-ui/dom";
import type { Node as PMNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import type { Transaction, EditorState } from "@tiptap/pm/state";

import { isFirefox } from "@tiptap/core";
import { computePosition } from "@floating-ui/dom";

import {
  dragHandler,
  getActiveDragRange,
  getOuterNode,
  getOuterNodePos,
  mapPendingRestoreAnchor,
  removeNode,
  createDroppedNodeRangeSelection,
} from "./drop-restore";
import { findElementNextToCoords, type NormalizedNestedDragHandleOptions } from "./rules";

export interface DragHandlePluginProps {
  pluginKey?: PluginKey | string;
  editor: Editor;
  element: HTMLElement;
  onNodeChange?: (data: { editor: Editor; node: PMNode | null; pos: number }) => void;
  onElementDragStart?: (e: DragEvent) => void;
  onElementDragEnd?: (e: DragEvent) => void;
  computePositionConfig?: ComputePositionConfig;
  getReferencedVirtualElement?: () => VirtualElement | null;
  nestedOptions: NormalizedNestedDragHandleOptions;
  dragImageProperties?: string[];
}

/** The outermost DOM node of the given node that is a direct child of view.dom. */
function getOuterDomNode(view: Editor["view"], domNode: globalThis.Node | null): globalThis.Node | null {
  let tmpDomNode = domNode;
  while (tmpDomNode?.parentNode) {
    if (tmpDomNode.parentNode === view.dom) break;
    tmpDomNode = tmpDomNode.parentNode;
  }
  return tmpDomNode;
}

export const DragHandlePlugin = ({
  pluginKey,
  element,
  editor,
  computePositionConfig,
  getReferencedVirtualElement,
  onNodeChange,
  onElementDragStart,
  onElementDragEnd,
  nestedOptions,
  dragImageProperties,
}: DragHandlePluginProps) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("tiptap-drag-handle-wrapper");

  let locked = false;
  let currentNode: PMNode | null = null;
  let currentNodePos = -1;
  // DOM anchor of the target block: the wrapper doesn't scroll with the inner
  // scroll container, so we reposition from it on scroll
  let currentDomNode: HTMLElement | null = null;
  let rafId: number | null = null;
  let pendingMouseCoords: { x: number; y: number } | null = null;
  let activeDragRange: { anchorPos: number; nodeCount: number; depth: number } | null = null;
  let pendingRestore: { anchorPos: number; nodeCount: number; depth: number } | null = null;
  // Position token: while moving/scrolling, only the latest positioning result wins
  let positionToken = 0;
  // Scroll-follow frame coalescing: at most one reposition per frame
  let scrollRafId: number | null = null;

  function clearDragRangeState() {
    activeDragRange = null;
    pendingRestore = null;
  }

  function remapPendingRestore(tr: Transaction) {
    if (!pendingRestore) return;
    pendingRestore = mapPendingRestoreAnchor(pendingRestore, tr);
  }

  function buildRestoreTransaction(state: EditorState) {
    if (!pendingRestore) return null;
    const nodeRangeSelection = createDroppedNodeRangeSelection(
      state.doc,
      pendingRestore.anchorPos,
      pendingRestore.nodeCount,
      pendingRestore.depth,
    );
    if (!nodeRangeSelection) {
      pendingRestore = null;
      activeDragRange = null;
      return null;
    }
    clearDragRangeState();
    return state.tr.setSelection(nodeRangeSelection);
  }

  function hideHandle() {
    if (!element) return;
    element.style.visibility = "hidden";
    element.style.pointerEvents = "none";
  }

  function showHandle() {
    if (!element) return;
    if (!editor.isEditable) {
      hideHandle();
      return;
    }
    element.style.visibility = "";
    element.style.pointerEvents = "auto";
  }

  function repositionDragHandle(dom: HTMLElement) {
    const virtualElement = getReferencedVirtualElement?.() || {
      getBoundingClientRect: () => dom.getBoundingClientRect(),
    };
    const token = ++positionToken;
    computePosition(virtualElement, element, computePositionConfig)
      .then((val) => {
        // Discard stale results while moving/scrolling
        if (token !== positionToken) return;
        Object.assign(element.style, {
          position: val.strategy,
          left: `${val.x}px`,
          top: `${val.y}px`,
        });
      })
      .catch(() => {
        // Swallow failures; the next move/scroll repositions
      });
  }

  function onNodeChangeSafe(node: PMNode | null, pos: number) {
    onNodeChange?.({ editor, node, pos });
  }

  // Scroll follow: the wrapper is anchored outside the scroll container, so it
  // must reposition to the target block's current location; capture-phase
  // listener covers any host scroll container
  function onScroll() {
    if (!currentDomNode || currentNodePos === -1) return;
    if (!element || element.style.visibility === "hidden") return;
    if (scrollRafId) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      if (!currentDomNode) return;
      repositionDragHandle(currentDomNode);
    });
  }

  function onDragStart(e: DragEvent) {
    onElementDragStart?.(e);
    dragHandler(e, editor, nestedOptions, { node: currentNode, pos: currentNodePos }, dragImageProperties);
    activeDragRange = getActiveDragRange(editor.state.selection);
    if (element) element.dataset.dragging = "true";
    setTimeout(() => {
      if (element) element.style.pointerEvents = "none";
    }, 0);
  }

  function onDragEnd(e: DragEvent) {
    onElementDragEnd?.(e);
    activeDragRange = null;
    hideHandle();
    if (element) {
      element.style.pointerEvents = "auto";
      element.dataset.dragging = "false";
    }
  }

  function onDrop(e: DragEvent) {
    if (!(e.target instanceof globalThis.Node) || !editor.view.dom.contains(e.target)) return;
    if (isFirefox()) {
      const editorElement = editor.view.dom;
      requestAnimationFrame(() => {
        if (editorElement.isContentEditable) {
          editorElement.contentEditable = "false";
          editorElement.contentEditable = "true";
        }
      });
    }
    if (!activeDragRange || editor.view.state.selection.empty) return;
    const anchorPos = editor.state.selection.from;
    pendingRestore = { ...activeDragRange, anchorPos };
    editor.view.dispatch(editor.state.tr.setMeta("addToHistory", false));
  }

  function cleanup() {
    element.removeEventListener("dragstart", onDragStart);
    element.removeEventListener("dragend", onDragEnd);
    document.removeEventListener("drop", onDrop);
    document.removeEventListener("scroll", onScroll, true);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      pendingMouseCoords = null;
    }
    if (scrollRafId) {
      cancelAnimationFrame(scrollRafId);
      scrollRafId = null;
    }
    clearDragRangeState();
  }

  wrapper.appendChild(element);

  return {
    unbind() {
      cleanup();
    },
    plugin: new Plugin({
      key: typeof pluginKey === "string" ? new PluginKey(pluginKey) : pluginKey,
      state: {
        init() {
          return { locked: false };
        },
        apply(tr, value) {
          remapPendingRestore(tr);
          const isLocked = tr.getMeta("lockDragHandle");
          const hideDragHandle = tr.getMeta("hideDragHandle");
          if (isLocked !== undefined) locked = isLocked;
          if (hideDragHandle) {
            hideHandle();
            locked = false;
            currentNode = null;
            currentNodePos = -1;
            onNodeChangeSafe(null, -1);
            return value;
          }
          if (tr.docChanged && currentNodePos !== -1) {
            const newPos = tr.mapping.map(currentNodePos);
            if (newPos !== currentNodePos) currentNodePos = newPos;
          }
          return value;
        },
      },
      appendTransaction(_transactions, _oldState, newState) {
        return buildRestoreTransaction(newState);
      },
      view: () => {
        element.draggable = true;
        // Start hidden: otherwise the handle icon shows next to the first block on autofocus
        hideHandle();
        element.dataset.dragging = "false";
        editor.view.dom.parentElement?.appendChild(wrapper);
        wrapper.style.pointerEvents = "none";
        wrapper.style.position = "absolute";
        wrapper.style.top = "0";
        wrapper.style.left = "0";
        wrapper.style.zIndex = "var(--tiptap-z-popover)";
        element.addEventListener("dragstart", onDragStart);
        element.addEventListener("dragend", onDragEnd);
        document.addEventListener("drop", onDrop);
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        return {
          update(view, oldState) {
            if (!element) return;
            if (!editor.isEditable) {
              hideHandle();
              return;
            }
            if (locked) element.draggable = false;
            else element.draggable = true;
            if (view.state.doc.eq(oldState.doc) || currentNodePos === -1) return;
            let domNode = view.nodeDOM(currentNodePos);
            if (nestedOptions.enabled) {
              // Nested mode: keep the current (possibly nested) target; do not
              // promote it to a top-level block or the handle jumps after a drop
              if (domNode === view.dom) return;
              if (domNode?.nodeType !== 1) return;
              currentDomNode = domNode as HTMLElement;
              repositionDragHandle(domNode as HTMLElement);
              return;
            }
            domNode = getOuterDomNode(view, domNode);
            if (domNode === view.dom) return;
            if (domNode?.nodeType !== 1) return;
            const domNodePos = view.posAtDOM(domNode, 0);
            const outerNode = getOuterNode(editor.state.doc, domNodePos);
            const outerNodePos = getOuterNodePos(editor.state.doc, domNodePos);
            currentNode = outerNode;
            currentNodePos = outerNodePos;
            onNodeChangeSafe(currentNode, currentNodePos);
            currentDomNode = domNode as HTMLElement;
            repositionDragHandle(domNode as HTMLElement);
          },
          destroy() {
            cleanup();
            if (element) removeNode(wrapper);
          },
        };
      },
      props: {
        handleDOMEvents: {
          keydown(view) {
            if (!element || locked) return false;
            if (view.hasFocus()) {
              hideHandle();
              currentNode = null;
              currentNodePos = -1;
              onNodeChangeSafe(null, -1);
            }
            return false;
          },
          mouseleave(_view, e) {
            if (locked) return false;
            const relatedInside = e.relatedTarget instanceof globalThis.Node && wrapper.contains(e.relatedTarget);
            if (e.target instanceof globalThis.Node && !relatedInside) {
              hideHandle();
              currentNode = null;
              currentNodePos = -1;
              onNodeChangeSafe(null, -1);
            }
            return false;
          },
          mousemove(view, e) {
            if (!element || locked) return false;
            pendingMouseCoords = { x: e.clientX, y: e.clientY };
            if (rafId) return false;
            rafId = requestAnimationFrame(() => {
              rafId = null;
              if (!pendingMouseCoords) return;
              const { x, y } = pendingMouseCoords;
              pendingMouseCoords = null;
              // Handle-proximity guard: keep the current target while the pointer
              // is near the handle, otherwise the approach path crosses the left
              // edge and the handle jumps to the parent (ungrabbable nested blocks)
              if (element && element.style.visibility !== "hidden") {
                const rect = element.getBoundingClientRect();
                if (x >= rect.left - 6 && x <= rect.right + 6 && y >= rect.top - 6 && y <= rect.bottom + 6) {
                  return;
                }
              }
              const nodeData = findElementNextToCoords({ x, y, editor, nestedOptions });
              if (!nodeData.resultElement) return;
              let domNode: HTMLElement = nodeData.resultElement;
              let targetNode = nodeData.resultNode;
              let targetPos = nodeData.pos;
              if (!nestedOptions.enabled) {
                const outerDomNode = getOuterDomNode(view, domNode);
                if (outerDomNode === view.dom) return;
                if (outerDomNode?.nodeType !== 1) return;
                const domNodePos = view.posAtDOM(outerDomNode, 0);
                targetNode = getOuterNode(editor.state.doc, domNodePos);
                targetPos = getOuterNodePos(editor.state.doc, domNodePos);
                domNode = outerDomNode as HTMLElement;
              }
              if (targetNode !== currentNode) {
                currentNode = targetNode;
                currentNodePos = targetPos ?? -1;
                currentDomNode = domNode;
                onNodeChangeSafe(currentNode, currentNodePos);
                repositionDragHandle(domNode);
                showHandle();
              }
            });
            return false;
          },
        },
      },
    }),
  };
};
