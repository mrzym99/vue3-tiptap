import type { EditorState } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";

/**
 * True when the caret/selection sits entirely within one `<a>` element —
 * the link bubble owns that interaction. A selection spanning a link plus
 * surrounding text does not count (the formatting bubble stays available).
 *
 * Uses the same `closest("a")` resolution the link bubble anchors with, so
 * the two bubbles never show for the same selection.
 */
export function isSelectionInsideLink(view: EditorView, state: EditorState): boolean {
  const anchorAt = (pos: number) => {
    const resolved = view.domAtPos(pos);
    const el = resolved.node instanceof Element ? resolved.node : resolved.node.parentElement;
    return el?.closest("a") ?? null;
  };
  const startAnchor = anchorAt(state.selection.from);
  return !!startAnchor && startAnchor === anchorAt(state.selection.to);
}
