<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import { Image } from "./components/extensions/Image";
import type { ThemeName } from "./types";
import type { LocaleName } from "./locales";
const content = ref("");

content.value = ``;
const theme = ref<ThemeName>("light");
const locale = ref<LocaleName>("zh");
const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
};

// Configure the image extension with a custom uploader (demo: fake upload).
const extensions = [
  Image.configure({
    upload: async (_file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return "https://api.mtyqx.cn/api/random.php";
    },
  }),
];
</script>

<template>
  <div class="app-bar">
    <div>
      主题
      <select class="app-select" v-model="theme" @change="toggleTheme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    <div>
      语言
      <select class="app-select" v-model="locale">
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  </div>

  <div style="height: 100vh; width: 80%; margin: 0 auto; padding: 10vh 0">
    <TipTapEditor
      v-model="content"
      style="height: 60vh"
      :theme="theme"
      :locale="locale"
      :extensions="extensions"
    />
    <br />
    Content:
    <br />
    <div style="word-break: break-word" v-html="content"></div>
  </div>
</template>

<style lang="scss" scoped>
.app-bar {
  padding: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-select {
  padding: 3px 5px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--app-color-text);
  background: var(--app-color-btn-bg);
  outline: none;
  border: 1px solid var(--app-color-border);
}
</style>
