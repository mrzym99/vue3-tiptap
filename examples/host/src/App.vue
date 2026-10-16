<script setup lang="ts">
import { ref } from "vue";
// Consume the published-style API
import { TipTapEditor, StarterKit, Image } from "@yumine/vue3-tiptap";
import "@yumine/vue3-tiptap/style.css";

const content = ref("<p>hello from host app</p>");

// Hand-pick extensions (or any extension from the package root) and pass
// them via `extensions`; YouTube links are handled by Video's URL conversion.
const extensions = [StarterKit.configure({})];
</script>

<template>
  <div style="max-width: 800px; margin: 40px auto">
    <TipTapEditor
      v-model="content"
      :limit="500"
      theme="light"
      locale="zh"
      style="height: 400px"
      placeholder="请输入…"
      :extensions="extensions"
    />
    <hr />
    <pre>{{ content }}</pre>
  </div>
</template>
