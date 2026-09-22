import { Extension } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

import UndoButton from "@/components/ui-editor/toolbar/buttons/UndoButton.vue";
import { withButton } from "@/utils/button";

export interface UndoOptions extends GeneralOptions {}

/** Undo button; the history plugin/commands come from the `undoRedo` base extension. */
export const Undo = /* @__PURE__ */ Extension.create<UndoOptions>({
  // Must match the button key used in `defaultToolbar`
  name: "undo",
  addOptions() {
    return {
      button: withButton(UndoButton),
    };
  },
});
