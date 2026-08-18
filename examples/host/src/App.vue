<script setup lang="ts">
import { ref } from "vue";
// Consume the published-style API
import { TipTapEditor } from "tip-tap-editor";
import "tip-tap-editor/style.css";

const content = ref("<p>hello from host app</p>");
</script>

<template>
  <div style="max-width: 800px; margin: 40px auto">
    <TipTapEditor v-model="content" :max-length="500" theme="light" locale="zh" placeholder="请输入…" />
    <hr />
    <pre>{{ content }}</pre>
  </div>
</template>
