import type { InjectionKey } from "vue";

/**
 * Validation rule for a form field.
 */
export interface FormRule {
  /** True when the value is acceptable. */
  validator: (value: unknown) => boolean;
  /** Error message shown when the validator fails. */
  message: string;
}

export interface FormErrors {
  [field: string]: string | undefined;
}

/**
 * Context exposed to {@link FormItem} fields via provide/inject.
 */
export interface FormContext {
  registerField: (name: string, rules: FormRule[]) => void;
  unregisterField: (name: string) => void;
  getValue: (name: string) => unknown;
  getError: (name: string) => string | undefined;
  validateField: (name: string) => string | undefined;
}

export const formContextKey: InjectionKey<FormContext> =
  Symbol("tiptap-form");
