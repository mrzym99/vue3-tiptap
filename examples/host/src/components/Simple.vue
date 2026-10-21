<script setup lang="ts">
import { TipTapEditor } from "@yumine9/vue3-tiptap";
import type { Extensions, LocaleTranslations, ThemeName, Toolbar } from "@yumine9/vue3-tiptap";

// 精简版：只保留较全但去掉弹窗类的常用工具
const SIMPLE_TOOLBAR: Toolbar =
  "undo redo | heading bulletList blockquote codeBlock | bold italic strike code underline highlight link| superscript subscript | textAlign | table | image";

defineProps<{
  modelValue: string;
  theme: ThemeName;
  locale: string;
  translations: LocaleTranslations;
  extensions: Extensions;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <TipTapEditor
    :model-value="modelValue"
    style="height: 100%"
    :theme="theme"
    :locale="locale"
    :translations="translations"
    placeholder="请输入…"
    :extensions="extensions"
    :toolbar="SIMPLE_TOOLBAR"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
