<template>
  <form ref="formEl" class="form" novalidate @submit.prevent="handleSubmit">
    <slot />
    <div class="form-actions">
      <slot name="actions" />
    </div>
  </form>
</template>

<script lang="ts">
import {
  formContextKey as _formContextKey,
  type FormContext as _FormContext,
  type FormErrors as _FormErrors,
  type FormRule as _FormRule,
} from "./types";

export type { _FormRule as FormRule, _FormErrors as FormErrors, _FormContext as FormContext };
export { _formContextKey as formContextKey };
</script>

<script setup lang="ts">
import { provide, reactive, useTemplateRef } from "vue";
import { formContextKey, type FormContext, type FormErrors, type FormRule } from "./types";

const props = withDefaults(
  defineProps<{
    /** Field value getters `{ [field]: () => value }`, read by validation on submit */
    model?: Record<string, () => unknown>;
  }>(),
  { model: () => ({}) },
);

const emit = defineEmits<{
  /** Fired after validation passes (and only then). */
  submit: [values: Record<string, unknown>];
  /** Fired on every validation run; exposes the current error map. */
  errorsChange: [errors: FormErrors];
}>();

const formEl = useTemplateRef<HTMLFormElement>("formEl");

const rulesMap = new Map<string, FormRule[]>();
const errors = reactive<FormErrors>({});

function validateField(name: string): string | undefined {
  const rules = rulesMap.get(name) ?? [];
  const value = props.model[name]?.();
  const failed = rules.find((rule) => !rule.validator(value));
  errors[name] = failed?.message;
  return errors[name];
}

function validateAll(): boolean {
  const names = [...rulesMap.keys()];
  let valid = true;
  for (const name of names) {
    if (validateField(name)) valid = false;
  }
  emit("errorsChange", { ...errors });
  return valid;
}

function handleSubmit() {
  if (!validateAll()) return;
  const values: Record<string, unknown> = {};
  for (const name of rulesMap.keys()) {
    values[name] = props.model[name]?.();
  }
  emit("submit", values);
}

const context: FormContext = {
  registerField: (name, rules) => {
    rulesMap.set(name, rules);
    // No initial validation: errors only appear after the user interacts
    // (input/blur) or on submit, so the form opens clean.
  },
  unregisterField: (name) => {
    rulesMap.delete(name);
  },
  getValue: (name) => props.model[name]?.(),
  getError: (name) => errors[name],
  validateField,
};

provide(formContextKey, context);

defineExpose({ validateField, validateAll, errors, formEl });
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap);
  min-width: var(--tiptap-min-width);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--tiptap-gap);
}
</style>
