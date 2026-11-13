import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import type { Extensions } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import {
  defaultCodeBlockLanguages,
  defaultFontSizes,
  defaultHighlightColors,
  defaultMathTemplates,
  defaultTextColors,
} from "@/constants";
import katex from "katex";
import { extensionOptions } from "@/utils/extensionOptions";
import { StarterKit } from "./index";
import { CodeBlock } from "./CodeBlock";
import { Color } from "./Color";
import { FontSize } from "./FontSize";
import { Heading } from "./Heading";
import { Mathematics } from "./Mathematics";
import type { CodeBlockOptions } from "./CodeBlock";
import type { ColorOptions } from "./Color";
import type { FontSizeOptions } from "./FontSize";
import type { HeadingOptions } from "./Heading";
import type { MathematicsOptions } from "./Mathematics";

const createEditor = (extensions: Extensions) =>
  new Editor({ content: "<p>hello</p>", extensions: [Document, Paragraph, Text, ...extensions], element: document.createElement("div") });

describe("menu presets", () => {
  it("defaults to the shipped palettes and lets a host override them", () => {
    const editor = createEditor([FontSize, Color, CodeBlock, Heading, Mathematics]);
    expect(extensionOptions<FontSizeOptions>(editor, "fontSize")?.fontSizes).toEqual(defaultFontSizes);
    expect(extensionOptions<ColorOptions>(editor, "color")?.textColors).toEqual(defaultTextColors);
    expect(extensionOptions<ColorOptions>(editor, "color")?.highlightColors).toEqual(defaultHighlightColors);
    expect(extensionOptions<CodeBlockOptions>(editor, "codeBlock")?.languages).toEqual(defaultCodeBlockLanguages);
    expect(extensionOptions<HeadingOptions>(editor, "heading")?.levels).toEqual([1, 2, 3, 4, 5, 6]);
    expect(extensionOptions<MathematicsOptions>(editor, "Mathematics")?.templates).toEqual(defaultMathTemplates);
    editor.destroy();

    const custom = createEditor([
      FontSize.configure({ fontSizes: [13, 18] }),
      Color.configure({ textColors: ["#000000", "#ffffff"], highlightColors: ["#ffffff"] }),
      CodeBlock.configure({ languages: ["rust"] }),
      Heading.configure({ levels: [1, 2] }),
      Mathematics.configure({ templates: ["\frac{a}{b}"] }),
    ]);
    expect(extensionOptions<FontSizeOptions>(custom, "fontSize")?.fontSizes).toEqual([13, 18]);
    expect(extensionOptions<ColorOptions>(custom, "color")?.textColors).toEqual(["#000000", "#ffffff"]);
    expect(extensionOptions<ColorOptions>(custom, "color")?.highlightColors).toEqual(["#ffffff"]);
    expect(extensionOptions<CodeBlockOptions>(custom, "codeBlock")?.languages).toEqual(["rust"]);
    expect(extensionOptions<HeadingOptions>(custom, "heading")?.levels).toEqual([1, 2]);
    expect(extensionOptions<MathematicsOptions>(custom, "Mathematics")?.templates).toEqual(["\frac{a}{b}"]);
    custom.destroy();
  });

  it("is configurable through StarterKit.configure", () => {
    const editor = createEditor([
      StarterKit.configure({
        fontSize: { fontSizes: [13, 18] },
        color: { textColors: ["#000000"], highlightColors: ["#111111"] },
        codeBlock: { languages: ["rust"] },
        heading: { levels: [1, 2] },
      }),
    ]);
    expect(extensionOptions<FontSizeOptions>(editor, "fontSize")?.fontSizes).toEqual([13, 18]);
    expect(extensionOptions<ColorOptions>(editor, "color")?.textColors).toEqual(["#000000"]);
    expect(extensionOptions<ColorOptions>(editor, "color")?.highlightColors).toEqual(["#111111"]);
    expect(extensionOptions<CodeBlockOptions>(editor, "codeBlock")?.languages).toEqual(["rust"]);
    expect(extensionOptions<HeadingOptions>(editor, "heading")?.levels).toEqual([1, 2]);
    editor.destroy();
  });

  it("ships only LaTeX that KaTeX can render", () => {
    for (const tex of defaultMathTemplates) {
      expect(katex.renderToString(tex, { throwOnError: true }), tex).toContain("katex");
    }
  });
});