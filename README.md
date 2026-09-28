# tip-tap-editor

Vue 3 富文本编辑器,基于 [@tiptap/vue-3](https://tiptap.dev) 封装:内置自动收集的工具栏、气泡/浮动菜单、主题系统与 i18n,打包产物零外部依赖(vue 除外)。

## 安装

```bash
pnpm add tip-tap-editor
```

## 引入样式(必须)

库的构建产物把全部组件样式抽成了独立的 `dist/style.css`,JS 不会自动加载它——**需要在使用方引一次**(整个库只需一次),否则功能正常但视觉是坏的(工具栏无布局、弹层错位、placeholder 不显示):

```ts
import "tip-tap-editor/style.css";
```

单独导出这个文件是刻意的:`index.cjs` 要在 Node/SSR 场景下 `require`(引入 `.css` 会报错),同时消费方保留覆盖样式、自建 CSS 管线的控制权。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TipTapEditor } from "tip-tap-editor";
import "tip-tap-editor/style.css";

const content = ref("<p>hello</p>");
</script>

<template>
  <TipTapEditor v-model="content" :limit="500" theme="light" locale="zh" />
</template>
```

或注册为全局组件后直接用 `<TipTapEditor />`:

```ts
import TipTapEditorPlugin from "tip-tap-editor";
app.use(TipTapEditorPlugin);
```

## 挑选扩展

`extensions` prop 传入的扩展会与内置结构合并(同名时后者生效)。`StarterKit` 打包了全部内置扩展,**但不含 Youtube / Twitch**——需要时从包根单独引入:

```ts
import { StarterKit, Youtube, Twitch, Image } from "tip-tap-editor";

const extensions = [StarterKit.configure({}), Youtube, Twitch, Image];
```

所有内置扩展与各自的 `XxxOptions` 类型都从包根导出,可任意组合。

## 常用 props

| prop                      | 说明                                                            |
| ------------------------- | --------------------------------------------------------------- |
| `v-model`                 | HTML 字符串(写入有 150ms 防抖,卸载/flush 时保证同步)          |
| `limit`                   | 字数上限,0 = 不限;超限创建时截断并触发 `truncated` 事件        |
| `disabled`                | 只读(支持运行时切换)                                          |
| `theme` / `themeOverrides`| `"light" \| "dark"` + 自定义 `--tiptap-*` CSS 变量              |
| `locale` / `translations` | `"zh" \| "en" \| "zh-TW"` 或自定义语言包浅合并                  |
| `toolbar`                 | 工具栏布局,TinyMCE 风格字符串如 `"bold italic \| underline"`,undefined = 默认 |
| `toolbarWrap`             | 工具栏按钮多行换行(true)而非单行横向滚动(false)                |
| `bubbleMenu` / `floatingMenu` | 选中文字/空行菜单,默认关闭,传 key 才开启,`false` 可动态关  |
| `showInvisibleCharacters` | 显示隐藏字符(空格、段落标记),默认隐藏                          |
| `placeholder`             | 占位文本,不传时回落到语言包的 `placeholder`                    |
| `extensions`              | 附加扩展数组                                                    |

事件:`ready` / `focus` / `blur` / `update` / `truncated`;模板 ref 暴露 `focus()` / `blur()` / `clear()` / `getHTML()` / `getJSON()` / `editor` 实例。

## 文档

- [docs/PROJECT.md](docs/PROJECT.md) — 架构与目录说明
- [docs/style](docs/style) — 主题变量与样式约定
