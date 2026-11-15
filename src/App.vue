<script setup lang="ts">
import TipTapEditor from "./components/index.vue";
import { StarterKit, Ai, Mathematics } from "./components/extensions";
import type { LocaleTranslations } from "./locales";
import zhTW from "../demo/zh-TW";
import { useDemoConfig } from "../demo/useDemoConfig";

const DEFAULT_CONTENT: string = `<h1>Getting started</h1>
<p>欢迎使用 <code>@yumine9/vue3-tiptap </code>—— 一个基于 <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev">Tiptap</a> 的 Vue 3 富文本编辑器组件库，内置常用格式化与排版工具，开箱即用。</p>
<p>试试这些基础标记：<strong>加粗</strong>、<em>斜体</em>、<s>删除线</s>、<u>下划线</u>、<code>行内代码</code> 和 <mark>高亮</mark>，也可以用快捷键 ⌘/Ctrl+B / ⌘/Ctrl+I 完成大部分操作。🪄</p>
<h2>功能一览</h2>
<ul>
  <li>
    <p>完全响应式的编辑器，支持常见格式化与排版</p>
  </li>
  <li>
    <p>上标（x<sup>2</sup>）与下标（H<sub>2</sub>O），适合公式与化学式</p>
  </li>
</ul>
<ul>
  <li>
    <p>表格、任务列表、可折叠区块</p>
  </li>
  <li>
    <p>图片、视频、音频与文件上传，支持自定义上传接口</p>
  </li>
</ul>
<h2>表格</h2>
<table style="min-width: 50px;">
  <colgroup>
    <col style="min-width: 25px;">
    <col style="min-width: 25px;">
  </colgroup>
  <tbody>
    <tr>
      <th colspan="1" rowspan="1">
        <p>特性</p>
      </th>
      <th colspan="1" rowspan="1">
        <p>状态</p>
      </th>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">
        <p>深色主题</p>
      </td>
      <td colspan="1" rowspan="1">
        <p>✅ 支持</p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">
        <p>国际化</p>
      </td>
      <td colspan="1" rowspan="1">
        <p>✅ zh / en，可扩展</p>
      </td>
    </tr>
    <tr>
      <td colspan="1" rowspan="1">
        <p>字数统计</p>
      </td>
      <td colspan="1" rowspan="1">
        <p>✅ 内置 CharacterCount</p>
      </td>
    </tr>
  </tbody>
</table>
<h2>图片</h2>
<p>图片支持对齐与缩放，上传接口由宿主注入：</p><img src="https://api.img.mtyqx.cn/api/large/0072Vf1pgy1foxk7k489xj31kw0w0e3a.jpg" alt="demo image">
<blockquote>
  <p>使内容更具吸引力、更专业 —— 加图片、调对齐、用进阶格式写出有表现力的文档。</p>
</blockquote>
<hr>
<h3>Make it your own</h3>
<p style="text-align: center;">浅色 / 深色主题一键切换，用 CSS 变量把编辑器的外观调整成你产品的样子。</p>
<p style="text-align: center;"><strong>现在就试试上面的工具栏吧 →</strong></p>`;

const content = ref(DEFAULT_CONTENT);

const { theme, lang } = useDemoConfig();
const translations: LocaleTranslations = { "zh-TW": zhTW };
const limit = ref(0);

const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];
const extensions = [
  StarterKit.configure({
    imageUpload: {
      limit: 3,
      maxSize: 5 * 1024 * 1024,
    },
    link: {
      protocols: ["mailto", "tel"],
      validate: (url) => /^(https:\/\/(www\.)?(github\.com|bilibili\.com)(\/|$)|mailto:|tel:)/i.test(url),
      validateMessage: "支持 GitHub / Bilibili 链接（mailto:/tel: 也可以）",
    },
    mention: {
      items: mentionUsers,
    },
    dragHandle: false,
    lineHeight: {
      lineHeights: ["1.5", "1.7", "2", "2.4", "3"],
    },
    codeBlock: {
      languages: ["javascript", "typescript"],
    },
  }),
  Ai.configure({
    baseURL: import.meta.env.VITE_AI_BASE_URL,
    apiKey: import.meta.env.VITE_AI_API_KEY,
    model: import.meta.env.VITE_AI_MODEL,
    confirmDangerous: (tool) => Promise.resolve(window.confirm(`AI 要执行 ${tool.name}，允许吗？`)),
  }),
  Mathematics,
];
</script>

<template>
  <div class="container">
    <TipTapEditor
      ref="editorRef"
      v-model="content"
      :theme="theme"
      :lang="lang"
      :translations="translations"
      :limit="limit"
      :extensions="extensions"
      bubble-menu="bold italic highlight link"
      toolbar-wrap
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  min-width: 880px;
}

:deep(.tiptap) {
  max-width: 800px;
}
</style>
