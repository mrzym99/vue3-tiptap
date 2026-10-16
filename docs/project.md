# @yumine/vue3-tiptap 项目文档

## 1. 项目简介

`@yumine/vue3-tiptap` 是一个基于 **TipTap**（`@tiptap/vue-3`）与 **Vue 3** 构建的富文本编辑器组件，内置可扩展的工具栏 UI。项目采用「扩展即配置」的设计理念：每一个编辑能力（加粗、斜体、下划线、引用、文本对齐等）都是一个 TipTap 扩展，同时通过扩展的 `button` 选项声明自己的工具栏按钮，工具栏会自动收集并渲染这些按钮，实现**功能与 UI 的自动绑定**。

当前项目形态为一个可运行、可演进的 Demo / 组件原型，`App.vue` 中演示了组件的 `v-model` 双向绑定、`limit` 字数限制、主题切换与中英文切换等能力。

## 2. 技术栈

| 分类        | 技术                                          | 说明                                      |
| ----------- | --------------------------------------------- | ----------------------------------------- |
| 框架        | Vue 3.5（`<script setup>` + Composition API） | 应用与组件框架                            |
| 编辑器内核  | TipTap 3.30（`@tiptap/vue-3` / `@tiptap/pm`） | 基于 ProseMirror 的编辑器                 |
| 构建工具    | Vite 8                                        | 开发服务器与打包                          |
| 语言        | TypeScript ~6.0                               | 全量类型约束                              |
| UI 基础组件 | 自研（@floating-ui/dom 定位）                 | Popover/Tooltip/菜单/色板，零 UI 框架依赖 |
| 图标        | @remixicon/vue                                | 工具栏图标                                |
| 国际化      | 内置轻量 i18n（zh/en + provide/inject）       | 不依赖 vue-i18n，宿主零要求               |
| 样式        | SCSS（sass） + CSS 变量主题体系               | 浅色 / 深色 / 自定义主题，变量作用域化    |
| 包管理      | pnpm                                          | 依赖管理                                  |

## 3. 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建（vue-tsc 类型检查 + vite build）
pnpm build

# 预览构建产物
pnpm preview
```

> 项目根目录存在 `pnpm-workspace.yaml`（目前仅允许 esbuild 构建），以 pnpm 为首选包管理器。

## 4. 目录结构

```
@yumine/vue3-tiptap/
├── index.html                  # 入口 HTML（演示页）
├── package.json                # 依赖与脚本（含 build:lib 库构建）
├── vite.config.ts              # 应用构建配置（别名 @ -> src、自动导入、dedupe）
├── vite.lib.config.ts          # 库构建配置（ESM/CJS + 单 CSS）
├── tsconfig.json               # TypeScript 工程引用
├── tsconfig.lib.json           # 库 d.ts 生成配置
├── auto-imports.d.ts           # unplugin-auto-import 生成的类型声明
├── public/                     # 静态资源（favicon、icons）
├── dist/                       # 应用/库构建产物
├── examples/host/              # 本地宿主验证示例（file: 链接消费库）
└── src/
    ├── index.ts                # ★ 库入口（组件/扩展/主题/类型 + Vue Plugin）
    ├── main.ts                 # 应用入口（演示页）
    ├── App.vue                 # 演示页：主题/语言切换 + 编辑器示例
    ├── style.scss / reset.scss # 全局样式与重置（SCSS，仅演示页）
    ├── components/
    │   ├── index.vue           # ★ 核心导出组件 TipTapEditor
    │   ├── composables/        # useEditorModel（v-model 绑定 / 超限警告）等
    │   ├── utils/              # 工具函数（button / video-url / storage 等）
    │   ├── extensions/         # 自定义 TipTap 扩展（每个扩展自带工具栏按钮）
    │   │   ├── index.ts        # 扩展集合入口
    │   │   ├── Bold / Italic / Strike / Underline / Code / Highlight
    │   │   ├── Subscript / Superscript / Heading / HorizontalRule
    │   │   ├── BulletList / OrderedList / TaskList / Link / CodeBlock / Details
    │   │   ├── Image / Youtube / Audio / Twitch / FileHandler
    │   │   ├── TextStyle / Color / FontFamily / Typography / Table
    │   │   ├── FindAndReplace / InvisibleCharacters / NodeRange
    │   │   ├── Undo / Redo / UndoRedo / ClearFormatting
    │   │   ├── Blockquote / TextAlign / HardBreak（每扩展一个文件）
    │   ├── ui-editor/          # 编辑器 UI 层
    │   │   ├── toolbar/        # 工具栏（自动收集扩展按钮）
    │   │   │   ├── buttons/         # 简单功能按钮（加粗/撤销/清除格式等）
    │   │   │   ├── menu-buttons/    # 下拉菜单按钮（标题/对齐/颜色/字体/表格）
    │   │   │   ├── dialog-buttons/  # 模态对话框插入（图片/视频/YouTube/音频/Twitch/链接）
    │   │   │   └── render-item/     # 按扩展 button 声明动态渲染按钮
    │   │   ├── bubble-menu/    # 气泡菜单（格式条 + 浮动菜单 + extension 声明的气泡工具栏）
    │   │   ├── editor-content/ # 编辑区容器与内容样式
    │   │   └── character-limit/ # 字数上限计数器（123 / 500，右下角）
    │   └── ui-common/          # 通用 UI 基础组件（自研，零 UI 框架依赖）
    │       ├── action-button/      # 工具栏基础按钮（含 tooltip/active 态）
    │       ├── action-menu-button/ # 下拉菜单按钮
    │       ├── action-dialog-button/ # 打开模态对话框的工具栏按钮（媒体插入复用）
    │       ├── dialog/             # 居中模态对话框（遮罩 + Esc/遮罩点击关闭）
    │       ├── popover/            # 通用弹层（@floating-ui/dom 定位、外部点击/Esc 关闭）
    │       ├── tooltip/            # 悬停提示
    │       └── theme-provider/     # 主题提供者（CSS 变量作用域化）
    ├── theme/                  # 主题体系（CSS 变量）
    │   ├── base.ts / light.ts / dark.ts / index.ts / overwirte.ts
    ├── locales/                # 内置轻量 i18n（zh/en 语言包 + context/inject）
    │   ├── index.ts / zh.ts / en.ts
    ├── types/                  # 全局类型定义（扩展选项、按钮视图、主题等）
    └── utils/
        └── resizableMediaView.ts  # 媒体四角拖拽改尺寸的公共 NodeView（复用 ResizableNodeView，Image/Video 共用）
```

## 5. 核心特性

### 5.1 组件 API（`src/components/index.vue`）

| 属性          | 类型                | 默认值      | 说明                       |
| ------------- | ------------------- | ----------- | -------------------------- |
| `v-model`     | `string`            | 必填        | 编辑器 HTML 内容，双向绑定 |
| `limit`  | `number`            | `0`（不限） | 最大字数提示；超出时计数变红并 emit `truncated`，**不修改内容**（数据保真，由宿主处理） |
| `disabled`    | `boolean`           | `false`     | 是否禁用编辑（只读）       |
| `theme`       | `'light' \| 'dark'` | `'light'`   | 主题模式                   |
| `placeholder` | `string`            | `-`         | 空文档时显示的占位文本     |
| `autofocus`   | `boolean`           | `false`     | 挂载后是否自动聚焦         |
| `toolbarWrap` | `boolean`           | `false`     | 工具栏按钮多行换行（false 时单行横向滚动） |

事件：`focus` / `blur`（payload 为 `{ editor, event }`，类型来自 `EditorEvents`）。

组件内部逻辑：

- 通过 `useEditor` 创建编辑器实例，注册 `Document` / `Paragraph` / `Text` / `Placeholder` 及自定义扩展；
- `onCreate` 中：若编辑器创建前 `v-model` 已变化则先 `setContent` 同步；初始内容超限时仅 emit `truncated`，**不修改内容**（2026-10-16 决策：数据保真）；
- `onUpdate` 中 `editor.getHTML()` 写回 `v-model` 采用 **150ms 防抖**（避免大文档每键 O(n) 序列化；组件卸载时 flush 未写回的内容）；
- 监听 `v-model` 外部变化（与编辑器当前 HTML 不一致时）通过 `setContent` 同步，编辑器未就绪时暂存、`onCreate` 后应用；
- 监听 `disabled` 变化调用 `setEditable` 切换只读；
- 底部展示实时字数统计 `当前字数 / 最大字数`（基于 `CharacterCount` 扩展，增量计算）。

### 5.2 扩展即按钮的工具栏机制（核心设计）

每个自定义扩展在 `addOptions()` 中注入一个 `button` 选项，返回按钮组件与组件属性：

```ts
export const Bold = TiptapBold.extend<BoldOptions>({
  addOptions() {
    return {
      ...(this.parent?.() as TiptapBoldOptions),
      button: ({ editor, t }) => ({
        component: BoldButton,
        componentProps: { editor, t },
      }),
    };
  },
});
```

工具栏（`tool-bar/index.vue`）通过 `editor.extensionManager.extensions.filter(ext => ext.options.button)` **自动收集所有声明了 `button` 的扩展**，再由 `RenderItem.vue` 动态渲染对应按钮组件。因此**新增一个编辑功能只需添加一个扩展文件，无需改动工具栏代码**。

> 类型层面，`src/types/index.ts` 定义了 `GeneralOptions`、`ButtonView`、`ButtonViewReturn` 等类型，为扩展声明 `button` 提供类型约束；`ButtonView` 可返回单个按钮或按钮数组，`RenderItem` 支持两种形态。翻译函数统一使用 `TranslateFn` 类型（兼容 vue-i18n 的 `t` 基本签名）。工具栏按钮布局的唯一事实来源是 `defaultToolbar` 字符串（`src/types/index.ts`），其 key 需与各扩展 `name` 逐一对应。

### 5.3 按钮组件体系

- **`ActionButton`**（action-button）：基础工具栏按钮（自研，基于 `ui-common/button` + `tooltip`），支持 `action`、`isActive`（激活态）、`disabled`、`icon`、`tooltip`，图标使用 RemixIcon；
- **`ActionMenuButton`**（action-menu-button）：带下拉菜单的按钮（基于自研 `popover`），用于文本对齐等多项选择类功能，自动高亮当前激活项并同步主按钮图标；
- **按钮示例**：`BoldButton.vue` 等仅负责把编辑器命令（`toggleBold` 等）映射到 `ActionButton` 上。

### 5.4 主题体系

- `theme/base.ts`：基础尺寸 / 圆角 / 间距变量；
- `theme/light.ts` / `theme/dark.ts`：浅色、深色的颜色变量；
- `theme/index.ts`：`applyTheme()` 将主题 CSS 变量写入 `document.documentElement` 的 style 上；
- `theme/index.ts`：`applyTheme()` 将主题 CSS 变量写入目标元素（默认 `document.documentElement`，组件内传根节点实现**作用域化**——多实例不同主题互不干扰）；
- `theme-provider`：根据 `theme` prop 应用变量（支持 `'light' | 'dark'`）；
- **自定义变量叠加**：`themeOverrides` prop（`Theme` 类型，键为 `--tiptap-*` 变量名）叠加在内置主题之上，优先级最高，可覆盖颜色或尺寸变量，如 `{ "--tiptap-color-bg": "#FAFAFA" }`；`applyTheme(name, target?, overrides?)` 第三个参数同效。

所有主题变量以 `--tiptap-*` 前缀命名，类型由 `src/types/theme.ts` 约束（`--tiptap-${string}`）。

### 5.5 国际化（i18n）

- **内置轻量 i18n，不依赖 vue-i18n**：`src/locales/index.ts` 提供自包含的 `LocaleContext`（响应式 `locale` + `t(key)` + `setLocale` + `setTranslations`）；
- `TipTapEditor` 组件通过 `locale` prop 控制语言（内置 `'zh' | 'en'`，缺省时按浏览器语言自动检测），并用 `provide` 注入子树；
- **宿主可扩展语言包**：`translations` prop（`Record<locale, LocaleMessages>`）浅合并进内置语言包——可覆盖 `'zh'` / `'en'` 的任意文案，也可新增语言（如 `translations: { fr: { bold: "Gras" } }` 配合 `locale: "fr"`），响应式更新；
- 子组件通过 `useTiptapLocale()` 读取（`RenderItem`、`bubble-menu`、`floating-menu`、`url-popover-button`）；
- 语言包位于 `src/locales/zh.ts` / `en.ts`，覆盖全部工具栏词条；
- 扩展按钮通过扩展 `button` 回调中的 `t` 函数获取翻译文本。

### 5.6 编辑区样式

`editor-content/index.vue` 内置了编辑器内容区的样式：表格（`table` / `td` / `th` / 单元格选中 / 列宽调整手柄）、引用块（`blockquote`）、空文档占位文本（`p.is-editor-empty:first-child::before`，配合 `placeholder` prop）等，全部使用主题 CSS 变量，随主题自动切换。

## 6. 当前已支持的编辑能力

| 扩展                         | 来源                                                                  | 工具栏形态                            |
| ---------------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| Bold 加粗                    | 自定义（基于 @tiptap/extension-bold）                                 | 图标按钮                              |
| Italic 斜体                  | 自定义（基于 @tiptap/extension-italic）                               | 图标按钮                              |
| Underline 下划线             | 自定义（基于 @tiptap/extension-underline）                            | 图标按钮                              |
| Strike 删除线                | 自定义（基于 @tiptap/extension-strike）                               | 图标按钮                              |
| Code 行内代码                | 自定义（基于 @tiptap/extension-code）                                 | 图标按钮                              |
| Highlight 高亮               | 自定义（基于 @tiptap/extension-highlight）                            | 图标按钮                              |
| Subscript 下标               | 自定义（基于 @tiptap/extension-subscript）                            | 图标按钮                              |
| Superscript 上标             | 自定义（基于 @tiptap/extension-superscript）                          | 图标按钮                              |
| Heading 标题                 | 自定义（基于 @tiptap/extension-heading，H1/H2/H3）                    | 下拉菜单按钮（正文/H1/H2/H3）         |
| BulletList 无序列表          | 自定义（基于 @tiptap/extension-list）                                 | 图标按钮                              |
| OrderedList 有序列表         | 自定义（基于 @tiptap/extension-list）                                 | 图标按钮                              |
| TaskList 任务列表            | 自定义（基于 @tiptap/extension-list）                                 | 图标按钮                              |
| Link 链接                    | 自定义（基于 @tiptap/extension-link，自动识别/粘贴链接）              | 弹窗按钮（输入 URL）                  |
| CodeBlock 代码块             | 自定义（基于 @tiptap/extension-code-block）                           | 图标按钮                              |
| Details 折叠块               | 自定义（基于 @tiptap/extension-details）                              | 图标按钮                              |
| Image 图片                   | 自定义（基于 @tiptap/extension-image）                                | URL 弹窗按钮（也可拖拽/粘贴图片文件）；四角拖拽改尺寸 |
| Video 视频                   | 自定义（基于 @tiptap/extension-video，URL 自动转嵌入）                 | URL 弹窗按钮；四角拖拽改尺寸          |
| Youtube 视频                 | 自定义（基于 @tiptap/extension-youtube）                              | URL 弹窗按钮                          |
| Audio 音频                   | 自定义（基于 @tiptap/extension-audio）                                | URL 弹窗按钮                          |
| Twitch 直播                  | 自定义（基于 @tiptap/extension-twitch）                               | URL 弹窗按钮                          |
| Color 文字颜色               | 自定义（基于 @tiptap/extension-text-style 的 Color）                  | 颜色选择菜单（色板 + 自定义色值）     |
| FontFamily 字体              | 自定义（基于 @tiptap/extension-text-style 的 FontFamily）             | 下拉菜单（无衬线/衬线/等宽/雅黑）     |
| Table 表格                   | 自定义（基于 @tiptap/extension-table 的 TableKit，可调整列宽）        | 下拉菜单（插入/行列/合并/表头/删除）  |
| FindAndReplace 查找替换      | 自定义（基于 @tiptap/extension-find-and-replace）                     | 弹窗面板（查找/替换/全部/前后跳转）   |
| InvisibleCharacters 隐藏字符 | 自定义（基于 @tiptap/extension-invisible-characters）                 | 图标按钮（切换）                      |
| BubbleMenu 气泡菜单          | @tiptap/vue-3 的 BubbleMenu 组件                                      | 选中文字浮现格式条                    |
| FloatingMenu 浮动菜单        | @tiptap/vue-3 的 FloatingMenu 组件                                    | 空行左侧浮现插入菜单                  |
| HorizontalRule 分隔线        | 自定义（基于 @tiptap/extension-horizontal-rule）                      | 图标按钮                              |
| Typography 排版替换          | @tiptap/extension-typography                                          | 无按钮（智能替换）                    |
| Focus 聚焦高亮               | @tiptap/extension-focus                                               | 无按钮（聚焦块描边）**默认未启用**    |
| Undo 撤销 / Redo 重做        | 自定义（基于 @tiptap/extension-undo-redo）                             | 图标按钮 ×2（含禁用态）               |
| ClearFormatting 清除格式     | 自定义                                                                 | 图标按钮                              |
| CharacterCount 字数统计      | @tiptap/extensions 的 CharacterCount                                   | 无按钮（底部实时统计）                |
| Gapcursor / Dropcursor / TrailingNode | @tiptap/extensions                                            | 无按钮（光标兜底/拖拽落点/末尾段落）  |
| Blockquote 引用              | 自定义（基于 @tiptap/extension-blockquote）                           | 图标按钮                              |
| TextAlign 文本对齐           | 自定义（基于 @tiptap/extension-text-align，作用于 heading/paragraph） | 下拉菜单按钮（左/中/右/两端）         |
| HardBreak 硬换行             | @tiptap/extension-hard-break（Shift+Enter）                           | 无按钮（快捷键）                      |
| Mention 提及 @               | 自定义（基于 @tiptap/extension-mention + @tiptap/suggestion）          | 无按钮（输入 @ 触发建议弹层，数据源由宿主 `items` 注入） |

## 7. 设计要点与约定

1. **功能与 UI 解耦**：扩展定义能力，`button` 选项定义 UI，工具栏只做「收集 + 渲染」；
2. **HTML 作为交换格式**：`v-model` 传递 HTML 字符串，编辑器中仅注册基础节点（Document / Paragraph / Text），复杂内容由扩展补齐；
3. **可插拔扩展集**：`src/components/extensions/index.ts` 是扩展的唯一入口，新增能力在此注册即可；
4. **统一主题变量**：所有 UI 颜色、尺寸均通过 `--tiptap-*` CSS 变量驱动（基础 token + 语义 token），主题可作用域到组件根节点；
5. **完整的类型约束**：扩展选项、按钮视图等均有对应 TS 类型（`src/types/`），开发时享受类型提示。

### 7.1 数据写入行为说明（重要）

本库承诺**只提供 UI 与交互**，除以下列出的行为外不会修改文档数据；所有 `getHTML()` / `getJSON()` 原样透传，无自定义序列化 / 净化 / 属性注入。

以下行为会写入文档数据，宿主需知晓：

| 行为 | 触发方式 | 说明 |
| --- | --- | --- |
| 超限警告 | 创建时（`limit` + `modelValue` 超限） | **不修改内容**，仅 emit `truncated` 事件 + 计数提示变红，由宿主决定如何处理 |
| 末尾补空段落 | 任何使文档末尾变为非段落块的操作 | Tiptap 官方 `TrailingNode` 行为（Notion 式 UX），保证光标可移到末块下方；`getJSON()` 会包含尾段落 |
| 粘贴视频 URL 重写 | 用户粘贴视频链接 | 匹配视频 URL 时替换为 `video` 节点，`src` 存储为 embed 地址（`toEmbedUrl()`），非用户粘贴原文 |
| 排版替换 | 用户输入 | Tiptap 官方 `Typography`：直引号→弯引号、`--`→–、`->`→→ 等 |
| 自动链接 | 用户输入 / 粘贴 | Tiptap 官方 `Link`：`autolink` + `linkOnPaste`，输入或粘贴 URL 自动加链接 mark |
| 图片粘贴/拖放 | 用户操作 | 文件读为 base64 data-URL 存入文档（仅 jpeg/png/gif/webp，**不允许 SVG** 以避免存储型 XSS） |
| 列表键位 | 用户按键 | Tiptap 官方 `ListKeymap`：列表内 Enter/Backspace/Tab 会执行合并 / 提升 / 缩进等非显然操作 |
| 媒体尺寸持久化 | 用户拖拽调尺寸 | 拖拽结束后 `updateAttributes` 将 px 尺寸写入节点属性 |

除上表外，所有命令均在用户点击 / 按键回调中执行；DragHandle 的 `appendTransaction` 仅恢复选区，不改文档。

## 8. 扩展建议 / 路线图

- **最新评审见 `docs/feature-gaps-and-optimizations.md`**：汇编了「编辑器还缺什么插件」与「性能 / 响应式 / 无障碍 / 文档漂移」的整体优化清单。P0（Undo/Redo、清除格式、字符统计）、v-model 写回防抖与 Mention 提及已完成；剩余 P1：字体大小、Emoji、Markdown、目录、块级拖拽等。
- 可继续接入（对应扩展文件已就绪或可按需新增）：列表（有序/无序/任务）、链接 Link、图片 Image、表格 Table、代码块、气泡菜单、查找替换、Emoji、@提及、数学公式等；集成清单与分阶段计划见 `docs/tiptap-extensions-integration-plan.md`；
- `StarterKit` 已作为依赖引入但暂未启用，可按需替换当前的逐节点注册方式；
- 可抽取为独立 npm 包 / Vue 组件库，暴露统一的扩展注册 API；`src/index.ts` 已命名导出全部内置扩展（`Mention` / `Image` 等）与 `StarterKit`；
- **显式引入扩展**（2026-09-12 决策，对齐 tiptap 模式）：组件**不再自动包含内置扩展**，由宿主通过 `extensions` prop 选择——一键全量用 `StarterKit.configure({...})`（`false` 禁用某项，对象配置某项，如 `{ twitch: false, image: { upload } }`），或手动逐个 `import`（如 `[Bold, Mention.configure({ items })]`）；同名冲突后者胜出；Document / Paragraph / Text / Placeholder 结构核心始终由组件提供；
- `Focus`（聚焦高亮）**默认不在 StarterKit 中**（2026-09-07 决策）：非活动块淡化可能干扰部分宿主场景，依赖与样式已就绪，需要时去掉 `src/components/extensions/index.ts` 中两处注释即可启用，详见 `docs/feature-gaps-and-optimizations.md` 决策记录；
- 可补充 TableKit（可调整列宽）等高级能力的完整 UI。

## 9. 已知事项

- 演示页 `App.vue` 中初始内容为占位文本，正式使用时应由业务方传入；
- 代码中存在部分被注释的扩展/表格代码（`StarterKit`），属于演进中的预留能力；
- 字数限制与字数统计统一使用「可见字符数」口径（`CharacterCount`，不含换行与 HTML 标签）：**按 Enter 换行不计入字数**；超限**不自动截断**（2026-10-16 决策：数据保真——计数变红 + emit `truncated`，由宿主决定如何处理）；
- `InvisibleCharacters`（隐藏字符）默认关闭（`visible: false`），需点击工具栏按钮手动开启——该扩展官方默认是 `visible: true`，直接注册会导致每个段落显示 ¶ 标记；
- `pnpm-workspace.yaml` 中配置了 `overrides: prosemirror-model: ^1.25.11`，且 `vite.config.ts` 的 `resolve.dedupe` 强制 `prosemirror-model` / `@tiptap/pm` / `@tiptap/core` 等单一副本：双重保险避免出现多份 `prosemirror-model`（ProseMirror 官方警告：重复副本会导致「节点拆分/包裹失败」，表现为按 Enter 无法换行，报 `Can not convert ... to a Fragment (looks like multiple versions of prosemirror-model)`）；

---

*本文档基于项目当前代码状态整理，随项目演进需同步更新。*
