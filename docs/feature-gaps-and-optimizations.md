# 功能缺口与优化清单

> 整理时间：2026-08，**2026-09-07 复核更新**。基于对现有扩展集（`src/components/extensions/index.ts`）、工具栏按钮、`package.json` 依赖与核心组件逻辑（`src/components/index.vue`）的评审。
>
> 结论一句话：**「能编辑的功能」已经相当全（文本/列表/表格/媒体/折叠/链接/查找替换），P0（Undo/Redo、清除格式、字符统计）已完成；剩余缺口集中在「编辑体验（拖拽、缩进）」「富文本常见高级能力（字体大小 / Markdown / 目录 / Emoji / 提及）」「性能与 Reactive 细节」三块。**

> **决策记录（2026-09-07）**：`Focus`（聚焦高亮）**默认不启用**——依赖与样式已就绪但保持注释状态，避免非活动块淡化对部分宿主场景造成干扰；如需开启，去掉 `src/components/extensions/index.ts` 中两处注释即可。

---

## 1. 现状盘点（2026-08 快照）

**已启用**：Bold / Italic / Underline / Strike / Code / Highlight / Subscript / Superscript / Color / FontFamily / Typography / Heading / HorizontalRule / Blockquote / TextAlign / CodeBlock / Details / Bullet·Ordered·TaskList / Link / Image·Video·Youtube·Audio·Twitch + FileHandler / Table（可调列宽）/ FindAndReplace / InvisibleCharacters / UniqueId / NodeRange / HardBreak / **Undo·Redo + ClearFormatting + CharacterCount** / **Gapcursor·Dropcursor·TrailingNode** / BubbleMenu / FloatingMenu。

**已安装但未启用**：`@tiptap/extension-focus`（**默认不启用，决策见文档开头**）、`@tiptap/starter-kit`（作为依赖但未使用）。

**未安装 / 未集成**：`extension-undo-redo`、`extension-character-count`、`extension-drag-handle`、`extension-markdown`、`extension-autolink`（`link` 扩展已支持粘贴时自动识别，但无独立 autolink 配置）、`extension-emoji`、`extension-mention` + `@tiptap/suggestion`、`extension-mathematics`、`extension-table-of-contents`、`extension-ruby-text`、`extension-collaboration` 系列、`extension-text-style` 之上的 `font-size`（非官方，需自研）等。

---

## 2. 建议补充的插件（按优先级）

> 按钮形态沿用项目「扩展即按钮」约定（`图标按钮` / `下拉菜单` / `弹窗` / `无按钮`）。集成走法见 `docs/tiptap-extensions-integration-plan.md` §4。

### 2.1 P0 — 高价值 / 低风险，强烈建议

> ✅ **已完成（2026-09）**：Undo / Redo、清除格式、CharacterCount（含 v-model 写回防抖）。

| 扩展 / 能力 | 按钮形态 | 说明 | 状态 |
| ----------- | -------- | ---- | ---- |
| **Undo / Redo** | 图标按钮 ×2 | `@tiptap/extension-undo-redo`（历史插件）+ 自定义 `Undo` / `Redo` 按钮（带 `canUndo()/canRedo()` 禁用态） | ✅ 已完成 |
| **清除格式（Clear Formatting）** | 图标按钮 | 一键移除选区上的所有 **mark**（bold/italic/code/highlight/color/fontFamily 等）+ 重置 heading。 | ✅ 已完成 |
| **块级拖拽手柄（Drag Handle）** | 无按钮 | 前置 `NodeRange` 已集成，仅差 `extension-node-range` 之上的拖拽 UI。官方 `extension-drag-handle` 的 peer 强制 `collaboration + y-tiptap`；可选 `drag-handle-vue-3` 独立接入（`gapCursor` 已作为兜底启用）。 | ⬜ 未做 |
| **字数 / 字符统计（CharacterCount）** | 无按钮（复用底部统计） | 已用 `@tiptap/extensions` 的 `CharacterCount` 取代手写 `getEditorTextLength`（增量计算），配合 v-model 写回防抖。 | ✅ 已完成 |
| **Markdown 导入/导出** | 弹窗或面板 | `@tiptap/markdown`（`turndown + markdown-it`）来回转换 HTML。适合需要「复制为 Markdown / 粘贴 Markdown」的场景；若暂不需要，可归到 P1。 | ⬜ 未做 |

### 2.2 P1 — 中价值 / 中等成本

| 扩展 / 能力 | 按钮形态 | 说明 |
| ----------- | -------- | ---- |
| **字体大小（Font Size）** | 下拉菜单 | 基于现有 `TextStyle` 基座，自研 `addAttributes` 注入 `style.font-size` 即可，模式与 `FontFamily` 一致。 |
| **图片/视频拖拽改尺寸** | 节点悬浮控件 | 插入时可设宽高，但**无拖拽调整手柄**；可给 Image/Video nodeview 挂 resize 角标（复用 Table 列宽手柄的思路）。 |
| **Emoji** | 按钮 + 面板 | `@tiptap/extension-emoji` 自带 `emojibase-data` 数据与建议列表；需面板 UI（可复用 Popover + 现有搜索框）。 |
| **提及 @（Mention + Suggestion）** | 无按钮 | `@tiptap/extension-mention` + `@tiptap/suggestion`，输入 `@` 出建议弹层；无需三方引擎，数据源由宿主注入（您的 `Image.configure({ upload })` 同款注入模式）。 |
| **目录（Table of Contents）** | 无按钮 | `@tiptap/extension-table-of-contents`，依赖 Heading；用于长文导航，纯只读节点。 |
| **基础 PM 兜底扩展** | 无按钮 | `DropCursor` / `GapCursor` / `TrailingNode`（trailing 保证文档末尾始终可插入）；这些都在 `starter-kit` 内，启用 StarterKit 即一并获得（见 §4）。 |

### 2.3 P2 — 重 / 按需（接入前单独评估）

| 扩展 / 能力 | 按钮形态 | 说明 |
| ----------- | -------- | ---- |
| **数学公式（Mathematics）** | 按钮 + 弹窗 | `@tiptap/extension-mathematics`，**引入 KaTeX（体积大）**；建议按需动态 `import()`，避免进主包。 |
| **注音（Ruby Text）** | 图标按钮 | `@tiptap/extension-ruby-text`；东亚文本注音，低风险低频。 |
| **实时协作（Collab）** | 无按钮 | `extension-collaboration + -caret + @tiptap/y-tiptap + Yjs`，**需配套后端**；建议在 `NodeRange` / `UniqueId` 之上再评估。 |
| **文字方向 RTL / 行距 / 首行缩进** | 下拉/按钮 | `extension-text-style` 层面扩展属性即可；中文场景「首行缩进」较为常见。 |

---

## 3. 建议「开启/补全却未开启」的现有能力

| 项目 | 现状 | 建议 |
| ---- | ---- | ---- |
| **Focus（聚焦高亮）** | `src/components/extensions/index.ts` 中注释 | **默认不启用（2026-09-07 决策）**：聚焦时淡化非活动块可能干扰部分宿主场景，故保持关闭。代码与依赖均已就绪，需要时去掉两处注释即可启用；样式已内置（`.has-focus`）。 |
| **StarterKit** | 依赖已装但未使用 | 用 StarterKit 替代「逐节点手写注册」，可集中获得 DropCursor / GapCursor / History / TrailingNode / undo-redo 命令等；但与「扩展即按钮 + 逐文件命名」的架构会叠加，**需权衡在 index.ts 中整合的方式**（StarterKit 不进工具栏，仅提供行为基座）。 |
| **Link 自动识别** | Link 已配置 | 确认 `autolink` / `HTMLAttributes` 按需开启，补齐「粘贴 / 输入时自动转链接」的体验。 |

---

## 4. 优化建议（非新增功能，提升体验与健壮性）

### 4.1 性能

1. **v-model 写回防抖**：`src/components/index.vue` 的 `onUpdate` 每次事务都执行 `editor.getHTML()` 并写回父组件。大文档下每敲一个字符都要 O(n) 序列化 + 触发父组件重渲染。
   - 建议：`onUpdate` 后 **300ms 防抖**再 `getHTML()` 写回；真·即时需要可拆「本地编辑不重渲染 + 节流回写」。
   - `getHTML()` 结果可缓存，仅当文档 version 变化时重算。
   - ✅ **已完成（2026-09-07）**：`onUpdate` 改为 300ms 防抖写回（`checkLimit` 截断仍同步执行），组件卸载时 flush 未落盘的写回。`getHTML()` 缓存仍可做但暂未实施。
2. **关闭不必要的 Vue 重渲染**：`useEditor({ shouldRerenderOnTransaction: false })`——纯文本输入时无需订阅每次事务的响应式重渲染，可显著降低 CPU。仅当需要响应光标/选中态时再局部订阅。
3. **字数统计改用 CharacterCount**：✅ **已完成**，底部统计与 `checkLimit` 均已改用 `editor.storage.characterCount`（见 2.1）。
4. **重扩展懒加载**：Mathematics(KaTeX)、Markdown(turndown) 等用 `import()` 按需，不进首屏主包（构建已按 group 分包，见 `vite.config.ts`）。

### 4.2 响应式 / 正确性细节

| 问题 | 说明与建议 |
| ---- | ---------- |
| **`placeholder` prop 不是响应式** | `Placeholder.configure({ placeholder })` 仅在 `useEditor` 创建时读一次；运行时改 `placeholder` 不会生效。建议 watch `props.placeholder` 后 `editor.extensionManager` 更新并重渲染，或读 `editor` 时动态取。 |
| **`extensions` prop 仅在创建时读一次** | 列表渲染期改扩展不生效；属约定行为，建议文档注明「扩展必须在挂载前确定」。 |
| **外部 `setContent` 不清空 undo 栈** | 父组件整体重置内容后用 `undo` 可能跳回历史旧状态；如需「重置即清历史」，在回填时调用 `editor.commands.clearContent(true)`（需确认）或 `editor.view.history`（PM 内部）重置。 |
| **`v-model` 初值为空字符串** | 已有 `pendingContent` 与「空文档不回写 `<p></p>`」的防护，逻辑正确；保留。 |

### 4.3 可用性 / 无障碍（A11y）

1. **图标按钮缺 `aria-label`**：工具栏/气泡/表格菜单大量纯图标按钮，目前只有 hover tooltip。建议 `ActionButton` 统一注入 `:aria-label="tooltip"`（i18n 词条已具备），提升读屏与键盘可达性。
2. **配色对比度**：`--tiptap-color-text-muted`（灰）在小号字（表格操作、字数统计）上偏低，可调深半档。
3. **键盘可达**：气泡菜单 / 下拉菜单 / 颜色面板的事件已 `mousedown` 外部关闭；确保面板内支持 `Esc` 与 `Tab` 聚焦（下拉/弹窗已支持 Esc，核对一致）。

### 4.4 结构 / 一致性（代码质量）

1. **重复样式收敛**：`ColorMenuButton` / `FindAndReplaceButton` / `TableMenuButton` 各自复制了 `.tiptap-menu-item` 与 `.color-button`/`.fr-button` 等 trigger 样式，建议抽成共享 `ui-common`（`ActionButton` 即可覆盖多数 trigger，仅保留差异）。
2. **滚动条 / 焦点样式集中**：内容区滚动条、`.has-focus` 等在 `editor-content/index.vue` 已集中；可将细粒度内滚动样式抽到 `theme/base.ts` 或一个共用 SCSS 串口。

### 4.5 文档同步（已有文档与代码漂移）

| 位置 | 现状 | 需修正 |
| ---- | ---- | ------ |
| `docs/PROJECT.md` §5.3 等 | 引用 **Naive UI**：`NButton` / `NPopover` / `NList` / `NColorPicker` | 实际是自研 `ActionButton` / `action-menu-button` / `popover` / `color` 菜单，建议改为自研组件名 |
| `docs/PROJECT.md` §5.4 | 主题变量前缀写作 **`--naive-tiptap-*`** | 实际为 **`--tiptap-*`** |
| `docs/PROJECT.md` §4 目录 | 写作 `tool-bar/`、`url-popover-button/`、`styles.scss` | 实际为 `toolbar/`、`popover-button/`、按钮样式 scoped 内 |
| `docs/PROJECT.md` §8 路线 | 以 `ExtensionNameKeys` 枚举为准 | 已与本文档 §2 合并，可在悬而未决处互指 |

---

## 5. 一句话路线建议

1. ~~**先做（半天）**：Undo/Redo 按钮 + 清除格式~~ → ✅ 已完成（Focus 按决策默认不启用）。
2. **再做（1 天）**：`shouldRerenderOnTransaction:false` + ~~v-model 写回防抖~~ ✅ + ~~CharacterCount 替换手工计数~~ ✅ + 映射 i18n/aria-label。
3. **按业务做**：Markdown（含导出）→ 拖拽手柄 / Emoji / 提及 → Table of Contents → 协作。
4. ~~**随做随改**：`docs/PROJECT.md` 中 Naive UI 与 `--tiptap-*` 前缀的漂移描述~~ → ✅ 已同步（2026-09-07）。

---

*本文档基于当前代码评审整理，功能与优化项均按「扩展即按钮」架构落位，不与现有 v-model / 主题 / i18n 机制冲突。*