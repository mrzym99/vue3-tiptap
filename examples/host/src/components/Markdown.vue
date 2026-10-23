<script setup lang="ts">
import { TipTapEditor } from "@yumine9/vue3-tiptap";
import type { Extensions, LocaleTranslations, ThemeName, Toolbar } from "@yumine9/vue3-tiptap";

// Markdown 版：v-model 进出都是 markdown（content-type="markdown"）
const SIMPLE_TOOLBAR: Toolbar =
  "undo redo | heading bulletList blockquote codeBlock | bold italic strike code underline highlight link| superscript subscript | textAlign | table | image";

defineProps<{
  modelValue: string;
  theme: ThemeName;
  lang: string;
  translations: LocaleTranslations;
  extensions: Extensions;
}>();

defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <div class="markdown-demo">
    <TipTapEditor
      :model-value="modelValue"
      style="height: 100%"
      content-type="markdown"
      :theme="theme"
      :lang="lang"
      :translations="translations"
      :extensions="extensions"
      :toolbar="SIMPLE_TOOLBAR"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<style scoped>
.markdown-demo {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
