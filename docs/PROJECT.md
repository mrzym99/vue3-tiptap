# tip-tap-editor 项目文档

## 1. 项目简介

`tip-tap-editor` 是一个基于 **TipTap**（`@tiptap/vue-3`）与 **Vue 3** 构建的富文本编辑器组件，内置可扩展的工具栏 UI。项目采用「扩展即配置」的设计理念：每一个编辑能力（加粗、斜体、下划线、引用、文本对齐等）都是一个 TipTap 扩展，同时通过扩展的 `button` 选项声明自己的工具栏按钮，工具栏会自动收集并渲染这些按钮，实现**功能与 UI 的自动绑定**。

当前项目形态为一个可运行、可演进的 Demo / 组件原型，`App.vue` 中演示了组件的 `v-model` 双向绑定、`max-length` 字数限制、主题切换与中英文切换等能力。

## 2. 技术栈

| 分类       | 技术                                          | 说明                             |
| ---------- | --------------------------------------------- | -------------------------------- |
| 框架       | Vue 3.5（`<script setup>` + Composition API） | 应用与组件框架                   |
| 编辑器内核 | TipTap 3.30（`@tiptap/vue-3` / `@tiptap/pm`）  | 基于 ProseMirror 的编辑器        |
| 构建工具   | Vite 8                                        | 开发服务器与打包                 |
| 语言       | TypeScript ~6.0                               | 全量类型约束                     |
| UI 组件库  | naive-ui 2.x                                  | 按钮、提示、下拉、弹层等基础组件 |
| 图标       | @remixicon/vue                                | 工具栏图标                       |
| 国际化     | vue-i18n 11 + @intlify/unplugin-vue-i18n      | 中英文语言包                     |
| 样式       | CSS 变量 + 主题体系                           | 浅色 / 深色主题                  |
| 包管理     | pnpm                                          | 依赖管理                         |

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
tip-tap-editor/
├── index.html                  # 入口 HTML
├── package.json                # 依赖与脚本
├── vite.config.ts              # Vite 配置（别名 @ -> src、自动导入、i18n 插件）
├── tsconfig.json               # TypeScript 工程引用
├── auto-imports.d.ts           # unplugin-auto-import 生成的类型声明
├── public/                     # 静态资源（favicon、icons）
├── dist/                       # 构建产物
└── src/
    ├── main.ts                 # 应用入口（注册 i18n 后挂载）
    ├── App.vue                 # 演示页：主题/语言切换 + 编辑器示例
    ├── style.css / reset.css   # 全局样式与重置
    ├── components/
    │   ├── index.vue           # ★ 核心导出组件 TipTapEditor
    │   ├── utils.ts            # 工具函数（checkLimit 字数限制）
    │   ├── extensions/         # 自定义 TipTap 扩展（每个扩展自带工具栏按钮）
    │   │   ├── index.ts        # 扩展集合入口
    │   │   ├── Bold / Italic / Strike / Underline / Code / Highlight
    │   │   ├── Subscript / Superscript / Heading / HorizontalRule
    │   │   ├── BulletList / OrderedList / TaskList / Link / CodeBlock / Details
    │   │   ├── Image / Youtube / Audio / Twitch / FileHandler
    │   │   ├── TextStyle / Color / FontFamily / Typography / Table
    │   │   ├── FindAndReplace / InvisibleCharacters / Focus / UniqueId / NodeRange
    │   │   ├── Blockquote / TextAlign / HardBreak（每扩展一个文件）
    │   ├── ui-editor/          # 编辑器 UI 层
    │   │   ├── tool-bar/       # 工具栏（自动收集扩展按钮）
    │   │   ├── buttons/        # 简单功能按钮 + 弹窗按钮（链接/查找替换等）
    │   │   ├── menu-buttons/   # 下拉菜单按钮（标题/对齐/颜色/字体/表格）
    │   │   ├── bubble-menu/    # 选中文字的气泡格式条
    │   │   ├── floating-menu/  # 空行左侧的浮动插入菜单
    │   │   └── editor-content/ # 编辑区容器与内容样式
    │   └── ui-common/          # 通用 UI 基础组件
    │       ├── action-button/      # 工具栏基础按钮（含 tooltip/active 态）
    │       ├── action-menu-button/ # 下拉菜单按钮（基于 NPopover + NList）
    │       ├── url-dialog-button/  # URL 输入弹窗按钮（图片/视频/音频等复用）
    │       └── theme-provider/     # naive-ui 主题提供者（浅色/深色）
    ├── theme/                  # 主题体系（CSS 变量）
    │   ├── base.ts / light.ts / dark.ts / index.ts / overwirte.ts
    ├── locales/                # i18n 语言包（zh / en）
    ├── plugins/i18.ts          # vue-i18n 实例（本地存储 + 浏览器语言探测）
    ├── hooks/useLocale.ts      # 语言读写 Hook（持久化到 localStorage）
    └── types/                  # 全局类型定义（扩展选项、按钮视图、主题等）
```

## 5. 核心特性

### 5.1 组件 API（`src/components/index.vue`）

| 属性         | 类型                | 默认值      | 说明                                 |
| ------------ | ------------------- | ----------- | ------------------------------------ |
| `v-model`    | `string`            | 必填        | 编辑器 HTML 内容，双向绑定           |
| `max-length` | `number`            | `0`（不限） | 最大字数限制，超出自动截断           |
| `disabled`   | `boolean`           | `false`     | 是否禁用编辑（只读）                 |
| `theme`      | `'light' \| 'dark'` | `'light'`   | 主题模式                             |
| `placeholder`| `string`            | `-`         | 空文档时显示的占位文本               |
| `autofocus`  | `boolean`           | `false`     | 挂载后是否自动聚焦                   |

事件：`focus` / `blur`（payload 为 `{ editor, event }`，类型来自 `EditorEvents`）。

组件内部逻辑：

- 通过 `useEditor` 创建编辑器实例，注册 `Document` / `Paragraph` / `Text` / `Placeholder` 及自定义扩展；
- `onCreate` 中：若编辑器创建前 `v-model` 已变化则先 `setContent` 同步；仅当初始内容**超限被截断**时才把截断结果写回 `v-model`（避免空文档把父组件值从 `""` 改写为 `<p></p>`）；
- `onUpdate` 中调用 `checkLimit` 做字数截断，并把 `editor.getHTML()` 写回 `v-model`；
- 监听 `v-model` 外部变化（与编辑器当前 HTML 不一致时）通过 `setContent` 同步，编辑器未就绪时暂存、`onCreate` 后应用；
- 监听 `disabled` 变化调用 `setEditable` 切换只读；
- 底部展示实时字数统计 `当前字数 / 最大字数`。

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

> 类型层面，`src/types/index.ts` 定义了 `GeneralOptions`、`ButtonView`、`ButtonViewReturn` 等类型，为扩展声明 `button` 提供类型约束；`ButtonView` 可返回单个按钮或按钮数组，`RenderItem` 支持两种形态。翻译函数统一使用 `TranslateFn` 类型（兼容 vue-i18n 的 `t` 基本签名）。`ExtensionNameKeys` 枚举了未来可能支持的扩展名清单。

### 5.3 按钮组件体系

- **`ActionButton`**（action-button）：基础工具栏按钮，基于 `NButton` + `NTooltip`，支持 `action`、`isActive`（激活态）、`disabled`、`icon`、`tooltip`，图标使用 RemixIcon；
- **`ActionMenuButton`**（action-menu-button）：带下拉菜单的按钮（`NPopover` + `NList`），用于文本对齐等多项选择类功能，自动高亮当前激活项并同步主按钮图标；
- **按钮示例**：`BoldButton.vue` 等仅负责把编辑器命令（`toggleBold` 等）映射到 `ActionButton` 上。

### 5.4 主题体系

- `theme/base.ts`：基础尺寸 / 圆角 / 间距变量；
- `theme/light.ts` / `theme/dark.ts`：浅色、深色的颜色变量；
- `theme/index.ts`：`applyTheme()` 将主题 CSS 变量写入 `document.documentElement` 的 style 上；
- `theme/overwirte.ts`：naive-ui 的 `GlobalThemeOverrides`，使 naive-ui 组件（按钮、Popover）的颜色跟随编辑器 CSS 变量；
- `theme-provider`：根据 `theme` prop 选择 naive-ui 深色主题，并自动应用 CSS 变量。

所有主题变量以 `--naive-tiptap-*` 前缀命名，类型由 `src/types/theme.ts` 约束（`--naive-tiptap-${string}`）。

### 5.5 国际化（i18n）

- `plugins/i18.ts`：创建 vue-i18n 实例，语言优先级为 **localStorage（`app_language`）> 浏览器语言**，回退语言为中文；
- `hooks/useLocale.ts`：提供 `locale` / `setLocale`，切换时持久化到 `localStorage`；
- 语言包位于 `src/locales/zh.ts` / `en.ts`，目前覆盖加粗、斜体、下划线、文本对齐、引用等词条；
- 按钮组件通过扩展 `button` 回调中的 `t` 函数获取翻译文本。

### 5.6 编辑区样式

`editor-content/index.vue` 内置了编辑器内容区的样式：表格（`table` / `td` / `th` / 单元格选中 / 列宽调整手柄）、引用块（`blockquote`）、空文档占位文本（`p.is-editor-empty:first-child::before`，配合 `placeholder` prop）等，全部使用主题 CSS 变量，随主题自动切换。

## 6. 当前已支持的编辑能力

| 扩展 | 来源 | 工具栏形态 |
| --- | --- | --- |
| Bold 加粗 | 自定义（基于 @tiptap/extension-bold） | 图标按钮 |
| Italic 斜体 | 自定义（基于 @tiptap/extension-italic） | 图标按钮 |
| Underline 下划线 | 自定义（基于 @tiptap/extension-underline） | 图标按钮 |
| Strike 删除线 | 自定义（基于 @tiptap/extension-strike） | 图标按钮 |
| Code 行内代码 | 自定义（基于 @tiptap/extension-code） | 图标按钮 |
| Highlight 高亮 | 自定义（基于 @tiptap/extension-highlight） | 图标按钮 |
| Subscript 下标 | 自定义（基于 @tiptap/extension-subscript） | 图标按钮 |
| Superscript 上标 | 自定义（基于 @tiptap/extension-superscript） | 图标按钮 |
| Heading 标题 | 自定义（基于 @tiptap/extension-heading，H1/H2/H3） | 下拉菜单按钮（正文/H1/H2/H3） |
| BulletList 无序列表 | 自定义（基于 @tiptap/extension-list） | 图标按钮 |
| OrderedList 有序列表 | 自定义（基于 @tiptap/extension-list） | 图标按钮 |
| TaskList 任务列表 | 自定义（基于 @tiptap/extension-list） | 图标按钮 |
| Link 链接 | 自定义（基于 @tiptap/extension-link，自动识别/粘贴链接） | 弹窗按钮（输入 URL） |
| CodeBlock 代码块 | 自定义（基于 @tiptap/extension-code-block） | 图标按钮 |
| Details 折叠块 | 自定义（基于 @tiptap/extension-details） | 图标按钮 |
| Image 图片 | 自定义（基于 @tiptap/extension-image） | URL 弹窗按钮（也可拖拽/粘贴图片文件） |
| Youtube 视频 | 自定义（基于 @tiptap/extension-youtube） | URL 弹窗按钮 |
| Audio 音频 | 自定义（基于 @tiptap/extension-audio） | URL 弹窗按钮 |
| Twitch 直播 | 自定义（基于 @tiptap/extension-twitch） | URL 弹窗按钮 |
| Color 文字颜色 | 自定义（基于 @tiptap/extension-text-style 的 Color） | 颜色选择菜单（NColorPicker） |
| FontFamily 字体 | 自定义（基于 @tiptap/extension-text-style 的 FontFamily） | 下拉菜单（无衬线/衬线/等宽/雅黑） |
| Table 表格 | 自定义（基于 @tiptap/extension-table 的 TableKit，可调整列宽） | 下拉菜单（插入/行列/合并/表头/删除） |
| FindAndReplace 查找替换 | 自定义（基于 @tiptap/extension-find-and-replace） | 弹窗面板（查找/替换/全部/前后跳转） |
| InvisibleCharacters 隐藏字符 | 自定义（基于 @tiptap/extension-invisible-characters） | 图标按钮（切换） |
| BubbleMenu 气泡菜单 | @tiptap/vue-3 的 BubbleMenu 组件 | 选中文字浮现格式条 |
| FloatingMenu 浮动菜单 | @tiptap/vue-3 的 FloatingMenu 组件 | 空行左侧浮现插入菜单 |
| HorizontalRule 分隔线 | 自定义（基于 @tiptap/extension-horizontal-rule） | 图标按钮 |
| Typography 排版替换 | @tiptap/extension-typography | 无按钮（智能替换） |
| Focus 聚焦高亮 | @tiptap/extension-focus | 无按钮（聚焦块描边） |
| UniqueId 唯一 ID | @tiptap/extension-unique-id | 无按钮（节点 id 属性） |
| Blockquote 引用 | 自定义（基于 @tiptap/extension-blockquote） | 图标按钮 |
| TextAlign 文本对齐 | 自定义（基于 @tiptap/extension-text-align，作用于 heading/paragraph） | 下拉菜单按钮（左/中/右/两端） |
| HardBreak 硬换行 | @tiptap/extension-hard-break（Shift+Enter） | 无按钮（快捷键） |

## 7. 设计要点与约定

1. **功能与 UI 解耦**：扩展定义能力，`button` 选项定义 UI，工具栏只做「收集 + 渲染」；
2. **HTML 作为交换格式**：`v-model` 传递 HTML 字符串，编辑器中仅注册基础节点（Document / Paragraph / Text），复杂内容由扩展补齐；
3. **可插拔扩展集**：`src/components/extensions/index.ts` 是扩展的唯一入口，新增能力在此注册即可；
4. **统一主题变量**：所有 UI 颜色、尺寸均通过 `--naive-tiptap-*` CSS 变量驱动，naive-ui 通过 overrides 接入同一套变量；
5. **完整的类型约束**：扩展选项、按钮视图等均有对应 TS 类型（`src/types/`），开发时享受类型提示。

## 8. 扩展建议 / 路线图

- 基于 `src/types/index.ts` 中 `ExtensionNameKeys` 的枚举，可继续接入：列表（有序/无序/任务）、链接 Link、图片 Image、表格 Table（扩展依赖已就绪，样式已内置，仅需启用）、代码块、气泡菜单、查找替换、Emoji、@提及、数学公式等；集成清单与分阶段计划见 `docs/tiptap-extensions-integration-plan.md`；
- `StarterKit` 已作为依赖引入但暂未启用，可按需替换当前的逐节点注册方式；
- 可抽取为独立 npm 包 / Vue 组件库，暴露统一的扩展注册 API；
- 可补充 TableKit（可调整列宽）等高级能力的完整 UI。

## 9. 已知事项

- 演示页 `App.vue` 中初始内容为占位文本，正式使用时应由业务方传入；
- 代码中存在部分被注释的扩展/表格代码（`StarterKit`），属于演进中的预留能力；
- 字数限制与字数统计统一使用「可见字符数」口径（`getEditorTextLength`，不含换行与 HTML 标签）：**按 Enter 换行不计入字数**，内容满额时换行不会导致字数虚增，超限输入会被精确截断（基于文档 position 计算截断点）；
- `InvisibleCharacters`（隐藏字符）默认关闭（`visible: false`），需点击工具栏按钮手动开启——该扩展官方默认是 `visible: true`，直接注册会导致每个段落显示 ¶ 标记；
- `pnpm-workspace.yaml` 中配置了 `overrides: prosemirror-model: ^1.25.11`，且 `vite.config.ts` 的 `resolve.dedupe` 强制 `prosemirror-model` / `@tiptap/pm` / `@tiptap/core` 等单一副本：双重保险避免出现多份 `prosemirror-model`（ProseMirror 官方警告：重复副本会导致「节点拆分/包裹失败」，表现为按 Enter 无法换行，报 `Can not convert ... to a Fragment (looks like multiple versions of prosemirror-model)`）；

---

*本文档基于项目当前代码状态整理，随项目演进需同步更新。*
