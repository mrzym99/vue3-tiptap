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
| **块级拖拽手柄（Drag Handle）** | 无按钮 | ✅ 已完成（2026-09）：基于官方 `@tiptap/extension-drag-handle` v3.31.3（MIT）源码精简（剥离全部 Yjs/协作分支），落位 `src/components/extensions/DragHandle/`（rules / drop-restore / plugin / index 四模块），零新依赖；支持 `nested` 嵌套拖拽、NodeRangeSelection 拖放还原、`ariaLabel`。**表格行为（2026-09-17 更新）**：`nested: true` 时单元格内段落可拖（拖入其他单元格/拖出表格，源单元格自动补空段落保持结构合法）；表格行/单元格本身仍不可作为拖拽目标（官方同款 `tableStructure` 规则排除）；整表拖动保留，抓手势 = 悬停单元格左侧留白（边缘检测提升为表格，同"悬停引用留白抓整块"）。**与官方的 4 处行为偏离**（源码头部有勿回同步标注）：① 滚动跟随（官方无，wrapper 不随内层滚动容器移动）；② left/right 边缘检测仅在块外侧槽位触发（官方 12px 块内区域与手柄热区重叠，嵌套块手柄永远抓不到）；③ 默认边缘移除 top（与手柄 left-start 热区重叠）；④ 嵌套模式下文档变化后不把目标提升为顶层块。 | ✅ 已完成 |
| **字数 / 字符统计（CharacterCount）** | 无按钮（复用底部统计） | 已用 `@tiptap/extensions` 的 `CharacterCount` 取代手写 `getEditorTextLength`（增量计算），配合 v-model 写回防抖。 | ✅ 已完成 |
| **Markdown 导入/导出** | 弹窗或面板 | `@tiptap/markdown`（`turndown + markdown-it`）来回转换 HTML。适合需要「复制为 Markdown / 粘贴 Markdown」的场景；若暂不需要，可归到 P1。 | ⬜ 未做 |

### 2.2 P1 — 中价值 / 中等成本

| 扩展 / 能力 | 按钮形态 | 说明 |
| ----------- | -------- | ---- |
| **字体大小（Font Size）** | 下拉菜单 | ✅ 已完成（2026-09）：直接使用已安装 `@tiptap/extension-text-style/font-size` 子路径导出（无需自研，也无需新依赖），12/14/16/18/20/24/30 px + 默认共 8 档，模式与 `FontFamily` 一致（`FontSizeMenuButton`）。 |
| **图片/视频拖拽改尺寸** | 节点悬浮角标 | ✅ 已完成（2026-09）：Image/Video 节点复用 `utils/resizableMediaView.ts`（基于 tiptap 内置 `ResizableNodeView`）——四角手柄、等比锁定（Shift 解锁）、尺寸写回 `width`/`height` attrs；选中/悬停显示手柄。注意视频是 iframe（嵌套文档），拖拽中通过 `data-resize-state="true"` 时 `pointer-events:none` 让 `mouseup` 回到宿主文档，避免松手后仍处拖拽态。媒体最宽不超过容器宽度，选中用 `outline`（不占布局、无重排）。 |
| **Emoji** | 按钮 + 面板 | `@tiptap/extension-emoji` 自带 `emojibase-data` 数据与建议列表；需面板 UI（可复用 Popover + 现有搜索框）。 |
| **提及 @（Mention + Suggestion）** ✅ 已完成（2026-09-07） | 无按钮 | `@tiptap/extension-mention` + `@tiptap/suggestion`，输入 `@` 出建议弹层；数据源由宿主注入：`Mention.configure({ items })`（静态列表自动按 query 过滤，或传 `({ query, editor }) => items` 同步/异步解析函数，模式同 `Image.configure({ upload })`）。弹层由 `@tiptap/suggestion` 的 managed mount 定位（fixed 策略 + floating-ui autoUpdate），并 reparent 进主题根节点以继承 `--tiptap-*` 变量。 |
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
2. **关闭不必要的 Vue 重渲染**：~~`useEditor({ shouldRerenderOnTransaction: false })`~~ → **不适用（2026-09-07 核实）**：该选项是 `@tiptap/react` 专属（v3 默认已改为 false，配合 `useEditorState` 精细订阅）；`@tiptap/vue-3` 没有此选项，其内部已用 `useDebouncedRef`（双层 `requestAnimationFrame` 延迟 trigger 的响应式 state/storage）合并同帧事务，模板中读 `editor.can()` / `isActive()` 自动刷新且天然去抖，无需改造。
3. **字数统计改用 CharacterCount**：✅ **已完成**，底部统计与 `checkLimit` 均已改用 `editor.storage.characterCount`（见 2.1）。
4. **重扩展懒加载**：Mathematics(KaTeX)、Markdown(turndown) 等用 `import()` 按需，不进首屏主包（构建已按 group 分包，见 `vite.config.ts`）。
   - **StarterKit 全量打包**：`StarterKit` 急切 `import` 全部内置扩展（含 image/video/youtube/audio/twitch 等媒体扩展），且本地自定义 wrapper/UI 代码在库构建中被单 chunk 输出（`vite.lib.config.ts` 单入口、无分包），故 `@tiptap/*` 虽已 external，本地代码无法 tree-shake。需更小体积时用命名导出手选扩展（`[Bold, Italic, Image]`）替代全套 kit；按扩展子路径分包属后续工作。

### 4.2 响应式 / 正确性细节

| 问题 | 说明与建议 |
| ---- | ---------- |
| **`placeholder` prop 不是响应式** | ✅ **已修复（2026-09-07）**。注意 tiptap v3 的 `extension.options` 是 getter（每次访问重新执行 `addOptions()` 返回新对象），直接 mutate 无效；最终方案是 `placeholder` 选项传**函数闭包**（插件每次重建 decoration 时调用），配合 watch 派发 selectionSet 事务强制重建。 |
| **`extensions` prop 仅在创建时读一次** | 列表渲染期改扩展不生效；属约定行为，建议文档注明「扩展必须在挂载前确定」。 |
| **外部 `setContent` 不清空 undo 栈** | 父组件整体重置内容后用 `undo` 可能跳回历史旧状态；如需「重置即清历史」，在回填时调用 `editor.commands.clearContent(true)`（需确认）或 `editor.view.history`（PM 内部）重置。 |
| **`v-model` 初值为空字符串** | 已有 `pendingContent` 与「空文档不回写 `<p></p>`」的防护，逻辑正确；保留。 |

### 4.3 可用性 / 无障碍（A11y）

1. **图标按钮缺 `aria-label`**：✅ **已完成（2026-09-07）**。`ActionButton` 统一注入 `:aria-label="tooltip"` 与 `:aria-pressed`（切换态）、下拉按钮 `:aria-expanded`（含 ColorMenuButton / FindAndReplaceButton 自带 trigger）；i18n 词条即无障碍名称。剩余：配色对比度可再调。
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
| `docs/PROJECT.md` §8 路线 | 以 `ExtensionNameKeys` 枚举为准 | 已与本文档 §2 合并；`ExtensionNameKeys` 已删除，改用 `defaultToolbar` 字符串（唯一事实来源） |

---

## 5. 一句话路线建议

1. ~~**先做（半天）**：Undo/Redo 按钮 + 清除格式~~ → ✅ 已完成（Focus 按决策默认不启用）。
2. **再做（1 天）**：`shouldRerenderOnTransaction:false` + ~~v-model 写回防抖~~ ✅ + ~~CharacterCount 替换手工计数~~ ✅ + 映射 i18n/aria-label。
3. **按业务做**：Markdown（含导出）→ 拖拽手柄 / Emoji / 提及 → Table of Contents → 协作。
4. ~~**随做随改**：`docs/PROJECT.md` 中 Naive UI 与 `--tiptap-*` 前缀的漂移描述~~ → ✅ 已同步（2026-09-07）。

---

*本文档基于当前代码评审整理，功能与优化项均按「扩展即按钮」架构落位，不与现有 v-model / 主题 / i18n 机制冲突。*