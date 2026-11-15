<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import { StarterKit, Ai, Mathematics } from "./components/extensions";
import type { LocaleTranslations } from "./locales";
import zhTW from "../demo/zh-TW";
import { useDemoConfig } from "../demo/useDemoConfig";

const content = ref("");

const { theme, lang } = useDemoConfig();
const translations: LocaleTranslations = { "zh-TW": zhTW };
const limit = ref(0);

const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];
const extensions = [
  StarterKit.configure({
    imageUpload: {
      limit: 3,
      maxSize: 5 * 1024 * 1024,
      upload: async (_file: File) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return "https://api.mtyqx.cn/api/random.php";
      },
    },
    link: {
      protocols: ["mailto", "tel"],
      validate: (url) => /^(https:\/\/(www\.)?(github\.com|bilibili\.com)(\/|$)|mailto:|tel:)/i.test(url),
      validateMessage: "支持 GitHub / Bilibili 链接（mailto:/tel: 也可以）",
    },
    mention: {
      items: mentionUsers,
    },
    dragHandle: false,
    lineHeight: {
      lineHeights: ["1.5", "1.7", "2", "2.4", "3"],
    },
    codeBlock: {
      languages: ["javascript", "typescript"],
    },
  }),
  Ai.configure({
    baseURL: import.meta.env.VITE_AI_BASE_URL,
    apiKey: import.meta.env.VITE_AI_API_KEY,
    model: import.meta.env.VITE_AI_MODEL,
    confirmDangerous: (tool) => Promise.resolve(window.confirm(`AI 要执行 ${tool.name}，允许吗？`)),
  }),
  Mathematics,
];
</script>

<template>
  <div class="container">
    <TipTapEditor
      ref="editorRef"
      v-model="content"
      :theme="theme"
      :lang="lang"
      :translations="translations"
      :limit="limit"
      :extensions="extensions"
      bubble-menu="bold italic highlight link"
      toolbar-wrap
      autofocus="end"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  min-width: 880px;
}

:deep(.tiptap) {
  max-width: 800px;
}
</style>
