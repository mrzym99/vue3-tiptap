import type { HorizontalRuleOptions as TiptapHorizontalRuleOptions } from "@tiptap/extension-horizontal-rule";
import type { GeneralOptions } from "@/types";

import { HorizontalRule as TiptapHorizontalRule } from "@tiptap/extension-horizontal-rule";

import HorizontalRuleButton from "@/components/ui-editor/toolbar/buttons/HorizontalRuleButton.vue";

export interface HorizontalRuleOptions
  extends TiptapHorizontalRuleOptions, GeneralOptions {}

export const HorizontalRule =
  /* @__PURE__ */ TiptapHorizontalRule.extend<HorizontalRuleOptions>({
    addOptions() {
      return {
        ...(this.parent?.() as TiptapHorizontalRuleOptions),
        button: ({ editor, t }) => ({
          component: HorizontalRuleButton,
          componentProps: {
            editor,
            t,
          },
        }),
      };
    },
  });
