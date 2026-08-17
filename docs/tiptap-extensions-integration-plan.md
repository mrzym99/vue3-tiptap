# TipTap 官方扩展集成计划

> 来源：https://github.com/ueberdosis/tiptap/tree/main/packages
> 集成原则：**名字与 React 相关的不集成**；沿用项目「扩展即按钮」架构（每个扩展 = 一个 `extensions/Xxx.ts` 文件 + 工具栏自动收集）。

## ✅ 执行状态

| 阶段 | 状态 | 说明 |
| --- | --- | --- |
| 阶段 0（版本统一 3.30.1） | ✅ 已完成 | core/pm/vue-3/extensions/starter-kit 及全部现有扩展统一至 3.30.1，peer 冲突 0，build 通过 |
| 阶段 1（基础文本样式） | ✅ 已完成 | strike/code/highlight/subscript/superscript/heading/hr/hard-break 已集成，工具栏自动收集，i18n/样式齐备 |
| 阶段 2（列表/链接/代码块/折叠块） | ✅ 已完成 | extension-list（bullet/ordered/task）、link（弹窗）、code-block、details 已集成；修复了 Details 需显式注册子节点的问题 |
| 阶段 3（媒体与嵌入） | ✅ 已完成 | image/youtube/audio/twitch（URL 弹窗按钮，共用 ui-common/url-dialog-button）、file-handler（拖拽/粘贴图片） |
| 阶段 4（样式丰富与表格） | ✅ 已完成 | text-style 基座 + color（NColorPicker 菜单）+ font-family（下拉菜单）+ typography（无按钮）；表格 TableKit 全操作菜单 |
| 阶段 5（编辑体验） | ✅ 已完成* | bubble-menu / floating-menu（@tiptap/vue-3 组件）、find-and-replace（面板）、focus、invisible-characters、unique-id、node-range |
| 阶段 6 | ⏳ 待执行 | 按需继续 |

> *阶段 5 中 `extension-drag-handle` **暂缓**：其 peer 强制依赖 `@tiptap/extension-collaboration` + `@tiptap/y-tiptap`（Yjs 协作栈），对纯本地编辑器引入大量无用途依赖，且拖拽 UI 需另装 `drag-handle-vue-3`。前置的 `extension-node-range` 已集成，未来接入协作时可平滑补上。

## 1. 盘点

### 1.1 官方 packages 清单与归类

| 归类 | 包 | 处置 |
| --- | --- | --- |
| ❌ React 相关（排除） | `react`（@tiptap/react）、`extension-drag-handle-react` | 不集成 |
| ✅ 已集成（当前项目） | `core`、`pm`、`vue-3`、`extensions`、`starter-kit`、`extension-document`、`extension-paragraph`、`extension-text`、`extension-bold`、`extension-italic`、`extension-underline`、`extension-blockquote`、`extension-text-align`、`extension-table`（依赖已装未启用）、`extension-placeholder` | — |
| 框架绑定（Vue 侧） | `vue-2`、`vue-3`、`extension-drag-handle-vue-2`、`extension-drag-handle-vue-3` | `vue-3` 在用；`drag-handle-vue-3` 作为拖拽手柄的 UI 壳（可选，阶段 5） |
| 工程包（非工具栏扩展） | `html`、`markdown`、`static-renderer`、`ai-toolkit`、`suggestion` | 视需要引入（序列化/SSR/建议弹层引擎） |
| ⏳ 待集成扩展 | 见 §3 | 分阶段集成 |

### 1.2 已查证的版本事实（2026-08 快照）

- 所有 `@tiptap/extension-*` 最新版统一为 **3.30.1**；
- 3.30.1 的 peer 依赖全部要求 `@tiptap/core@3.30.1` / `@tiptap/pm@3.30.1`；
- 当前项目 core/pm 为 **3.27.1**，且已在混用 3.27/3.28/3.29 → **集成前必须先统一版本**。

## 2. 阶段 0：前置（必做）

**统一 TipTap 全家版本至 3.30.1**（core、pm、vue-3、extensions、starter-kit、extension-*、新装包全部一致）

- 操作：`pnpm add @tiptap/core@^3.30.1 @tiptap/pm@^3.30.1 @tiptap/vue-3@^3.30.1 ...`（逐个升级现有包）
- 验证：`pnpm build` + demo 页回归（加粗/斜体/对齐/引用/字数限制/主题/中英文）
- 风险：3.27 → 3.30 属 minor 升级，TipTap 3.x 内 API 兼容，风险低
- 工作量：约 0.5 小时

## 3. 分阶段扩展清单

> 按钮形态：`图标按钮` = 复用 `ActionButton`（同 Bold）；`下拉菜单` = 复用 `ActionMenuButton`（同 TextAlign）；`弹窗` = 需要新增简单弹窗 UI；`无按钮` = 纯行为/配置，不进工具栏。

### 阶段 1：基础文本样式（高价值、低风险）

| 扩展 | 按钮形态 | 备注 |
| --- | --- | --- |
| `extension-strike` 删除线 | 图标按钮 | 同 bold 模式 |
| `extension-code` 行内代码 | 图标按钮 | |
| `extension-highlight` 高亮 | 图标按钮 | 默认黄色，可配置颜色 |
| `extension-subscript` 下标 | 图标按钮 | |
| `extension-superscript` 上标 | 图标按钮 | |
| `extension-heading` 标题 | 下拉菜单 | H1/H2/H3/正文，图标 + i18n |
| `extension-horizontal-rule` 分隔线 | 图标按钮 | |
| `extension-hard-break` 硬换行 | 无按钮（快捷键） | 仅注册，不占工具栏 |

小计 7 个扩展（1 个菜单），约 3~4 小时。

### 阶段 2：列表、链接与代码块

| 扩展 | 按钮形态 | 备注 |
| --- | --- | --- |
| `extension-list` 列表合集 | 下拉菜单或 2 按钮 | 含 bullet/ordered/task 列表、listItem、taskItem |
| `extension-link` 链接 | 按钮 + 弹窗 | 弹窗输入 URL/文案，需新增 Dialog UI |
| `extension-code-block` 代码块 | 图标按钮 | |
| `extension-details` 折叠块 | 按钮 | 3.x 新扩展（details/summary） |

小计 4 个扩展（1 弹窗），约 4~5 小时。

### 阶段 3：媒体与嵌入

| 扩展 | 按钮形态 | 备注 |
| --- | --- | --- |
| `extension-image` 图片 | 按钮 + 弹窗 | URL 输入（上传能力可后续接业务） |
| `extension-youtube` 视频 | 按钮 + 弹窗 | 粘贴/输入视频 URL |
| `extension-audio` 音频 | 按钮 + 弹窗 | |
| `extension-file-handler` 文件 | 无按钮 | 拖拽/粘贴文件进编辑器 |
| `extension-twitch` 直播嵌入 | 按钮 + 弹窗 | 可后置 |

小计 4~5 个扩展，约 4~5 小时。

### 阶段 4：样式丰富与表格（依赖 text-style 基座）

| 扩展 | 按钮形态 | 备注 |
| --- | --- | --- |
| `extension-text-style` + `extension-color` 文字颜色 | 颜色菜单 | textStyle 是 color/font-family 的基座 |
| `extension-font-family` 字体 | 下拉菜单 | |
| `extension-typography` 排版替换 | 无按钮 | 智能替换（引号、省略号等），纯配置 |
| `extension-table` 表格启用 | 插入菜单 + 列宽/增删 UI | 内容样式已内置，补全表格操作按钮 |

小计 5 个包，约 5~6 小时。

### 阶段 5：编辑体验

| 扩展 | 按钮形态 | 备注 |
| --- | --- | --- |
| `extension-bubble-menu` 气泡菜单 | 无工具栏按钮 | 选中文字浮现格式条（bold/italic/…） |
| `extension-floating-menu` 浮动菜单 | 无工具栏按钮 | 空行左侧浮现菜单 |
| `extension-find-and-replace` 查找替换 | 按钮 + 搜索面板 | UI 较复杂 |
| `extension-focus` 聚焦高亮 | 无按钮 | 聚焦时淡化非活动节点 |
| `extension-invisible-characters` 隐藏字符 | 切换按钮 | 显示空格/换行符等 |
| `extension-unique-id` | 无按钮 | 节点唯一 ID |
| `extension-node-range` + `extension-drag-handle` 拖拽 | 无按钮 | 块级拖拽重排；UI 可配 `drag-handle-vue-3` |

小计 7~8 个包，约 6~8 小时（drag-handle / find-and-replace 较耗时）。

### 阶段 6：高级能力（重，可选）

| 扩展 | 按钮形态 | 三方依赖 | 备注 |
| --- | --- | --- | --- |
| `extension-emoji` | 按钮 + 面板 | emojibase-data（自带） | 需表情面板 UI |
| `extension-mention` + `@tiptap/suggestion` | 无按钮 | 无 | 输入 `@` 触发建议弹层，需配置数据源 |
| `extension-mathematics` | 按钮 + 弹窗 | **katex** | 数学公式 |
| `extension-ruby-text` 注音 | 图标按钮 | 无 | |
| `extension-table-of-contents` 目录 | 无按钮 | 无 | 需 heading 配合 |
| `extension-collaboration` + `extension-collaboration-caret` | 无按钮 | **yjs / @tiptap/y-tiptap + 服务端** | 实时协作，需配套后端 |

小计 6 项，单项 2~8 小时不等（collaboration 依赖后端，单独评估）。

## 4. 集成模式（每个扩展统一走法）

1. `pnpm add @tiptap/extension-xxx@^3.30.1`（阶段 0 完成后版本自动对齐）；
2. 新建 `src/components/extensions/Xxx.ts`：`TiptapXxx.extend({ addOptions() { return { ...this.parent(), button: ({ editor, t }) => ({ component: XxxButton, componentProps: { editor, t } }) } } })`；
3. 新建按钮组件 `src/components/ui-editor/buttons/XxxButton.vue`（图标按钮）或 `menu-buttons/XxxMenu.vue`（下拉/颜色/弹窗）；
4. 补充 `src/locales/zh.ts` / `en.ts` 词条（`t()` 透传到按钮）；
5. 补充样式（`editor-content/index.vue` 或组件内 scoped）；
6. 在 `src/components/extensions/index.ts` 注册 → **工具栏自动收集，无需改 toolbar**；
7. `pnpm build` 类型检查 + demo 页手测（含主题/中英文/字数限制回归）。

图标统一使用 `@remixicon/vue`（项目已有）。

## 5. 建议执行顺序

```
阶段 0（版本统一，必做）
  ↓
阶段 1（基础文本样式）→ 阶段 2（列表/链接/代码块）→ 阶段 3（媒体）
  ↓
阶段 4（颜色/字体/表格）→ 阶段 5（编辑体验）
  ↓
阶段 6（高级，按需）
```

每完成一个阶段做一次 `pnpm build` + 手测回归；每阶段完成后都可独立交付。
