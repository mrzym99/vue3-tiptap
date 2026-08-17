import { Blockquote } from "./Blockquote";
import { Bold } from "./Bold";
import { Italic } from "./Italic";
import { TextAlign } from "./TextAlign";
import { Underline } from "./Underline";

// NOTE: `heading` is intentionally not configured — the Heading extension is
// not registered in the editor yet. Re-add it once Heading is supported.
const TextAlignExtension = TextAlign.configure({
  types: ["paragraph"],
});

export default [Bold, Italic, TextAlignExtension, Underline, Blockquote];
