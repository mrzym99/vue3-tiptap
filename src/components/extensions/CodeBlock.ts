import type { CodeBlockOptions as TiptapCodeBlockOptions } from "@tiptap/extension-code-block";
import type { GeneralOptions } from "@/types";

import { CodeBlock as TiptapCodeBlock } from "@tiptap/extension-code-block";

import CodeBlockButton from "@/components/ui-editor/toolbar/buttons/CodeBlockButton.vue";
import { withButton } from "@/utils/button";

export interface CodeBlockOptions
  extends TiptapCodeBlockOptions, GeneralOptions {}

export const CodeBlock =
  /* @__PURE__ */ TiptapCodeBlock.extend<CodeBlockOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapCodeBlockOptions),
        button: withButton(CodeBlockButton),
      };
    },
  });
