<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import { Image } from "./components/extensions/Image";
import { Mention } from "./components/extensions/Mention";
import type { ThemeName } from "./types";
import type { LocaleName } from "./locales";
const content = ref("");

content.value = ``;
const theme = ref<ThemeName>("light");
const locale = ref<LocaleName>("zh");
const placeholder = ref("输入 @ 提及成员…");
const maxLength = ref(0);
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
const extensions = [
  Image.configure({
    upload: async (_file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return "https://api.mtyqx.cn/api/random.php";
    },
  }),
  Mention.configure({
    items: mentionUsers,
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
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>

    <div>
      占位
      <input v-model="placeholder" class="app-select" style="width: 160px" />
    </div>

    <div>
      字数上限
      <input v-model.number="maxLength" type="number" class="app-select" style="width: 70px" />
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

  <div style="height: 100vh; width: 80%; margin: 0 auto; padding: 10vh 0">
    <TipTapEditor
      ref="editorRef"
      v-model="content"
      style="height: 60vh"
      :theme="theme"
      :locale="locale"
      :placeholder="placeholder"
      :max-length="maxLength"
      :extensions="extensions"
      autofocus="end"
      @ready="pushStatus('ready')"
      @update="pushStatus('update')"
      @truncated="pushStatus('truncated: max ' + $event.maxLength)"
    />
    <br />
    Content:
    <br />
    <div style="word-break: break-word" v-html="content"></div>
  </div>
</template>

<style lang="scss" scoped>
.app-bar {
  padding: 8px 0;
  width: 80%;
  margin: 0 auto;
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
  font-size: 13px;
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
