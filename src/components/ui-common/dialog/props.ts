import type { TranslateFn } from "@/types";

export type DialogProps = {
  /** Translation fn handed down from the editor root; optional for standalone use
   *  (falls back to identity — raw keys are shown) */
  t?: TranslateFn;
  /** Controlled visibility (v-model:show) */
  show?: boolean;
  /** Title shown in the panel header */
  title?: string;
  /** Panel width (any CSS width value) */
  width?: string;
  /** Whether clicking the overlay backdrop closes the dialog (default false) */
  closeOnClickModal?: boolean;
};
