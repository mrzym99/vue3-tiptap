<script setup lang="ts">
import { TipTapEditor } from "@yumine9/vue3-tiptap";
import type { Extensions, LocaleTranslations, ThemeName } from "@yumine9/vue3-tiptap";

// 完整版：不传 toolbar，使用库默认的完整工具栏
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
    toolbarWrap
    :extensions="extensions"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
