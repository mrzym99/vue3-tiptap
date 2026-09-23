<script setup lang="ts">
import { ref } from "vue";
// Consume the published-style API
import { TipTapEditor, StarterKit, Youtube, Twitch, Image } from "tip-tap-editor";
import "tip-tap-editor/style.css";

const content = ref("<p>hello from host app</p>");

// StarterKit excludes Youtube/Twitch — hand-pick them (or any extension)
// from the package root and pass them via `extensions`.
const extensions = [StarterKit.configure({})];
</script>

<template>
  <div style="max-width: 800px; margin: 40px auto">
    <TipTapEditor
      v-model="content"
      :limit="500"
      theme="light"
      locale="zh"
      placeholder="请输入…"
      :extensions="extensions"
    />
    <hr />
    <pre>{{ content }}</pre>
  </div>
</template>
