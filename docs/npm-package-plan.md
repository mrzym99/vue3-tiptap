# 组件库化（npm 包）方案

> 目标：将 `@yumine/vue3-tiptap` 从「应用」改造为「Vue3 组件库」，`npm install` 后 `import { TipTapEditor } from "@yumine/vue3-tiptap"` 即可使用。

## ✅ 执行状态

| 项                                          | 状态                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| i18n 解耦（内置轻量，移除 vue-i18n）        | ✅ 已完成（`src/locales/index.ts` + `provide/inject`，4 个组件改为 `useTiptapLocale()`，演示页同步改造）       |
| 库入口 `src/index.ts`                       | ✅ 已完成（导出组件/扩展/主题/类型 + Vue Plugin）                                                              |
| library 构建                                | ✅ 已完成（`vite.lib.config.ts` + `tsconfig.lib.json` + `pnpm build:lib` → dist: index.js/cjs/d.ts/style.css） |
| package.json（peerDeps/exports/files/脚本） | ✅ 已完成（vue/naive-ui → peer；scripts.build:lib/prepublishOnly）                                             |
| 本地宿主验证                                | ✅ 已完成（`examples/host` 用 `file:` 链接，import + build + dev 均通过）                                      |
| 实际发布 npm                                | ⏳ 待执行（`npm publish` 或私有源）                                                                            |

## 0. 现状盘点

| 项        | 现状                                                                                                                      | 库化要求                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 组件入口  | `src/components/index.vue`（已具备 modelValue/limit/disabled/theme/placeholder/autofocus props）                      | 需要导出                                        |
| i18n      | `src/plugins/i18.ts` 全局单例 + 4 个组件裸用 `useI18n()`（url-popover-button / RenderItem / bubble-menu / floating-menu） | **必须解耦**（宿主可能没有 vue-i18n）           |
| naive-ui  | devDependencies，组件内显式 import                                                                                        | 应改为 **peerDependency**（宿主提供）           |
| vue       | dependencies                                                                                                              | 应改为 **peerDependency**                       |
| @tiptap/* | dependencies                                                                                                              | 保留 dependencies（库自带编辑器内核）           |
| vue-i18n  | dependencies                                                                                                              | 移除或内置（见 §2）                             |
| 样式      | scoped SCSS + 全局 style.scss/reset.scss + CSS 变量主题                                                                   | scoped 打包；**全局样式不进库**；主题由组件应用 |
| 构建      | vite 应用模式（index.html）                                                                                               | 需要 **library 模式**（ES+CJS+d.ts）            |

## 1. 库入口 `src/index.ts`

```ts
export { default as TipTapEditor } from "./components/index.vue";
export type { TipTapEditorProps } from "./types";
export type { ThemeName } from "./types";
export { applyTheme, themeOverrides } from "./theme";
export { default as builtinExtensions } from "./components/extensions";
export * from "./types";
```

## 2. i18n 解耦（推荐：内置轻量 i18n，去掉 vue-i18n）

**方案 A（推荐）：内置轻量 i18n，零额外依赖**

- 新建 `src/locales/index.ts`：
  - 翻译表（zh/en，已存在）
  - `reactive` 的 locale 状态 + `t(key)` 函数
  - 默认语言检测：`navigator.language`（不再依赖 localStorage/全局单例）
- 根组件 `TipTapEditor` `provide` locale 上下文（locale 状态 + t + setLocale）
- 4 个 `useI18n()` 组件改为 `inject`（新 composable `useTiptapLocale()`）
- **移除 vue-i18n 依赖** → 宿主零 i18n 要求

**方案 B：保留 vue-i18n，组件内 createI18n**

- 根组件内 `createI18n({ legacy: false, messages: { zh, en } })` + `provide(ComposerInjectionKey, composer)`
- 现有 `useI18n()` 子组件代码不用改（inject 优先）
- 代价：vue-i18n 保持 dependencies，宿主间接被引入 vue-i18n

## 3. package.json 改造

```json
{
  "name": "@yumine/vue3-tiptap",
  "version": "1.0.0",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist"],
  "peerDependencies": {
    "vue": "^3.5.0",
    "naive-ui": "^2.44.0"
  },
  "dependencies": {
    "@tiptap/core": "^3.30.1",
    "@tiptap/pm": "^3.30.1",
    "@tiptap/vue-3": "^3.30.1",
    "@tiptap/extension-*": "^3.30.1",
    "@remixicon/vue": "^4.9.0"
  },
  "devDependencies": { "sass", "vite", "vue-tsc", ... }
}
```

要点：
- vue / naive-ui 移到 **peerDependencies**
- sass 留在 devDependencies（构建时编译 scss，产物是 css，宿主不需要 sass）
- `pnpm-workspace.yaml` 的 overrides（prosemirror-model）保留在**发布包外**（workspace 级），但宿主若用 pnpm 也可能遇到重复 model——文档里提示

## 4. 构建配置 `vite.lib.config.ts`

```ts
build: {
  lib: {
    entry: "src/index.ts",
    formats: ["es", "cjs"],
    fileName: (f) => (f === "es" ? "index.js" : "index.cjs"),
  },
  cssCodeSplit: false,        // 单 style.css
  rollupOptions: {
    external: ["vue", "naive-ui", /^@tiptap\//, "@remixicon/vue"],
  },
},
```
- d.ts：`vue-tsc --declaration --emitDeclarationOnly` 生成到 dist
- 新增脚本：
  ```json
  "build:lib": "vue-tsc -p tsconfig.lib.json --emitDeclarationOnly && vite build --config vite.lib.config.ts",
  "prepublishOnly": "pnpm build:lib"
  ```

## 5. 使用方式（宿主项目）

```bash
npm i @yumine/vue3-tiptap naive-ui vue
```

```vue
<script setup lang="ts">
import { TipTapEditor } from "@yumine/vue3-tiptap";
import "@yumine/vue3-tiptap/style.css"; // 若构建未自动注入 CSS
import { ref } from "vue";
const content = ref("<p>hello</p>");
</script>

<template>
  <TipTapEditor
    v-model="content"
    :limit="1000"
    theme="light"
    locale="zh"
    placeholder="请输入内容…"
  />
</template>
```

## 6. 发布

```bash
pnpm build:lib
npm publish            # 公开 npm
# 或私有：npm publish --registry https://your-registry
# 或本地验证：在宿主项目 "@yumine/vue3-tiptap": "file:../@yumine/vue3-tiptap"
```

## 7. 风险与注意

| 风险                   | 说明 / 对策                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| naive-ui peer          | 宿主必须装 naive-ui；样式由宿主按需引入（naive-ui 自带样式机制）                                                                    |
| 主题变量全局性         | `applyTheme` 写 `document.documentElement`，同页多实例不同主题互相覆盖——库化时可加 `scope` 支持（CSS 变量写在组件根节点），本期可选 |
| 扩展全量打包           | bundle 偏大（~370KB gzip，含全部扩展）。可选：导出 `createEditor` 工厂 + 按需扩展列表                                               |
| prosemirror-model 重复 | 发布包无法强制宿主的 pnpm overrides；文档提示宿主若遇 `loaded more than once` 警告需加 overrides/dedupe                             |
| 全局样式隔离           | style.scss（html/body 过渡色）与 reset.scss 不进库——它们是演示页样式，不是组件样式                                                  |

## 8. 可选增强（后续）

- 按需引入：`import { TipTapEditor, Bold, Heading } from "@yumine/vue3-tiptap"` + `:extensions="[Bold, Heading]"`
- vitest 单元测试
- Storybook / playground 文档站
- 主题 scope 支持（多实例异主题）
