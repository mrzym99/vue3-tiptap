import type { HorizontalRuleOptions as TiptapHorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import type { GeneralOptions } from "@/types";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

import { HorizontalRule as TiptapHorizontalRule } from "@tiptap/extension-horizontal-rule";

import HorizontalRuleButton from "@/components/ui-editor/toolbar/buttons/HorizontalRuleButton.vue";
import { withButton } from "@/utils/button";

export interface HorizontalRuleOptions extends TiptapHorizontalRuleOptions, GeneralOptions {}

export const HorizontalRule = /* @__PURE__ */ TiptapHorizontalRule.extend<HorizontalRuleOptions>({
  // run our Backspace handler before the core keymap, whose joinBackward moves
  // the following paragraph into the blockquote instead of selecting the hr,
  // causing a delete/restore ping-pong loop
  priority: 1000,
  addOptions() {
    return {
      ...(this.parent?.() as TiptapHorizontalRuleOptions),
      button: withButton(HorizontalRuleButton),
    };
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { editor } = this;
        // keep the default "backspace reverts the --- input rule" behavior
        if (editor.commands.undoInputRule()) return true;

        const { state } = editor;
        const { empty, $head } = state.selection;
        if (!empty || !$head.parent.isTextblock || $head.parentOffset > 0) return false;

        // block boundary before the caret
        let cutPos: number | null = null;
        for (let i = $head.depth - 1; i >= 0; i--) {
          if ($head.index(i) > 0) {
            cutPos = $head.before(i + 1);
            break;
          }
        }
        if (cutPos === null) return false;

        // walk down the last children of preceding block nodes to find the hr
        let end = cutPos;
        let node: ProseMirrorNode | null = state.doc.resolve(cutPos).nodeBefore;
        let hrPos = -1;
        while (node) {
          if (node.type === state.schema.nodes.horizontalRule) {
            hrPos = end - node.nodeSize;
            break;
          }
          if (!node.isBlock || !node.childCount) break;
          end -= 1; // step over the container's closing token
          node = node.lastChild;
        }
        if (hrPos < 0) return false;

        return editor.commands.setNodeSelection(hrPos);
      },
    };
  },
});
