import type { MathematicsOptions as TiptapMathOptions } from "@tiptap/extension-mathematics";
import { defaultMathTemplates } from "@/constants";
import type { GeneralOptions } from "@/types";

import { Mathematics as TiptapMath } from "@tiptap/extension-mathematics";

import "katex/dist/katex.min.css";

import MathMenuButton from "@/components/ui-editor/toolbar/menu-buttons/MathMenuButton.vue";
import { withButton } from "@/utils/button";

export interface MathematicsOptions extends TiptapMathOptions, GeneralOptions {
  /** Formula chips in the dialog; a pick fills the input so the host can edit it. */
  templates: string[];
}

/**
 * shortcut: KaTeX is imported statically, so it ships with this extension.
 * Hosts that never import `Mathematics` pay nothing (tree-shaking); a demo
 * that wants it out of the main chunk can dynamic-import this file.
 */
export const Mathematics = /* @__PURE__ */ TiptapMath.extend<MathematicsOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapMathOptions),
      templates: defaultMathTemplates,
      button: withButton(MathMenuButton),
    };
  },
});
