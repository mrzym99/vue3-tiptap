import type { TranslateFn } from "@/types";

export type AiInputProps = {
  /** An answer is streaming — the textarea is disabled and the button turns into a stop button */
  busy: boolean;
  /** Translation fn handed down from the editor shell (via the `Ai` extension) */
  t: TranslateFn;
};
