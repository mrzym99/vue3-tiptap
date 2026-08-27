<template>
  <div class="form-item" :class="{ 'has-error': error }">
    <label v-if="label" class="form-item-label" :for="fieldId">{{ label }}</label>
    <slot :id="fieldId" :error="error" :validate="validate" />
    <span v-if="error" class="form-item-error" :id="`${fieldId}-error`">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from "vue";
import { formContextKey } from "@/components/ui-common/form/types";
import type { FormItemProps } from "./props";

/**
 * Form item: label + control slot + inline error, wired to the parent
 * {@link Form} context.
 *
 * - `name` + `rules` register the field for form-level validation
 * - the default slot receives `{ id, error, validate }` so the control can
 *   bind `:id` (label for=) and validate on input/blur
 */
const props = withDefaults(defineProps<FormItemProps>(), {
  label: undefined,
  rules: () => [],
  validateOnInput: false,
});

const form = inject(formContextKey, null);

const fieldId = computed(() => `tiptap-field-${props.name}`);
const error = computed(() => form?.getError(props.name) ?? "");

function validate() {
  return form?.validateField(props.name);
}

onMounted(() => {
  form?.registerField(props.name, props.rules);
});

onBeforeUnmount(() => {
  form?.unregisterField(props.name);
});
</script>

<style lang="scss" scoped>
.form-item {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--tiptap-gap-xs);
}

.form-item-label {
  color: var(--tiptap-color-text-muted);
  font-size: var(--tiptap-font-size-sm);
}

.form-item-error {
  color: var(--tiptap-accent-red);
  font-size: var(--tiptap-font-size-sm);
  line-height: 1.3;
}
</style>
