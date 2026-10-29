import { CharacterCount, Dropcursor, Gapcursor, TrailingNode } from "@tiptap/extensions";
import { ListItem, TaskItem, ListKeymap } from "@tiptap/extension-list";
import { Markdown } from "@tiptap/markdown";
import { Audio } from "./Audio";
import { Blockquote } from "./Blockquote";
import { Bold } from "./Bold";
import { BulletList } from "./BulletList";
import { Code } from "./Code";
import { CodeBlock } from "./CodeBlock";
import { ClearFormatting } from "./ClearFormatting";
import { Color } from "./Color";
import { Details, DetailsSummary, DetailsContent } from "./Details";
import { DragHandle } from "./DragHandle";
import { FileHandler } from "./FileHandler";
import { FindAndReplace } from "./FindAndReplace";
import { FontFamily } from "./FontFamily";
import { FontSize } from "./FontSize";
import { HardBreak } from "./HardBreak";
import { Heading } from "./Heading";
import { Highlight } from "./Highlight";
import { HorizontalRule } from "./HorizontalRule";
import { Image } from "./Image";
import { InvisibleCharacters } from "./InvisibleCharacters";
import { Italic } from "./Italic";
import { Link } from "./Link";
import { Mention } from "./Mention";
import { NodeRange } from "./NodeRange";
import { OrderedList } from "./OrderedList";
import { Redo } from "./Redo";
import { Strike } from "./Strike";
import { Subscript } from "./Subscript";
import { Superscript } from "./Superscript";
import { Table, TableRow, TableHeader, TableCell } from "./Table";
import { TaskList } from "./TaskList";
import { TextAlign } from "./TextAlign";
import { TextStyle } from "./TextStyle";
import { Typography } from "./Typography";
import { Underline } from "./Underline";
import { Undo } from "./Undo";
import { UndoRedo } from "./UndoRedo";
import { Video } from "./Video";

import { Extension, type Extensions } from "@tiptap/core";

// Re-export every built-in extension (with its options type) for hand-picking
// via the `extensions` prop
export * from "./Ai"; // opt-in only — deliberately NOT in builtinExtensions/StarterKit
export * from "./Audio";
export * from "./Blockquote";
export * from "./Bold";
export * from "./BulletList";
export * from "./Code";
export * from "./CodeBlock";
export * from "./ClearFormatting";
export * from "./Color";
export * from "./Details";
export * from "./DragHandle";
export * from "./FileHandler";
export * from "./FindAndReplace";
export * from "./FontFamily";
export * from "./FontSize";
export * from "./HardBreak";
export * from "./Heading";
export * from "./Highlight";
export * from "./HorizontalRule";
export * from "./Image";
export * from "./InvisibleCharacters";
export * from "./Italic";
export * from "./Link";
export { Markdown } from "@tiptap/markdown";
export * from "./Mention";
export * from "./NodeRange";
export * from "./OrderedList";
export * from "./Redo";
export * from "./Strike";
export * from "./Subscript";
export * from "./Superscript";
export * from "./Table";
export * from "./TaskList";
export * from "./TextAlign";
export * from "./TextStyle";
export * from "./Typography";
export * from "./Underline";
export * from "./Undo";
export * from "./UndoRedo";
export * from "./Video";

const HeadingExtension = Heading.configure({ levels: [1, 2, 3, 4, 5, 6] });

const TextAlignExtension = TextAlign.configure({
  types: ["heading", "paragraph"],
});

/**
 * Keyed by each extension's own name.
 */
export const builtinExtensionMap = {
  // Editing experience (UndoRedo provides the history plugin; undo / redo provide buttons)
  undoRedo: UndoRedo,
  undo: Undo,
  redo: Redo,
  clearFormatting: ClearFormatting,
  // Text styles
  bold: Bold,
  italic: Italic,
  strike: Strike,
  underline: Underline,
  code: Code,
  highlight: Highlight,
  subscript: Subscript,
  superscript: Superscript,
  heading: HeadingExtension,
  horizontalRule: HorizontalRule,
  blockquote: Blockquote,
  textAlign: TextAlignExtension,
  // Lists
  listItem: ListItem,
  bulletList: BulletList,
  orderedList: OrderedList,
  taskItem: TaskItem,
  taskList: TaskList,
  listKeymap: ListKeymap,
  // Link / code block / collapsible blocks
  link: Link,
  codeBlock: CodeBlock,
  detailsSummary: DetailsSummary,
  detailsContent: DetailsContent,
  details: Details,
  // Media
  image: Image,
  video: Video,
  audio: Audio,
  fileHandler: FileHandler,
  // Styles (text-style base)
  textStyle: TextStyle,
  color: Color,
  fontFamily: FontFamily,
  fontSize: FontSize,
  typography: Typography,
  // Tables
  table: Table,
  tableRow: TableRow,
  tableHeader: TableHeader,
  tableCell: TableCell,
  // Editing experience
  findAndReplace: FindAndReplace,
  invisibleCharacters: InvisibleCharacters,
  nodeRange: NodeRange,
  dragHandle: DragHandle,
  hardBreak: HardBreak,
  // Mention @ (typing @ triggers it; data source injected by the host via items)
  mention: Mention,
  // Behavior-only (no buttons)
  markdown: Markdown,
  gapCursor: Gapcursor,
  dropCursor: Dropcursor,
  trailingNode: TrailingNode,
  characterCount: CharacterCount,
};

const builtinExtensions: Extensions = Object.values(builtinExtensionMap) as Extensions;

/** Literal keys derived from `builtinExtensionMap` — editors autocomplete and typo-check `StarterKit.configure({...})`. */
type StarterKitName = keyof typeof builtinExtensionMap;

/** Per-extension entry: `false` disables it, an object configures it with that extension's own option type. */
type StarterKitOption<N extends StarterKitName> = (typeof builtinExtensionMap)[N] extends { options: infer O }
  ? Partial<O>
  : Record<string, unknown>;

type StarterKitOptions = { [N in StarterKitName]?: StarterKitOption<N> | false };

/** All built-in extensions; `false` disables, an object configures. */
export const StarterKit = Extension.create<StarterKitOptions>({
  name: "starterKit",
  addExtensions() {
    // extension.name is typed `string`, so the lookup needs the widened signature
    const options = this.options as Record<string, Record<string, unknown> | false | undefined>;
    return builtinExtensions
      .map((extension) => {
        const option = options[extension.name];
        if (option === false) return null;
        return option ? extension.configure(option) : extension;
      })
      .filter((extension): extension is NonNullable<typeof extension> => extension !== null);
  },
});
