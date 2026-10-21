import type { Editor } from "@tiptap/core";
import type { TranslateFn } from "@/types";
import type { EditorAgent } from "../../types";

export type AiPanelProps = {
  /** The editor the FAB/drawer is attached to */
  editor: Editor;
  /** Translation fn handed down from the editor shell (via the `Ai` extension mount) */
  t: TranslateFn;
  /** The host-created agent whose event stream the drawer renders */
  agent?: EditorAgent;
};
