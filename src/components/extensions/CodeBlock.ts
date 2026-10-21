import type { CodeBlockOptions as TiptapCodeBlockOptions } from "@tiptap/extension-code-block";
import type { GeneralOptions } from "@/types";

import { CodeBlock as TiptapCodeBlock } from "@tiptap/extension-code-block";

import CodeBlockButton from "@/components/ui-editor/toolbar/buttons/CodeBlockButton.vue";
import { withButton } from "@/utils/button";

export interface CodeBlockOptions extends TiptapCodeBlockOptions, GeneralOptions {}

export const CodeBlock = /* @__PURE__ */ TiptapCodeBlock.extend<CodeBlockOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapCodeBlockOptions),
      button: withButton(CodeBlockButton),
    };
  },

  // also render the language as `data-language` on the <pre> so CSS can display
  // it via a ::before + attr() pseudo-element
  addAttributes() {
    return {
      language: {
        ...this.parent?.(),
        rendered: true,
        renderHTML: (attributes) => (attributes.language ? { "data-language": attributes.language } : {}),
      },
    };
  },
});
