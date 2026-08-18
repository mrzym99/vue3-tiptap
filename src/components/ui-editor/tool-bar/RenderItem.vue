<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import type { ButtonView, ButtonViewReturn, TranslateFn } from "@/types";
import { useTiptapLocale } from "@/locales";

const { t } = useTiptapLocale();
const translate = t as TranslateFn;

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  button: {
    type: Function as PropType<ButtonView>,
    required: true,
  },
});

// A single extension may return one button or an array of buttons
const buttons = computed<ButtonViewReturn[]>(() => {
  const result = props.button({ editor: props.editor, t: translate });
  return Array.isArray(result) ? result : [result];
});
</script>

<template>
  <component
    v-for="(btn, index) in buttons"
    :key="index"
    :is="btn.component"
    v-bind="btn.componentProps"
  />
</template>
