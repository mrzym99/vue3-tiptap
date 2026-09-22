import { CharacterCount, Dropcursor, Gapcursor, TrailingNode } from "@tiptap/extensions";
import { ListItem, TaskItem, ListKeymap } from "@tiptap/extension-list";
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
// import { Focus } from "./Focus";
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
import { Twitch } from "./Twitch";
import { Typography } from "./Typography";
import { Underline } from "./Underline";
import { Undo } from "./Undo";
import { UndoRedo } from "./UndoRedo";
import { UniqueId } from "./UniqueId";
import { Video } from "./Video";
import { Youtube } from "./Youtube";

import { Extension, type Extensions } from "@tiptap/core";

const HeadingExtension = Heading.configure({ levels: [1, 2, 3] });

const TextAlignExtension = TextAlign.configure({
  types: ["heading", "paragraph"],
});

const builtinExtensions: Extensions = [
  // Editing experience (UndoRedo provides the history plugin; undo / redo provide buttons)
  UndoRedo,
  Undo,
  Redo,
  ClearFormatting,
  // Text styles
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Highlight,
  Subscript,
  Superscript,
  HeadingExtension,
  HorizontalRule,
  Blockquote,
  TextAlignExtension,
  // Lists
  ListItem,
  BulletList,
  OrderedList,
  TaskItem,
  TaskList,
  ListKeymap,
  // Link / code block / collapsible blocks
  Link,
  CodeBlock,
  DetailsSummary,
  DetailsContent,
  Details,
  // Media
  Image,
  Video,
  Youtube,
  Audio,
  Twitch,
  FileHandler,
  // Styles (text-style base)
  TextStyle,
  Color,
  FontFamily,
  FontSize,
  Typography,
  // Tables
  Table,
  TableRow,
  TableHeader,
  TableCell,
  // Editing experience
  FindAndReplace,
  InvisibleCharacters,
  UniqueId,
  NodeRange,
  DragHandle,
  HardBreak,
  // Mention @ (typing @ triggers it; data source injected by the host via items)
  Mention,
  // Behavior-only (no buttons)
  // Focus,
  Gapcursor,
  Dropcursor,
  TrailingNode,
  CharacterCount,
];

export default builtinExtensions;

/** Per-extension entry: `false` disables it, an object configures it. */
export type StarterKitOption = Record<string, unknown> | false;
export type StarterKitOptions = Record<string, StarterKitOption | undefined>;

/**
 * Tiptap-style bundle of all built-in extensions (Document / Paragraph / Text /
 * Placeholder are excluded — the editor component always provides them). Pass
 * it via the `extensions` prop, or hand-pick individual named exports for a
 * smaller bundle. `false` disables an entry, an object configures it.
 */
export const StarterKit = Extension.create<StarterKitOptions>({
  name: "starterKit",
  addExtensions() {
    return builtinExtensions
      .map((extension) => {
        const option = this.options[extension.name];
        if (option === false) return null;
        return option ? extension.configure(option) : extension;
      })
      .filter((extension): extension is NonNullable<typeof extension> => extension !== null);
  },
});
