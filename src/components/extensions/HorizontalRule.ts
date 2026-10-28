import type { HorizontalRuleOptions as TiptapHorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import type { GeneralOptions } from "@/types";
import type { Node as PMNode } from "@tiptap/pm/model";
import type { EditorState } from "@tiptap/pm/state";

import { NodeSelection, Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";

import { HorizontalRule as TiptapHorizontalRule } from "@tiptap/extension-horizontal-rule";

import HorizontalRuleButton from "@/components/ui-editor/toolbar/buttons/HorizontalRuleButton.vue";
import { withButton } from "@/utils/button";

export interface HorizontalRuleOptions extends TiptapHorizontalRuleOptions, GeneralOptions {}

/**
 * Detect the artifact upstream `setHorizontalRule` leaves behind: the caret in
 * an empty top-level textblock whose very next sibling is an `hr`. The
 * selection can sit *inside* the empty block or at the doc-level boundary
 * before it (the "(doc)" `checkTextSelection` warning case), so both are
 * accepted. Returns the gap node + its position, or `null`.
 */
const findGapAboveHr = (state: EditorState, hrType: PMNode["type"]) => {
  const { selection } = state;
  if (!selection.empty) return null;
  const $pos = selection.$from;
  let parent: PMNode | null;
  let parentStart: number;
  if ($pos.depth === 1) {
    parent = $pos.parent;
    parentStart = $pos.before(1);
  } else if ($pos.depth === 0) {
    parent = state.doc.nodeAt($pos.pos);
    parentStart = $pos.pos;
  } else {
    return null;
  }
  if (!parent || !parent.isTextblock || parent.content.size > 0) return null;
  const after = state.doc.nodeAt(parentStart + parent.nodeSize);
  if (!after || after.type !== hrType) return null;
  return { parent, parentStart, hrStart: parentStart + parent.nodeSize };
};

export const HorizontalRule = /* @__PURE__ */ TiptapHorizontalRule.extend<HorizontalRuleOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapHorizontalRuleOptions),
      button: withButton(HorizontalRuleButton),
    };
  },

  // addProseMirrorPlugins() {
  //   const hrType = this.type;
  //   const nextTypeName = this.options.nextNodeType;
  //   return [
  //     ...(this.parent?.() ?? []),
  //     new Plugin({
  //       key: new PluginKey("vue3TiptapHorizontalRuleCaret"),
  //       // Upstream `setHorizontalRule` anchors its follow-up paragraph at
  //       // `$to.end()` — the end of the block the caret sits in. When the caret
  //       // is at the end of the doc's last textblock, the inserted hr has no
  //       // textblock after it, the selection resolves *back* into that previous
  //       // paragraph, and the new paragraph + caret land ABOVE the line (doc
  //       // becomes `[p(text), p(empty, caret), hr]`). This repairer removes that
  //       // artifact paragraph and moves the caret below the hr run — so typing
  //       // continues under the line, matching the intended behavior.
  //       appendTransaction(trs, oldState, state) {
  //         if (!trs.some((tr) => tr.docChanged)) return null;

  //         const gap = findGapAboveHr(state, hrType);
  //         if (!gap) return null;

  //         // Only clean up when this very transaction batch created the shape —
  //         // if the caret already sat in an empty paragraph above an hr before
  //         // this batch, it's a gap the user made themselves; leave it alone.
  //         if (findGapAboveHr(oldState, hrType)) return null;

  //         const tr = state.tr.delete(gap.parentStart, gap.hrStart);
  //         let pos = gap.parentStart;
  //         let node = tr.doc.nodeAt(pos);
  //         while (node?.type === hrType) {
  //           pos += node.nodeSize;
  //           node = tr.doc.nodeAt(pos);
  //         }
  //         if (!node) {
  //           // hr run ends the doc: give the caret a fresh paragraph below it
  //           const nextType = state.schema.nodes[nextTypeName] ?? gap.parent.type;
  //           tr.insert(pos, nextType.create());
  //           tr.setSelection(TextSelection.create(tr.doc, pos + 1));
  //         } else if (node.isTextblock) {
  //           tr.setSelection(TextSelection.create(tr.doc, pos + 1));
  //         } else if (node.isBlock) {
  //           tr.setSelection(NodeSelection.create(tr.doc, pos));
  //         }
  //         tr.scrollIntoView();
  //         return tr;
  //       },
  //     }),
  //   ];
  // },
});
