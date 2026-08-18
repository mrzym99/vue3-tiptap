<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import type { ThemeName } from "./types";
import type { LocaleName } from "./locales";
const content = ref("");

content.value = `shjd dhjkdnkad dsdjasdajkdas`;
const theme = ref<ThemeName>("light");
const locale = ref<LocaleName>("zh");
const toggleTheme = () => {
  theme.value = theme.value === "light" ? "dark" : "light";
};
const toggleLocale = () => {
  locale.value = locale.value === "zh" ? "en" : "zh";
};
</script>

<template>
  <button @click="toggleTheme">切换主题</button>
  <button @click="toggleLocale">切换语言</button>
  <div style="height: 100vh; width: 80%; margin: 0 auto; padding: 10vh 0">
    <TipTapEditor
      v-model="content"
      style="height: 60vh"
      :theme="theme"
      :locale="locale"
    />
    <br />
    Content:
    <br />
    <div style="word-break: break-word" v-html="content"></div>
  </div>
</template>
