import type { Schema } from "@tiptap/pm/model";

import { DOMParser as ProseMirrorDOMParser, DOMSerializer } from "@tiptap/pm/model";
import { marked } from "marked";

/**
 * Render model markdown into HTML the panel can inject via v-html. marked
 * parses the markdown; the result is then re-parsed through the editor's own
 * schema, so anything the document doesn't support (script tags, onerror
 * attributes, unknown elements) is dropped instead of reaching the DOM.
 */
export function renderMarkdown(markdown: string, schema: Schema): string {
  const html = marked.parse(markdown, { async: false }) as string;
  const dom = new DOMParser().parseFromString(html, "text/html").body;
  const doc = ProseMirrorDOMParser.fromSchema(schema).parse(dom);
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
  const wrap = document.createElement("div");
  wrap.appendChild(fragment);
  return wrap.innerHTML;
}
