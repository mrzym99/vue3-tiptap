<script setup lang="ts">
// @ts-ignore - Vue SFC module declaration is not available in this setup
import TipTapEditor from './components/TipTapEditor.vue'
import { ref } from 'vue';
const content = ref('')

 content.value = `shjd dhjkdnkad dsdjasdajkdas`

 
</script>

<template>
  <div style="height: 100vh; width: 80%; margin: 0 auto">
    <TipTapEditor v-model="content" :max-length="20" style="height: 60vh" />
    <br>
    Content:
    <br>
    <div style="word-break: break-word;" v-html="content"></div>
  </div>
</template>
