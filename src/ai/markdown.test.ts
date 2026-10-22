import { describe, expect, it } from "vitest";

import { Editor } from "@tiptap/core";
import Bold from "@tiptap/extension-bold";
import Code from "@tiptap/extension-code";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import { renderMarkdown } from "./markdown";

function createEditor() {
  return new Editor({
    content: "<p></p>",
    extensions: [Document, Paragraph, Text, Bold, Code, Heading, Link],
    element: document.createElement("div"),
  });
}

describe("renderMarkdown", () => {
  const schema = createEditor().schema;

  it("renders markdown markup (bold, headings, code, links)", () => {
    const html = renderMarkdown("**bold** and `code`\n\n# Title\n\n[site](https://example.com)", schema);
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<code>code</code>");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain('href="https://example.com"');
  });

  it("drops markup the schema does not support (script, event handlers)", () => {
    const html = renderMarkdown('hello <script>alert(1)</script> and <img src="x" onerror="alert(1)"> world', schema);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("onerror");
    expect(html).toContain("hello");
    expect(html).toContain("world");
  });
});
