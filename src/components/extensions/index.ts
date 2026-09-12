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
import { FileHandler } from "./FileHandler";
import { FindAndReplace } from "./FindAndReplace";
// import { Focus } from "./Focus";
import { FontFamily } from "./FontFamily";
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
  // 编辑体验：撤销 / 重做 / 清除格式（undoRedo 提供历史插件，undo-redo 提供按钮）
  UndoRedo,
  Undo,
  Redo,
  ClearFormatting,
  // 基础文本样式
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
  // 列表（依赖：listItem / taskItem / listKeymap）
  ListItem,
  BulletList,
  OrderedList,
  TaskItem,
  TaskList,
  ListKeymap,
  // 链接 / 代码块 / 折叠块
  Link,
  CodeBlock,
  DetailsSummary,
  DetailsContent,
  Details,
  // 媒体
  Image,
  Video,
  Youtube,
  Audio,
  Twitch,
  FileHandler,
  // 样式（text-style 基座 + color / font-family / typography）
  TextStyle,
  Color,
  FontFamily,
  Typography,
  // 表格
  Table,
  TableRow,
  TableHeader,
  TableCell,
  // 编辑体验
  FindAndReplace,
  InvisibleCharacters,
  UniqueId,
  NodeRange,
  HardBreak,
  // 提及 @（无按钮，输入 @ 触发建议弹层；数据源由宿主通过 items 注入）
  Mention,
  // 行为类（无按钮）：聚焦高亮、块间空隙 / 拖拽落点 / 末尾段落
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
 * Placeholder are excluded — the editor component always provides them).
 *
 * The component does NOT include built-ins automatically: pass the kit via the
 * `extensions` prop, or hand-pick individual extensions instead.
 *
 *   StarterKit.configure({ twitch: false, image: { upload: myUpload } })
 *   // or
 *   [Bold, Italic, Mention.configure({ items })]
 *
 * `addExtensions()` lets the kit expand into the configured child extensions
 * while staying a single `AnyExtension` (same trick as tiptap's StarterKit).
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
