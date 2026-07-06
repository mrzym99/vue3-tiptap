<script setup lang="ts">
// @ts-ignore - Vue SFC module declaration is not available in this setup
import TipTapEditor from "./components/index.vue";
import type { ThemeName } from "./types";
const content = ref("");

content.value = `shjd dhjkdnkad dsdjasdajkdas`;
const theme = ref<ThemeName>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <button @click="toggleTheme">切换主题</button>
  <div style="height: 100vh; width: 80%; margin: 0 auto; padding: 10vh 0">
    <TipTapEditor v-model="content" :max-length="5000" style="height: 60vh" :theme="theme"/>
    <br />
    Content:
    <br />
    <div style="word-break: break-word" v-html="content"></div>
  </div>
</template>
