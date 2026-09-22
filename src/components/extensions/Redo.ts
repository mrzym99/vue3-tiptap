import { Extension } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

import RedoButton from "@/components/ui-editor/toolbar/buttons/RedoButton.vue";
import { withButton } from "@/utils/button";

export interface RedoOptions extends GeneralOptions {}

/** Redo button; the history plugin/commands come from the `undoRedo` base extension. */
export const Redo = /* @__PURE__ */ Extension.create<RedoOptions>({
  // Must match the button key used in `defaultToolbar`
  name: "redo",
  addOptions() {
    return {
      button: withButton(RedoButton),
    };
  },
});
