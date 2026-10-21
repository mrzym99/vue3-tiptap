<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";
// Consume the published-style API
import { StarterKit, Dialog, Button, Ai } from "@yumine9/vue3-tiptap";
import Header from "./components/Header.vue";
import Full from "./components/Full.vue";
import Simple from "./components/Simple.vue";
import { useDemoConfig } from "./composables/useDemoConfig";
import type { LocaleTranslations } from "@yumine9/vue3-tiptap";
import "@yumine9/vue3-tiptap/style.css";
import { DEFAULT_CONTENT } from "./constants";

const content = ref(DEFAULT_CONTENT);

const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];

// Hand-pick extensions (or any extension from the package root) and pass
// them via `extensions`; YouTube links are handled by Video's URL conversion.
const extensions = [
  StarterKit.configure({
    image: {
      upload: async (_file: File) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return "https://api.mtyqx.cn/api/random.php";
      },
    },
    mention: {
      items: mentionUsers,
    },
    // Drag handle disabled: StarterKit filters out extensions set to `false`.
    dragHandle: false,
  }),
  // AI assistant is just another extension: it self-mounts the chat FAB/drawer
  // (no toolbar entry). Config from .env.local; /ai-proxy = dev proxy in vite.config.ts.
  Ai.configure({
    baseURL: import.meta.env.VITE_AI_BASE_URL,
    apiKey: import.meta.env.VITE_AI_API_KEY,
    model: import.meta.env.VITE_AI_MODEL,
    // no confirm callback => danger tools (e.g. set_document) are refused fail-safe
    confirmDangerous: (tool) => Promise.resolve(window.confirm(`AI 要执行 ${tool.name}，允许吗？`)),
  }),
];

// theme / locale / mode with localStorage persistence (see useDemoConfig)
const { theme, locale, mode } = useDemoConfig();

// Swap Prism theme with the page theme (light: prism, dark: okaidia)
const prismStyle = computed(() => (theme.value === "dark" ? prismDark : prismLight));

// Demo: add a third language ("zh-TW") via the `translations` prop.
// Reuse the shared host-translation pack from the repo's demo folder.
import zhTW from "../../../demo/zh-TW";
const translations: LocaleTranslations = { "zh-TW": zhTW };

import beautify from "js-beautify";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import prismLight from "prismjs/themes/prism.css?inline";
import prismDark from "prismjs/themes/prism-okaidia.min.css?inline";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";

// 源码 dialog: show the raw HTML the editor produces
const showOutput = ref(false);
const codeEl = useTemplateRef<HTMLElement>("codeEl");
const formattedSource = computed(() => beautify.html(content.value, { indent_size: 2 }));

// Re-highlight on open/content change; the line-numbers plugin reads the DOM,
// so we go through highlightElement instead of Prism.highlight
watch([formattedSource, showOutput], ([, visible]) => {
  if (visible) nextTick(() => Prism.highlightElement(codeEl.value!));
});

const copied = ref(false);
async function copySource() {
  await navigator.clipboard.writeText(formattedSource.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <component :is="'style'" v-html="prismStyle" />
  <div class="container">
    <Header>
      <template #badge>
        <span class="app-mode-badge">{{ mode === "simple" ? "简单版" : "完整版" }}</span>
      </template>

      <button type="button" class="app-select" :class="{ 'is-active': mode === 'simple' }" @click="mode = 'simple'">
        简单版
      </button>
      <button type="button" class="app-select" :class="{ 'is-active': mode === 'full' }" @click="mode = 'full'">
        完整版
      </button>

      <button type="button" class="app-select" @click="showOutput = true">查看源码</button>

      <select v-model="locale" class="app-select" aria-label="语言">
        <option value="zh">简体中文</option>
        <option value="en">English</option>
        <option value="zh-TW">繁體中文(扩展)</option>
      </select>

      <button
        type="button"
        class="app-icon-btn"
        :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
        :title="theme === 'dark' ? '浅色主题' : '深色主题'"
        @click="theme = theme === 'dark' ? 'light' : 'dark'"
      >
        <svg
          v-if="theme === 'dark'"
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      <a
        class="app-github"
        href="https://github.com/mrzym99/vue3-tiptap"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        aria-label="GitHub 仓库"
      >
        <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor" aria-hidden="true">
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
          />
        </svg>
      </a>
    </Header>

    <div class="editor-container">
      <Simple
        v-if="mode === 'simple'"
        v-model="content"
        :theme="theme"
        :locale="locale"
        :translations="translations"
        :extensions="extensions"
      />
      <Full
        v-else
        v-model="content"
        :theme="theme"
        :locale="locale"
        :translations="translations"
        :extensions="extensions"
      />
    </div>

    <Dialog v-model:show="showOutput" closeOnClickModal title="源码（HTML）" width="760px">
      <pre class="language-html line-numbers"><code ref="codeEl">{{ formattedSource }}</code></pre>
      <template #footer>
        <Button variant="primary" @click="copySource">{{ copied ? "已复制 ✓" : "复制" }}</Button>
      </template>
    </Dialog>
  </div>
</template>

<style>
/* Page chrome — same --app vars as the root demo (src/style.scss) */
:root {
  --app-color-blue: #6366f1;
  --app-color-header-bg: #ffffff;
  --app-color-background: #f8fafc;
  --app-color-text: #1f2937;
  --app-color-btn-bg: #ffffff;
  --app-color-border: #e8eaee;
  --app-box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08), 0 16px 40px rgba(15, 15, 15, 0.1);
}
:root.dark {
  --app-color-header-bg: #1f1f1f;
  --app-color-background: #191a1d;
  --app-color-text: #fafafa;
  --app-color-btn-bg: #1f1f1f;
  --app-color-border: #34353b;
  --app-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35), 0 12px 32px rgba(0, 0, 0, 0.35);
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  color: var(--app-color-text);
  background-color: var(--app-color-background);
  height: 100vh;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: 100vh;
  min-width: 880px;
  box-sizing: border-box;
}

.editor-container {
  flex: 1;
  max-width: 880px;
  min-height: 0;
  margin: 16px 0 24px;
  box-sizing: border-box;
  box-shadow: var(--app-box-shadow);
  border-radius: 16px;
  overflow: hidden;
}
</style>
