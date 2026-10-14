<script setup lang="ts">
import type { Editor } from "@tiptap/core";
import type { ButtonView, ButtonViewReturn, TranslateFn } from "@/types";

const props = defineProps<{
  editor: Editor;
  button: ButtonView;
  t: TranslateFn;
}>();

// A single extension may return one button or an array of buttons
const buttons = computed<ButtonViewReturn[]>(() => {
  const result = props.button({ editor: props.editor, t: props.t });
  return Array.isArray(result) ? result : [result];
});
</script>

<template>
  <component v-for="(btn, index) in buttons" :key="index" :is="btn.component" v-bind="btn.componentProps" />
</template>
