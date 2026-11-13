import { Extension, isNodeSelection } from "@tiptap/core";

import IndentButton from "@/components/ui-editor/toolbar/buttons/IndentButton.vue";
import { withButton } from "@/utils/button";
import type { Command } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

export interface FirstLineIndentOptions extends GeneralOptions {
  /** Nodes the indent can be applied to. */
  types: string[];
  /** CSS length of the indent, e.g. `2em`. */
  indent: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    firstLineIndent: {
      /** Indent the first line of the current block by the configured amount. */
      setFirstLineIndent: () => ReturnType;
      /** Remove the first-line indent of the current block. */
      unsetFirstLineIndent: () => ReturnType;
      /** Toggle the first-line indent of the current block. */
      toggleFirstLineIndent: () => ReturnType;
    };
  }
}

/** First-line indent (text-indent) as a block attribute — common in CJK typography. */
export const FirstLineIndent = /* @__PURE__ */ Extension.create<FirstLineIndentOptions>({
  name: "firstLineIndent",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      indent: "2em",
      button: withButton(IndentButton),
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textIndent: {
            default: null,
            parseHTML: (element) => element.style.textIndent || null,
            renderHTML: (attributes) => {
              const indent = attributes.textIndent as string | null;
              if (!indent) return {};
              return { style: `text-indent: ${indent}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const setIndent = (indent: string | null): Command =>
      // a selection spanning blocks applies the attribute to each; node selections (e.g. an image) are rejected
      ({ editor, commands }) => {
        if (isNodeSelection(editor.state.selection)) return false;
        return indent
          ? this.options.types.map((type) => commands.updateAttributes(type, { textIndent: indent })).some(Boolean)
          : this.options.types.map((type) => commands.resetAttributes(type, "textIndent")).some(Boolean);
      };

    return {
      setFirstLineIndent: () => setIndent(this.options.indent),
      unsetFirstLineIndent: () => setIndent(null),
      toggleFirstLineIndent: (): Command =>
        ({ editor, commands }) => {
          if (editor.isActive({ textIndent: this.options.indent })) {
            return commands.unsetFirstLineIndent();
          }
          return commands.setFirstLineIndent();
        },
    };
  },
});
