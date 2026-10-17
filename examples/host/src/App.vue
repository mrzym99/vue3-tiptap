<script setup lang="ts">
import { computed, ref, watch } from "vue";
// Consume the published-style API
import { TipTapEditor, StarterKit, Image } from "@yumine/vue3-tiptap";
import type { LocaleTranslations, ThemeName, Toolbar } from "@yumine/vue3-tiptap";
import "@yumine/vue3-tiptap/style.css";

const content = ref("<p>hello from host app</p>");

// Hand-pick extensions (or any extension from the package root) and pass
// them via `extensions`; YouTube links are handled by Video's URL conversion.
const extensions = [StarterKit.configure({})];

// Two presets: "simple" keeps a minimal toolbar, "full" uses the default layout
// (`undefined` = defaultToolbar). Keys are extension names.
const SIMPLE_TOOLBAR: Toolbar = "bold italic strike | heading bulletList | link";

const mode = ref<"simple" | "full">("simple");
const toolbar = computed<Toolbar | undefined>(() =>
  mode.value === "simple" ? SIMPLE_TOOLBAR : undefined,
);

// Theme / locale like the root demo page (src/App.vue)
const theme = ref<ThemeName>("light");
const locale = ref("zh");
const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
};
// Sync the html.dark class so the host page itself also switches appearance
watch(
  theme,
  (value) => document.documentElement.classList.toggle("dark", value === "dark"),
  { immediate: true },
);

// Demo: add a third language ("zh-TW") via the `translations` prop.
// Reuse the shared host-translation pack from the repo's demo folder.
import zhTW from "../../../demo/zh-TW";
const translations: LocaleTranslations = { "zh-TW": zhTW };
</script>

<template>
  <div class="host-page">
    <div class="host-bar">
      <label style="display: inline-flex; gap: 12px">
        <span><input v-model="mode" type="radio" value="simple" /> 简单版</span>
        <span><input v-model="mode" type="radio" value="full" /> 完整版</span>
      </label>

      <div class="host-actions">
        <select v-model="locale" class="host-select" aria-label="语言">
          <option value="zh">简体中文</option>
          <option value="en">English</option>
          <option value="zh-TW">繁體中文(扩展)</option>
        </select>
        <button
          type="button"
          class="host-icon-btn"
          :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          @click="toggleTheme"
        >
          {{ theme === "dark" ? "☀️" : "🌙" }}
        </button>
      </div>
    </div>

    <TipTapEditor
      v-model="content"
      :limit="500"
      :theme="theme"
      :locale="locale"
      :translations="translations"
      style="height: 400px"
      placeholder="请输入…"
      :extensions="extensions"
      :toolbar="toolbar"
    />
    <hr />
    <pre>{{ content }}</pre>
  </div>
</template>

<style>
/* Host page chrome — mirrors the root demo's light/dark app variables */
:root {
  --host-bg: #f8fafc;
  --host-text: #1f2937;
  --host-border: #e8eaee;
}
:root.dark {
  --host-bg: #191a1d;
  --host-text: #fafafa;
  --host-border: #34353b;
}
.host-page {
  max-width: 800px;
  margin: 40px auto;
  color: var(--host-text);
}
.host-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.host-actions {
  display: flex;
  gap: 10px;
}
.host-select {
  padding: 5px 8px;
  cursor: pointer;
  border-radius: 8px;
  background: transparent;
  color: var(--host-text);
  border: 1px solid var(--host-border);
}
.host-icon-btn {
  width: 32px;
  height: 30px;
  cursor: pointer;
  border-radius: 8px;
  background: transparent;
  color: var(--host-text);
  border: 1px solid var(--host-border);
}
</style>
