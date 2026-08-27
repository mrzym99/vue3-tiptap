import type { FormRule } from "@/components/ui-common/form/types";

export type FormItemProps = {
  /** Field name — must match a key of the form's `model`. */
  name: string;
  label?: string;
  rules?: FormRule[];
  /** Validate on every input (default: only on submit / blur). */
  validateOnInput?: boolean;
};
