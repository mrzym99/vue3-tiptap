import { Extension } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

import RedoButton from "@/components/ui-editor/toolbar/buttons/RedoButton.vue";

export interface RedoOptions extends GeneralOptions {}

/**
 * Toolbar entry for reapplying a reverted change. The actual history plugin
 * and commands are provided by the `undoRedo` base extension; this only wires
 * up the button.
 */
export const Redo = /* @__PURE__ */ Extension.create<RedoOptions>({
  // Must match the button key used in `defaultToolbar`
  name: "redo",
  addOptions() {
    return {
      button: ({ editor, t }) => ({
        component: RedoButton,
        componentProps: {
          editor,
          t,
        },
      }),
    };
  },
});
