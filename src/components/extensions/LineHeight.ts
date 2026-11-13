import { Extension, isNodeSelection } from "@tiptap/core";

import LineHeightMenuButton from "@/components/ui-editor/toolbar/menu-buttons/LineHeightMenuButton.vue";
import { defaultLineHeights } from "@/constants";
import { withButton } from "@/utils/button";
import type { Command } from "@tiptap/core";
import type { GeneralOptions } from "@/types";

export interface LineHeightOptions extends GeneralOptions {
  /** Nodes the line height can be applied to. */
  types: string[];
  /** Preset values offered by the toolbar menu. */
  lineHeights: string[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    // set/unsetLineHeight are declared by @tiptap/extension-text-style; only the
    // toggle shortcut is ours (a separate group, or the declarations collide)
    lineHeightToggle: {
      /** Toggle the given line height: set it when absent, remove it when active. */
      toggleLineHeight: (lineHeight: string) => ReturnType;
    };
  }
}

/**
 * Block-level line height (CSS `line-height` on the block). A `textStyle` mark
 * cannot win here: the block's own line-height acts as the line box strut, so
 * a smaller value on an inner span has no visible effect.
 */
export const LineHeight = /* @__PURE__ */ Extension.create<LineHeightOptions>({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      lineHeights: defaultLineHeights,
      button: withButton(LineHeightMenuButton),
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              const lineHeight = attributes.lineHeight as string | null;
              if (!lineHeight) return {};
              return { style: `line-height: ${lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    const setHeight = (lineHeight: string | null): Command =>
      // a selection spanning blocks applies the attribute to each; node selections (e.g. an image) are rejected
      ({ editor, commands }) => {
        if (isNodeSelection(editor.state.selection)) return false;
        return lineHeight
          ? this.options.types.map((type) => commands.updateAttributes(type, { lineHeight })).some(Boolean)
          : this.options.types.map((type) => commands.resetAttributes(type, "lineHeight")).some(Boolean);
      };

    return {
      setLineHeight: (lineHeight: string) => setHeight(lineHeight),
      unsetLineHeight: () => setHeight(null),
      toggleLineHeight:
        (lineHeight): Command =>
        ({ editor, commands }) =>
          editor.isActive({ lineHeight }) ? commands.unsetLineHeight() : commands.setLineHeight(lineHeight),
    };
  },
});