import { ListItem, TaskItem, ListKeymap } from "@tiptap/extension-list";
import { Audio } from "./Audio";
import { Blockquote } from "./Blockquote";
import { Bold } from "./Bold";
import { BulletList } from "./BulletList";
import { Code } from "./Code";
import { CodeBlock } from "./CodeBlock";
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
import { NodeRange } from "./NodeRange";
import { OrderedList } from "./OrderedList";
import { Strike } from "./Strike";
import { Subscript } from "./Subscript";
import { Superscript } from "./Superscript";
import { Table } from "./Table";
import { TaskList } from "./TaskList";
import { TextAlign } from "./TextAlign";
import { TextStyle } from "./TextStyle";
import { Twitch } from "./Twitch";
import { Typography } from "./Typography";
import { Underline } from "./Underline";
import { UniqueId } from "./UniqueId";
import { Video } from "./Video";
import { Youtube } from "./Youtube";

const HeadingExtension = Heading.configure({ levels: [1, 2, 3] });

const TextAlignExtension = TextAlign.configure({
  types: ["heading", "paragraph"],
});

export default [
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
  // 编辑体验
  FindAndReplace,
  InvisibleCharacters,
  // Focus,
  UniqueId,
  NodeRange,
  HardBreak,
];
