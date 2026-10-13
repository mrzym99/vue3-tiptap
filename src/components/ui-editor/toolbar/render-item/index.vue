<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { ButtonView, ButtonViewReturn, TranslateFn } from "@/types";
import { useTiptapLocale } from "@/locales";

const { t } = useTiptapLocale();
const translate = t as TranslateFn;

const props = defineProps<{
  editor: Editor;
  button: ButtonView;
}>();

// A single extension may return one button or an array of buttons
const buttons = computed<ButtonViewReturn[]>(() => {
  const result = props.button({ editor: props.editor, t: translate });
  return Array.isArray(result) ? result : [result];
});
</script>

<template>
  <component v-for="(btn, index) in buttons" :key="index" :is="btn.component" v-bind="btn.componentProps" />
</template>
