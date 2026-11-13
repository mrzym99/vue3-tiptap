<template>
  <textarea
    v-if="multiline"
    class="tiptap-input tiptap-input--multiline"
    :value="modelValue"
    :placeholder="placeholder"
    v-bind="$attrs"
    @input="onInput"
  />
  <input v-else class="tiptap-input" :value="modelValue" :placeholder="placeholder" v-bind="$attrs" @input="onInput" />
</template>

<script setup lang="ts">
/** Shared text input (Notion Style); native attrs/events fall through to the <input>. */
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    /** Render a multi-line <textarea> instead of an <input> (pass `rows` via attrs) */
    multiline?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: undefined,
    multiline: false,
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}
</script>

<style lang="scss" scoped>
.tiptap-input {
  background-color: var(--tiptap-input-bg);
  border: 1px solid var(--tiptap-input-border);
  border-radius: var(--tiptap-input-radius);
  box-sizing: border-box;
  color: var(--tiptap-input-text);
  font-size: var(--tiptap-font-size);
  outline: none;
  padding: var(--tiptap-input-padding);
  transition:
    border-color 200ms ease-in-out,
    box-shadow 200ms ease-in-out;
  width: 100%;

  &::placeholder {
    color: var(--tiptap-input-placeholder);
  }

  &--multiline {
    display: block;
    min-height: 76px;
    line-height: 1.6;
    resize: vertical;
  }

  /* Halo Focus: soft large-radius ring, no hard border */
  &:focus {
    border-color: var(--tiptap-input-border-hover);
    background-color: var(--tiptap-color-bg);
    box-shadow: 0 0 0 3px var(--tiptap-focus-ring);
  }
}
</style>
