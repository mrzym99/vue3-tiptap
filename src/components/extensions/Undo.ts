import { Extension } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

import UndoButton from "@/components/ui-editor/toolbar/buttons/UndoButton.vue";
import { withButton } from "@/utils/button";

export interface UndoOptions extends GeneralOptions {}

/**
 * Toolbar entry for undoing the last change. The actual history plugin and
 * commands are provided by the `undoRedo` base extension; this only wires up
 * the button.
 */
export const Undo = /* @__PURE__ */ Extension.create<UndoOptions>({
  // Must match the button key used in `defaultToolbar`
  name: "undo",
  addOptions() {
    return {
      button: withButton(UndoButton),
    };
  },
});
