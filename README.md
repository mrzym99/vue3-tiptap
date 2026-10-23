# @yumine9/vue3-tiptap

[English](./README.en.md) | 简体中文

Vue 3 富文本编辑器，基于 [@tiptap/vue-3](https://tiptap.dev) 封装：内置自动收集的工具栏、气泡/浮动菜单、主题系统与 i18n；可选的 AI 面板支持对话式改写/扩写、插入表格图片等富文本操作（自带 Agent，接任意 OpenAI 兼容接口即可）。

## 安装

```bash
# pnpm
pnpm add @yumine9/vue3-tiptap
# npm
npm install @yumine9/vue3-tiptap
```

## 引入样式（必须）

库的构建产物把全部组件样式抽成了独立的 `dist/style.css`，JS 不会自动加载它——**需要在使用方引一次**（整个库只需一次），否则功能正常但视觉是坏的（工具栏无布局、弹层错位、placeholder 不显示）：

```ts
import "@yumine9/vue3-tiptap/style.css";
```

单独导出这个文件是刻意的：`index.cjs` 要在 Node/SSR 场景下 `require`（引入 `.css` 会报错），同时消费方保留覆盖样式、自建 CSS 管线的控制权。

## 基本用法

传入 `StarterKit`（全部内置扩展：工具栏、气泡菜单、表格、图片……）；不传 `extensions` 时只有一个裸输入框：

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TipTapEditor, StarterKit } from "@yumine9/vue3-tiptap";
import "@yumine9/vue3-tiptap/style.css";

const content = ref("<p>hello</p>");
const extensions = [StarterKit.configure({})];
</script>

<template>
  <TipTapEditor v-model="content" :extensions="extensions" theme="light" locale="zh" />
</template>
```

或注册为全局组件后直接用 `<TipTapEditor />`：

```ts
import TipTapEditorPlugin from "@yumine9/vue3-tiptap";
app.use(TipTapEditorPlugin);
```

## 扩展

`StarterKit` 包含所有的内置扩展；不需要所有扩展时，可以从包根按需导入使用：

```ts
// 方式一：StarterKit 一把梭
import { StarterKit } from "@yumine9/vue3-tiptap";

const extensions = [StarterKit.configure({})];

// 方式二：按需导入（Document/Paragraph/Text 由组件内置提供，无需自己加）
import { Bold, Image, Video } from "@yumine9/vue3-tiptap";

const extensions = [Bold, Image, Video];
```

所有内置扩展与各自的 `XxxOptions` 类型都从包根导出，可任意组合；禁用某个内置扩展只需传 `false`：`StarterKit.configure({ image: false })`（详见下文两种配置方式的区别）。

### StarterKit 配置 vs 单独扩展配置

两者是同一个扩展的两种配置入口，效果一致，选其一即可：

- `StarterKit.configure({ image: { upload } })`：配置（或传 `false` 禁用）StarterKit 内置的那份扩展； key 是扩展名（如 `image`、`bold`），**不要**再在 `extensions` 里重复传入同名扩展；
- `Image.configure({ upload })`：配置单独导入的扩展实例；用它时从 `StarterKit.configure({ image: false })` 里关掉内置份，避免重复。

```ts
const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];

// 方式一：全部用 StarterKit，按 key 配置/禁用
const extensions = [
  StarterKit.configure({
    mention: {
      items: mentionUsers,
    },
    dragHandle: false, // 禁用某个内置扩展
  }),
];

// 方式二：单独导入并配置
import { Mention } from "@yumine9/vue3-tiptap";
const extensions = [
  Mention.configure({ items: mentionUsers }),
];
```

## 图片上传

给 `Image` 扩展配置 `upload` 函数即可启用图片弹窗里的“上传”选项卡：函数收到 `File`，返回存储后的 URL，其余（预览、插入）由编辑器完成。使用 `StarterKit` 时通过 `configure` 传入：

```ts
import { StarterKit } from "@yumine9/vue3-tiptap";

const extensions = [
  StarterKit.configure({
    image: {
      upload: async (file: File) => {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const { url } = await res.json();
        return url; // 返回可访问的图片地址
      },
    },
  }),
];
```

按需导入时同理：`Image.configure({ upload })`。未配置 `upload` 时，弹窗仅支持粘贴图片 URL。

## Markdown 支持

内置官方 `@tiptap/markdown` 扩展（StarterKit 默认包含；`StarterKit.configure({ markdown: false })` 可禁用），提供 markdown 的导入与导出：

```ts
// 通过 `ready` 事件或模板 ref 的 `editor` 拿到实例后
editor.commands.setContent("# 标题\n\n**加粗**", { contentType: "markdown" });
editor.getMarkdown(); // 导出 markdown 字符串
```

- `insertContent` / `insertContentAt` 同样支持 `{ contentType: "markdown" }`
- 注意：**粘贴** markdown 纯文本不会被自动解析（只处理显式 `contentType` 的输入与导出）

### v-model 直接用 markdown

想让 v-model 进出都是 markdown（当作 markdown 编辑器用）：

```vue
<TipTapEditor v-model="markdown" content-type="markdown" />
```

此时初始内容按 markdown 解析、编辑后写回 markdown 字符串；默认 `"html"`，行为与旧版本完全一致。

## AI 助手

`Ai` 是一个 opt-in 扩展（**不在 StarterKit 内**，需要 API key）：配置后聊天悬浮按钮与抽屉面板自动挂载，不占用工具栏。AI 通过内置工具集直接操作文档（20+ 工具：`set_document`、`insert_content`、`insert_table`、`insert_code_block`、`format_text`、`set_heading`、`find_replace`、`get_outline` 等，按当前已启用的扩展自动裁剪）：

```ts
import { StarterKit, Ai } from "@yumine9/vue3-tiptap";

const extensions = [
  StarterKit.configure({}),
  Ai.configure({
    baseURL: "https://api.openai.com/v1", // 任意 OpenAI 兼容接口
    apiKey: "sk-...",
    model: "gpt-xxx-xxx",
    // 破坏性工具（如 set_document）的确认门；不提供则 fail-safe 拒绝
    confirmDangerous: (tool) => Promise.resolve(window.confirm(`AI 要执行 ${tool.name}，允许吗？`)),
  }),
];
```

- agent 循环内置（OpenAI 兼容 chat completions + tool calling，原生 fetch 零额外依赖），自动管理会话历史与中断
- 其他选项：`systemPrompt`（追加系统提示）、`maxRounds`（单次发送的工具调用轮数上限，默认 25）、`maxHistoryMessages`（保留消息条数上限，默认 60）
- 想自建 UI：headless 层从 `@yumine9/vue3-tiptap/ai` 子路径导出 `createAiToolkit(editor)`、`createEditorAgent()` 与 `AiPanel` 组件，可接任意 LLM

## 常用 props

| prop                          | 说明                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `v-model`                     | 内容字符串，格式由 `contentType` 决定（写入有 150ms 防抖，卸载/flush 时保证同步）                   |
| `contentType`                 | `v-model` 内容格式：`"html"`（默认）或 `"markdown"`（初始解析 + 写回都用 markdown，需保留内置 markdown 扩展） |
| `limit`                       | 字数上限，0 = 不限；超限时**不改动内容**，计数标红并触发 `truncated` 事件                           |
| `readonly`                    | 只读（支持运行时切换）                                                                              |
| `theme`                       | `"light" \| "dark"`                                                                                 |
| `primaryColor`                | 主色（任意 CSS 颜色）；工具栏激活态、主按钮、选区等派生色自动跟随                                   |
| `locale` / `translations`     | `"zh" \| "en"` 或自定义语言包浅合并                                                                 |
| `toolbar`                     | 工具栏布局，TinyMCE 风格字符串如 `"bold italic \| underline"`，undefined = 默认                     |
| `toolbarWrap`                 | 工具栏按钮多行换行（true）而非单行横向滚动（false）                                                 |
| `bubbleMenu` / `floatingMenu` | 选中文字/空行菜单，默认关闭，传 key 才开启，`false` 可动态关；配置项与 `toolbar` 一致，用同一套 key |
| `showInvisibleCharacters`     | 显示隐藏字符（空格、段落标记），默认隐藏                                                            |
| `placeholder`                 | 占位文本，不传时回落到语言包的 `placeholder`                                                        |
| `extensions`                  | 附加扩展数组                                                                                        |

### 事件

| 事件        | 参数                             | 说明                                                  |
| ----------- | -------------------------------- | ----------------------------------------------------- |
| `ready`     | `editor: Editor`                 | 编辑器实例创建完成（只触发一次）                      |
| `focus`     | `{ editor, event, transaction }` | 编辑器获得焦点                                        |
| `blur`      | `{ editor, event, transaction }` | 编辑器失去焦点                                        |
| `update`    | `{ editor, transaction }`        | 内容变化时触发（早于防抖的 v-model 写回）             |
| `truncated` | `{ limit: number }`              | 初始内容超出 `limit` 时触发；内容不会被修改，计数标红 |

### 模板 ref 暴露的方法

| 成员        | 说明                                                       |
| ----------- | ---------------------------------------------------------- |
| `focus()`   | 使编辑器获得焦点                                           |
| `blur()`    | 使编辑器失去焦点                                           |
| `clear()`   | 清空内容                                                   |
| `getHTML()` | 获取当前内容的 HTML 字符串                                 |
| `getJSON()` | 获取当前内容的 JSON 文档                                   |
| `editor`    | 底层 Tiptap `Editor` 实例（可直接调 `commands`、监听事件） |

## Toolbar keys

`toolbar` 的 key 对应扩展名（`extension.name`）。按默认布局分组列出：

| key                                                               | 对应扩展                                                          | 说明                                                 |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| `undo` / `redo`                                                   | `Undo` / `Redo`                                                   | 撤销 / 重做（历史插件由 `UndoRedo` 提供）            |
| `heading`                                                         | `Heading`                                                         | 标题下拉，H1–H6，触发按钮随当前层级换图标            |
| `bulletList`                                                      | `BulletList`（+ `OrderedList` / `TaskList`）                      | 列表下拉：无序 / 有序 / 任务三合一，后两者无独立 key |
| `codeBlock`                                                       | `CodeBlock`                                                       | 代码块                                               |
| `bold` / `italic` / `strike` / `code` / `underline` / `highlight` | `Bold` / `Italic` / `Strike` / `Code` / `Underline` / `Highlight` | 行内样式：加粗、斜体、删除线、行内代码、下划线、高亮 |
| `link`                                                            | `Link`                                                            | 链接，弹窗输入 URL                                   |
| `superscript` / `subscript`                                       | `Superscript` / `Subscript`                                       | 上标 / 下标                                          |
| `textAlign`                                                       | `TextAlign`                                                       | 对齐按钮组（作用于 heading/paragraph）               |
| `image`                                                           | `Image`（+ `FileHandler`）                                        | 图片，弹窗支持本地上传（仅 jpg/png/gif/webp）        |
| `video`                                                           | `Video`                                                           | 视频，YouTube/Bilibili 链接自动转 embed              |
| `audio`                                                           | `Audio`                                                           | 音频                                                 |
| `horizontalRule`                                                  | `HorizontalRule`                                                  | 分隔线                                               |
| `blockquote`                                                      | `Blockquote`                                                      | 引用块（再次点击取消）                               |
| `details`                                                         | `Details`（+ `DetailsSummary` / `DetailsContent`）                | 可折叠内容块                                         |
| `color`                                                           | `Color`（+ `TextStyle`）                                          | 文字颜色菜单                                         |
| `fontFamily` / `fontSize`                                         | `FontFamily` / `FontSize`                                         | 字体 / 字号菜单，触发按钮带当前值，再点一次取消      |
| `table`                                                           | `Table`（+ `TableRow` / `TableHeader` / `TableCell`）             | 表格菜单（插入 + 行列操作）                          |
| `findAndReplace`                                                  | `FindAndReplace`                                                  | 查找替换面板                                         |
| `clearFormatting`                                                 | `ClearFormatting`                                                 | 清除格式                                             |

补充规则：未加载的扩展的 key 会被静默忽略（`undefined` 默认布局时才 console.warn）；`bubbleMenu` / `floatingMenu` 用同一套 key。

## 文档

- [docs/project.md](docs/project.md) — 架构与目录说明
- [docs/style](docs/style) — 主题变量与样式约定
