import type { TranslateFn } from "@/types";
import type { PanelItem } from "../ai-panel/use-ai-panel";

export type AiMessageProps = {
  /** Chat items rendered by the panel's `useAiPanel` composable */
  messages: PanelItem[];
  /** An answer is streaming — shows the thinking row and keeps the view pinned */
  busy: boolean;
  /** Translation fn handed down from the editor shell (via the `Ai` extension) */
  t: TranslateFn;
};
