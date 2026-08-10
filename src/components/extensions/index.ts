import { Blockquote } from "./Blockquote";
import { Bold } from "./Bold";
import { Italic } from "./Italic";
import { TextAlign } from "./TextAlign";
import { Underline } from "./Underline";

const TextAlignExtension = TextAlign.configure({
  types: ["heading", "paragraph"],
});

export default [Bold, Italic, TextAlignExtension, Underline, Blockquote];
