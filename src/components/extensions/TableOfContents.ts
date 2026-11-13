import type { TableOfContentsOptions as TiptapTocOptions } from "@tiptap/extension-table-of-contents";
import type { GeneralOptions } from "@/types";

import { TableOfContents as TiptapToc } from "@tiptap/extension-table-of-contents";


export interface TableOfContentsOptions extends TiptapTocOptions, GeneralOptions {}

// No toolbar button: the outline renders as a hover rail on the editor's right
// edge (src/components/ui-editor/outline), driven purely by this extension.
export const TableOfContents = /* @__PURE__ */ TiptapToc.extend<TableOfContentsOptions>({});
