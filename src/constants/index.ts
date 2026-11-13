import type { ResizableNodeViewDirection } from "@tiptap/core";

/** Default toolbar layout, TinyMCE-style; keys are Tiptap extension names. */
export const defaultToolbar =
  "undo redo |" +
  "heading bulletList codeBlock | " +
  "bold italic strike code underline link | " +
  "superscript subscript | " +
  "textAlign firstLineIndent lineHeight | " +
  "image | " +
  "horizontalRule blockquote details video audio | " +
  "color fontFamily fontSize | " +
  "table emoji Mathematics | findAndReplace | clearFormatting";

/** Preset line heights offered by the toolbar menu — override with `LineHeight.configure({ lineHeights })`. */
export const defaultLineHeights = ["1.15", "1.5", "1.75", "2"];

/** Font sizes offered by the font-size menu, in px. */
export const defaultFontSizes = [12, 14, 16, 20, 24, 32];

// The first entry of each palette is "Default": it clears the mark instead of
// storing a near-invisible color (this is also the only clear affordance).
/** Notion-style text colors; first entry clears the color mark. */
export const defaultTextColors = [
  "#37352F",
  "#9B9A97",
  "#AD6030",
  "#D9730D",
  "#DFAB01",
  "#0F7B6C",
  "#0B6E99",
  "#6940A5",
  "#AD1A72",
  "#E03E3E",
];
/** Notion-style highlight colors; first entry clears the highlight mark. */
export const defaultHighlightColors = [
  "#FFFFFF",
  "#EBEDED",
  "#F5EDEA",
  "#FBECDC",
  "#FBF3DB",
  "#DDEDEA",
  "#DBECF8",
  "#EEE0F4",
  "#F8E4F1",
  "#FADEDE",
];

/** Code-block language suggestions (free typing is always allowed). */
export const defaultCodeBlockLanguages = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "diff",
  "go",
  "graphql",
  "html",
  "java",
  "javascript",
  "json",
  "kotlin",
  "lua",
  "markdown",
  "php",
  "python",
  "ruby",
  "rust",
  "shell",
  "sql",
  "swift",
  "typescript",
  "xml",
  "yaml",
];

/** Formula templates offered by the math dialog - picking one fills the input for editing. */
export const defaultMathTemplates = [
  String.raw`\frac{a}{b}`,
  String.raw`\sqrt{x}`,
  String.raw`x^{2}`,
  String.raw`x_{i}`,
  String.raw`\sum_{i=1}^{n} a_i`,
  String.raw`\int_{a}^{b} f(x)\,dx`,
  String.raw`\lim_{x \to \infty} f(x)`,
  String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`,
  String.raw`\alpha + \beta = \gamma`,
  String.raw`E = mc^2`,
];

/** Resize handles for images/videos: four corners plus four edges. */
export const resizableDirections: ResizableNodeViewDirection[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "left",
  "right",
  "top",
  "bottom",
];
