<template>
  <div class="tiptap-input-wrap" :class="{ 'tiptap-input-wrap--multiline': multiline }">
    <textarea
      v-if="multiline"
      ref="field"
      class="tiptap-input tiptap-input--multiline"
      :class="{ 'tiptap-input--clearable': clearable }"
      :value="modelValue"
      :placeholder="placeholder"
      v-bind="$attrs"
      @input="onInput"
    />
    <input
      v-else
      ref="field"
      class="tiptap-input"
      :class="{ 'tiptap-input--clearable': clearable }"
      :value="modelValue"
      :placeholder="placeholder"
      v-bind="$attrs"
      @input="onInput"
    />
    <button
      v-if="clearable && modelValue"
      type="button"
      class="tiptap-input-clear"
      :aria-label="t('clear')"
      @click="onClear"
    >
      <XIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import XIcon from "~icons/lucide/x";
import { useTiptapLocale } from "@/locales";

/** Shared text input (Notion Style); native attrs/events fall through to the <input>. */
defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    /** Render a multi-line <textarea> instead of an <input> (pass `rows` via attrs) */
    multiline?: boolean;
    clearable?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: undefined,
    multiline: false,
    clearable: false,
  },
);

const emit = defineEmits<{ "update:modelValue": [value: string] }>();
const { t } = useTiptapLocale();
const field = useTemplateRef<HTMLInputElement | HTMLTextAreaElement>("field");

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  emit("update:modelValue", value);
}

function onClear() {
  emit("update:modelValue", "");
  field.value?.focus();
}
</script>

<style lang="scss" scoped>
.tiptap-input-wrap {
  position: relative;
  width: 100%;

  &--multiline .tiptap-input-clear {
    top: 10px;
    transform: none;
  }
}

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

  &--clearable {
    padding-right: 32px;
  }

  /* Halo Focus: soft large-radius ring, no hard border */
  &:focus {
    border-color: var(--tiptap-input-border-hover);
    background-color: var(--tiptap-color-bg);
    box-shadow: 0 0 0 3px var(--tiptap-focus-ring);
  }
}

.tiptap-input-clear {
  align-items: center;
  background: none;
  border: none;
  border-radius: var(--tiptap-border-radius-sm);
  color: var(--tiptap-color-text-muted);
  cursor: pointer;
  display: flex;
  font-size: 14px;
  padding: 2px;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    color: var(--tiptap-color-text);
  }
}
</style>
