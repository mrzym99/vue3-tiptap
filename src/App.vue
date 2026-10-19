<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import { StarterKit } from "./components/extensions";
import type { LocaleTranslations } from "./locales";
import zhTW from "../demo/zh-TW";
import { useDemoConfig } from "../demo/useDemoConfig";
import SunIcon from "~icons/lucide/sun";
import MoonIcon from "~icons/lucide/moon";

const content = ref("");

// Theme / locale with localStorage persistence (see useDemoConfig)
const { theme, locale } = useDemoConfig();
const toggleTheme = () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
};
// Demo: add a third language ("zh-TW") via the `translations` prop
const translations: LocaleTranslations = { "zh-TW": zhTW };
// `limit` is read once at editor creation (runtime changes are not applied) —
// edit this constant to try the character limit instead of binding a control.
const limit = ref(10);
const editorRef = useTemplateRef<InstanceType<typeof TipTapEditor>>("editorRef");

// Configure the image extension with a custom uploader (demo: fake upload).
// Configure the mention extension with a host-injected member list.
const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];
// Demo: `false` disables a bundled extension, an object configures it (image
// uploader, mention member list).
const extensions = [
  StarterKit.configure({
    image: {
      // upload: async (_file: File) => {
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      //   return "https://api.mtyqx.cn/api/random.php";
      // },
    },
    mention: {
      items: mentionUsers,
    },
    // Drag handle disabled: StarterKit filters out extensions set to `false`.
    dragHandle: false,
  }),
];
</script>

<template>
  <div class="container">
    <div class="app-bar">
      <div class="app-brand">
        <span class="app-brand-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
            <path d="M0 0h256v256H0z" fill="none" />
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
      </div>

      <div class="app-actions">
        <button class="app-select" @click="editorRef?.focus()">Focus</button>

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
          <SunIcon v-if="theme === 'dark'" />
          <MoonIcon v-else />
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
        ref="editorRef"
        v-model="content"
        style="height: 100%"
        :theme="theme"
        :locale="locale"
        :translations="translations"
        :limit="limit"
        :extensions="extensions"
        bubble-menu="bold italic highlight link"
        autofocus="end"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100vw;
  height: 100vh;
  min-width: 880px;
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
}

.app-brand {
  align-items: center;
  display: flex;
  gap: 8px;
}

/* Soft UI icon chip: round tinted background */
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
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    border-color: var(--app-color-blue);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
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
  transition: box-shadow 0.2s ease-in-out;
  width: 34px;

  &:hover {
    border-color: var(--app-color-blue);
    color: var(--app-color-blue);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  }
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
}

.app-github {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  color: var(--app-color-text);
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
}
</style>
