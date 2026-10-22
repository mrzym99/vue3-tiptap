import type { Schema } from "@tiptap/pm/model";

export type AiMarkdownProps = {
  /** Assistant reply in markdown, rendered through the editor schema */
  text: string;
  /** Schema used to sanitize the parsed markdown before v-html */
  schema: Schema;
};
