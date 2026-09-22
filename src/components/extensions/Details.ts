import type { DetailsOptions as TiptapDetailsOptions } from "@tiptap/extension-details";
import type { GeneralOptions } from "@/types";

import { Details as TiptapDetails } from "@tiptap/extension-details";

import DetailsButton from "@/components/ui-editor/toolbar/buttons/DetailsButton.vue";
import { withButton } from "@/utils/button";

export { DetailsSummary, DetailsContent } from "@tiptap/extension-details";

export interface DetailsOptions extends TiptapDetailsOptions, GeneralOptions {}

// Lucide chevron icons (inline SVG, no Vue runtime needed inside the NodeView)
const CHEVRON_RIGHT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
const CHEVRON_DOWN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

export const Details = /* @__PURE__ */ TiptapDetails.extend<DetailsOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapDetailsOptions),
      open: false,
      persist: false,
      renderToggleButton: ({ element, isOpen }) => {
        // Visible chevron that flips with the open state (Notion toggle style).
        element.setAttribute("aria-label", isOpen ? "Collapse details" : "Expand details");
        element.setAttribute("data-open", isOpen ? "true" : "false");
        element.innerHTML = isOpen ? CHEVRON_DOWN_SVG : CHEVRON_RIGHT_SVG;
      },
      button: withButton(DetailsButton),
    };
  },
});
