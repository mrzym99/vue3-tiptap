<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import { StarterKit } from "./components/extensions";
import type { ThemeName } from "./types";
import type { LocaleTranslations } from "./locales";
import zhTW from "./zh-TW";
const content = ref("");

content.value = ``;
const theme = ref<ThemeName>("light");
const locale = ref("zh");
// Demo: add a third language ("zh-TW") via the `translations` prop
const translations: LocaleTranslations = { "zh-TW": zhTW };
// `limit` is read once at editor creation (runtime changes are not applied) —
// edit this constant to try the character limit instead of binding a control.
const limit = ref(0);
const status = ref("(init)");
// Show the sequence of editor events (deduped) so the new API is visible
const statusEvents = ref<string[]>([]);
function pushStatus(name: string) {
  if (statusEvents.value[statusEvents.value.length - 1] !== name) {
    statusEvents.value = [...statusEvents.value, name].slice(-6);
  }
  status.value = name;
}
const editorRef = ref<InstanceType<typeof TipTapEditor> | null>(null);
const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
};

// Configure the image extension with a custom uploader (demo: fake upload).
// Configure the mention extension with a host-injected member list.
const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];
// Demo: StarterKit bundles every built-in; `false` disables one (no Twitch),
// an object configures it (image uploader, mention member list).
const extensions = [
  StarterKit.configure({
    twitch: false,
    image: {
      upload: async (_file: File) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return "https://api.mtyqx.cn/api/random.php";
      },
    },
    mention: {
      items: mentionUsers,
    },
    // Drag handle: enable nested mode (list items, quotes, paragraphs inside
    // table cells, etc. are draggable). Whole tables: hover the gutter to the
    // left of a cell (edge detection) to grab the table itself.
    dragHandle: {
      nested: true,
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
        <option value="zh">简体中文</option>
        <option value="zh-TW">繁體中文（translations 扩展）</option>
        <option value="en">English</option>
      </select>
    </div>

    <div class="app-status">
      {{ statusEvents.join(" → ") }}
      <button class="app-select" @click="editorRef?.focus()">聚焦</button>
    </div>

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

  <div style="height: 100vh; max-width: 880px; margin: 0 auto; padding: 24px">
    <TipTapEditor
      ref="editorRef"
      v-model="content"
      style="height: 60vh"
      :theme="theme"
      :locale="locale"
      :translations="translations"
      :limit="limit"
      :extensions="extensions"
      autofocus="end"
      @ready="pushStatus('ready')"
      @update="pushStatus('update')"
      @truncated="pushStatus('truncated: max ' + $event.limit)"
    />
    <br />
    Content:
    <br />
    <div style="word-break: break-word" v-html="content"></div>
  </div>
</template>

<style lang="scss" scoped>
.app-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 8px 24px;
  max-width: 1080px;
  margin: 0 auto;
  background: var(--app-color-background);
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
.app-status {
  margin-left: auto;
  padding: 3px 8px;
  font-size: 16px;
  color: var(--app-color-text);
}
.app-github {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  color: var(--app-color-text);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}
</style>
