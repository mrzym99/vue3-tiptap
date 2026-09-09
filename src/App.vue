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
  padding: 8px;
  width: 100%;
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
</style>
