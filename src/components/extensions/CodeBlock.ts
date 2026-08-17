import type { CodeBlockOptions as TiptapCodeBlockOptions } from "@tiptap/extension-code-block";
import type { GeneralOptions } from "@/types";

import { CodeBlock as TiptapCodeBlock } from "@tiptap/extension-code-block";

import CodeBlockButton from "@/components/ui-editor/buttons/CodeBlockButton.vue";

export interface CodeBlockOptions
  extends TiptapCodeBlockOptions, GeneralOptions {}

export const CodeBlock =
  /* @__PURE__ */ TiptapCodeBlock.extend<CodeBlockOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapCodeBlockOptions),
        button: ({ editor, t }) => ({
          component: CodeBlockButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
