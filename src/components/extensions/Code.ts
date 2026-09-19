import type { CodeOptions as TiptapCodeOptions } from "@tiptap/extension-code";
import type { GeneralOptions } from "@/types";

import { Code as TiptapCode } from "@tiptap/extension-code";

import CodeButton from "@/components/ui-editor/toolbar/buttons/CodeButton.vue";
import { withButton } from "@/utils/button";

export interface CodeOptions extends TiptapCodeOptions, GeneralOptions {}

export const Code = /* @__PURE__ */ TiptapCode.extend<CodeOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapCodeOptions),
      button: withButton(CodeButton),
    };
  },
});
