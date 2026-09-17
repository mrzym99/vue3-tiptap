// Adapted from @tiptap/extension-drag-handle v3.31.3 (MIT)
// Copyright (c) Tiptap GmbH — collaboration (Yjs) support removed.
import type { ComputePositionConfig, VirtualElement } from "@floating-ui/dom";
import type { Node as PMNode } from "@tiptap/pm/model";

import { Extension } from "@tiptap/core";

import { DragHandlePlugin } from "./plugin";
import { normalizeNestedOptions, type NestedDragHandleOptions } from "./rules";

export type { DragHandleRule, NestedDragHandleOptions } from "./rules";
export type { EdgeDetectionConfig, EdgeDetectionPreset, RuleContext } from "./types";

export interface DragHandleOptions {
  /** Renders the handle element, positioned via floating-ui. */
  render(): HTMLElement;
  /** floating-ui position computation config for the handle. */
  computePositionConfig?: ComputePositionConfig;
  /**
   * Returns the virtual element the handle is positioned against. Defaults to
   * the bounding rect of the hovered block.
   */
  getReferencedVirtualElement?: () => VirtualElement | null;
  /** Locks the drag handle in place and visibility. */
  locked?: boolean;
  /** Called when the hovered node changes. */
  onNodeChange?: (options: { node: PMNode | null; editor: import("@tiptap/core").Editor; pos: number }) => void;
  /** Called when the drag starts on the handle. */
  onElementDragStart?: (e: DragEvent) => void;
  /** Called when the drag ends on the handle. */
  onElementDragEnd?: (e: DragEvent) => void;
  /**
   * Enable drag handles for nested content (list items, blockquotes, etc.).
   * `false` (default) targets root-level blocks only; `true` enables with
   * sensible defaults; an object gives full rule/edge-detection control.
   */
  nested?: boolean | NestedDragHandleOptions;
  /**
   * Limit the drag image clone to a subset of CSS properties instead of
   * copying all computed styles (perf win on complex selections).
   */
  dragImageProperties?: string[];
  /** Accessible label / title for the handle. */
  ariaLabel?: string;
}

// Six-dot grip icon, inlined as SVG: the handle element is plain DOM
// (created before any Vue context), so `~icons/` imports are not available.
const GRIP_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="9" cy="6" r="0.5" fill="currentColor"/><circle cx="15" cy="6" r="0.5" fill="currentColor"/><circle cx="9" cy="12" r="0.5" fill="currentColor"/><circle cx="15" cy="12" r="0.5" fill="currentColor"/><circle cx="9" cy="18" r="0.5" fill="currentColor"/><circle cx="15" cy="18" r="0.5" fill="currentColor"/></svg>';

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dragHandle: {
      /** Locks the drag handle in place and visibility */
      lockDragHandle: () => ReturnType;
      /** Unlocks the drag handle */
      unlockDragHandle: () => ReturnType;
      /** Toggle drag handle lock state */
      toggleDragHandle: () => ReturnType;
    };
  }
}

export const DragHandle = Extension.create<DragHandleOptions>({
  name: "dragHandle",

  addOptions() {
    return {
      render() {
        const element = document.createElement("div");
        element.classList.add("drag-handle");
        element.dataset.dragHandle = "";
        element.innerHTML = GRIP_SVG;
        return element;
      },
      computePositionConfig: {},
      locked: false,
      onNodeChange: () => {
        return null;
      },
      onElementDragStart: undefined,
      onElementDragEnd: undefined,
      nested: false,
      dragImageProperties: undefined,
      ariaLabel: undefined,
    };
  },

  addCommands() {
    return {
      lockDragHandle:
        () =>
        ({ editor }) => {
          this.options.locked = true;
          return editor.commands.setMeta("lockDragHandle", this.options.locked);
        },
      unlockDragHandle:
        () =>
        ({ editor }) => {
          this.options.locked = false;
          return editor.commands.setMeta("lockDragHandle", this.options.locked);
        },
      toggleDragHandle:
        () =>
        ({ editor }) => {
          this.options.locked = !this.options.locked;
          return editor.commands.setMeta("lockDragHandle", this.options.locked);
        },
    };
  },

  addProseMirrorPlugins() {
    const element = this.options.render();
    const ariaLabel = this.options.ariaLabel ?? "Drag to move";
    element.setAttribute("aria-label", ariaLabel);
    element.title = ariaLabel;
    const nestedOptions = normalizeNestedOptions(this.options.nested);
    return [
      DragHandlePlugin({
        computePositionConfig: {
          placement: "left-start",
          strategy: "absolute",
          ...this.options.computePositionConfig,
        },
        getReferencedVirtualElement: this.options.getReferencedVirtualElement,
        element,
        editor: this.editor,
        onNodeChange: this.options.onNodeChange,
        onElementDragStart: this.options.onElementDragStart,
        onElementDragEnd: this.options.onElementDragEnd,
        nestedOptions,
        dragImageProperties: this.options.dragImageProperties,
      }).plugin,
    ];
  },
});
