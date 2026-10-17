<script setup lang="ts">
import { computed, ref, watch } from "vue";
// Consume the published-style API
import { TipTapEditor, StarterKit, Dialog } from "@yumine/vue3-tiptap";
import type { LocaleTranslations, ThemeName, Toolbar } from "@yumine/vue3-tiptap";
import "@yumine/vue3-tiptap/style.css";

const content = ref("<p>hello from host app</p>");

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
];

// Two presets: "simple" keeps a minimal toolbar, "full" uses the default layout
// (`undefined` = defaultToolbar). Keys are extension names.
const SIMPLE_TOOLBAR: Toolbar = "bold italic strike | heading bulletList | link";
const mode = ref<"simple" | "full">("simple");
const toolbar = computed<Toolbar | undefined>(() => (mode.value === "simple" ? SIMPLE_TOOLBAR : undefined));

// Theme / locale (same wiring as the root demo page, src/App.vue)
const theme = ref<ThemeName>("light");
const locale = ref("zh");
const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
};
// Sync the html.dark class so the host page itself also switches appearance
watch(theme, (value) => document.documentElement.classList.toggle("dark", value === "dark"), { immediate: true });

// Demo: add a third language ("zh-TW") via the `translations` prop.
// Reuse the shared host-translation pack from the repo's demo folder.
import zhTW from "../../../demo/zh-TW";
const translations: LocaleTranslations = { "zh-TW": zhTW };

import beautify from "js-beautify";
import Prism from "prismjs";
import "prismjs/components/prism-markup";

// 源码 dialog: show the raw HTML the editor produces
const showOutput = ref(false);
const formattedSource = computed(() => beautify.html(content.value, { indent_size: 2 }));
const highlightedSource = computed(() => {
  const html = Prism.highlight(formattedSource.value, Prism.languages.markup, "markup");
  return html
    .split("\n")
    .map((line) => `<span class="token-line">${line}</span>`)
    .join("\n");
});
</script>

<template>
  <div class="container">
    <div class="app-bar">
      <div class="app-brand">
        <span class="app-brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16">
              <path d="m 16,64 224.93778,0.09256" />
              <path
                d="M 48,16 H 207.91114 C 225.62929,16 240,30.281849 240,48 v 160 c 0,17.71816 -14.28185,32 -32,32 H 48 C 30.281848,240 16.069099,225.73073 16.06221,208.01257 L 16,48 C 15.993112,30.281851 30.281848,16 48,16 Z"
              />
              <path d="M 191.96444,64.092555 192,16" />
              <path d="M 48.044437,112.06589 H 80.02666" />
              <path d="M 48.044437,144.04812 H 175.97333" />
              <path d="M 48.044437,176.03034 H 127.99999" />
              <path d="M 48.044437,208.01256 H 80.02666" />
            </g>
          </svg>
        </span>
        <span class="app-brand-name">@yumine/vue3-tiptap</span>
        <span class="app-mode-badge">{{ mode === "simple" ? "简单版" : "完整版" }}</span>
      </div>

      <div class="app-actions">
        <button type="button" class="app-select" :class="{ 'is-active': mode === 'simple' }" @click="mode = 'simple'">
          简单版
        </button>
        <button type="button" class="app-select" :class="{ 'is-active': mode === 'full' }" @click="mode = 'full'">
          完整版
        </button>

        <button
          type="button"
          class="app-select"
          @click="showOutput = true"
        >
          查看源码
        </button>

        <select class="app-select" v-model="locale" aria-label="语言">
          <option value="zh">简体中文</option>
          <option value="en">English</option>
          <option value="zh-TW">繁體中文(扩展)</option>
        </select>

        <button
          type="button"
          class="app-icon-btn"
          :aria-label="theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'"
          :title="theme === 'dark' ? '浅色主题' : '深色主题'"
          @click="toggleTheme"
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
      </div>
    </div>

    <div class="editor-container">
      <TipTapEditor
        v-model="content"
        style="height: 100%"
        :theme="theme"
        :locale="locale"
        :translations="translations"
        placeholder="请输入…"
        :extensions="extensions"
        :toolbar="toolbar"
        autofocus="end"
      />
    </div>

    <Teleport to="body">
      <Dialog v-model:show="showOutput" title="源码（HTML）" width="760px">
        <pre class="output-html language-html"><code v-html="highlightedSource" /></pre>
      </Dialog>
    </Teleport>
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
  background: var(--app-color-background);
  transition: background-color 0.2s ease-in-out;
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

.app-bar {
  width: 100%;
  padding: 10px 24px;
  background: var(--app-color-header-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  transition: background-color 0.2s ease-in-out;
}

.app-brand {
  align-items: center;
  display: flex;
  gap: 8px;
}

.app-brand-icon {
  align-items: center;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 999px;
  color: var(--app-color-blue);
  display: inline-flex;
  font-size: 20px;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.app-brand-name {
  color: var(--app-color-text);
  font-size: 16px;
  font-weight: 600;
}

.app-mode-badge {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--app-color-blue);
  background: rgba(99, 102, 241, 0.1);
}

.app-actions {
  align-items: center;
  display: flex;
  gap: 10px;
}

.app-select {
  padding: 5px 8px;
  cursor: pointer;
  border-radius: 10px;
  color: var(--app-color-text);
  background: var(--app-color-btn-bg);
  outline: none;
  border: 1px solid var(--app-color-border);
  font-size: 13px;
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.app-select:hover {
  border-color: var(--app-color-blue);
}

.app-select:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.app-select.is-active {
  color: var(--app-color-blue);
  border-color: var(--app-color-blue);
}

.app-icon-btn {
  align-items: center;
  background: var(--app-color-btn-bg);
  border: 1px solid var(--app-color-border);
  border-radius: 10px;
  color: var(--app-color-text);
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 30px;
  justify-content: center;
  outline: none;
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  width: 34px;
}

.app-icon-btn:hover {
  border-color: var(--app-color-blue);
  color: var(--app-color-blue);
}

.app-icon-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.editor-container {
  flex: 1;
  width: calc(100% - 48px);
  max-width: 1200px;
  min-height: 0;
  margin: 16px 0 24px;
  box-sizing: border-box;
  box-shadow: var(--app-box-shadow);
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;
}

.app-github {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  color: var(--app-color-text);
  transition:
    opacity 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.app-github:hover {
  opacity: 0.7;
}

/* 预览 / 源码 dialog */
.output-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 15, 15, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.output-dialog {
  width: min(760px, 100%);
  max-height: min(80vh, 640px);
  display: flex;
  flex-direction: column;
  background: var(--app-color-header-bg);
  border: 1px solid var(--app-color-border);
  border-radius: 16px;
  box-shadow: var(--app-box-shadow);
  overflow: hidden;
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--app-color-border);
}

.output-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-color-text);
}

.output-body {
  min-height: 200px;
  overflow: auto;
}

.output-html {
  margin: 0;
  padding: 16px 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--app-color-text);
  background: var(--app-color-background);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  counter-reset: line;
}

/* Line numbers via CSS counters (prism line-numbers plugin not needed) */
.output-html code {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-html .token-line {
  display: block;
  padding: 0 16px 0 3.5em;
  position: relative;
  counter-increment: line;
}

.output-html .token-line::before {
  content: counter(line);
  position: absolute;
  left: 0;
  width: 2.5em;
  padding-right: 0.75em;
  text-align: right;
  color: var(--app-color-text);
  opacity: 0.35;
  user-select: none;
}

/* Minimal token colors, driven by --app vars so dark mode follows */
.output-html .token.punctuation { opacity: 0.55; }
.output-html .token.tag { color: var(--app-color-blue); }
.output-html .token.attr-name { color: #d6336c; }
.output-html .token.attr-value,
.output-html .token.string { color: #2f9e44; }
.output-html .token.comment { opacity: 0.5; }
:root.dark .output-html .token.attr-name { color: #f06595; }
:root.dark .output-html .token.attr-value,
:root.dark .output-html .token.string { color: #69db7c; }
</style>
