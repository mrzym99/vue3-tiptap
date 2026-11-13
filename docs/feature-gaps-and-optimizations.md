# 功能缺口与优化清单

> 整理时间：2026-08，**2026-09-07 复核更新**。基于对现有扩展集（`src/components/extensions/index.ts`）、工具栏按钮、`package.json` 依赖与核心组件逻辑（`src/components/index.vue`）的评审。
>
> 结论一句话：**「能编辑的功能」已经相当全（文本/列表/表格/媒体/折叠/链接/查找替换），P0（Undo/Redo、清除格式、字符统计）已完成；剩余缺口集中在「编辑体验（拖拽、缩进）」「富文本常见高级能力（字体大小 / Markdown / 目录 / Emoji / 提及）」「性能与 Reactive 细节」三块。**

---

## 1. 现状盘点（2026-08 快照）

**已启用**：Bold / Italic / Underline / Strike / Code / Highlight / Subscript / Superscript / Color / FontFamily / Typography / Heading / HorizontalRule / Blockquote / TextAlign / CodeBlock / Details / Bullet·Ordered·TaskList / Link / Image·Video·Audio + FileHandler（Youtube/Twitch 已于 2026-10-16 移除，YouTube 链接由 Video 的 URL 转嵌入覆盖） / Table（可调列宽）/ FindAndReplace / InvisibleCharacters / NodeRange / HardBreak / **Undo·Redo + ClearFormatting + CharacterCount** / **Gapcursor·Dropcursor·TrailingNode** / BubbleMenu / FloatingMenu。

**已移除**：`UniqueId`（2026-10-16：未配置 `types` 从不生效，且按数据保真原则不自动写入节点属性；需要时宿主自行引入 `@tiptap/extension-unique-id`）。

**未安装 / 未集成**：`extension-emoji`、`extension-mathematics`（需 katex）、`extension-table-of-contents`、`extension-ruby-text`、`extension-collaboration` 系列（Yjs peer 已随 drag-handle 装入，但未启用）等。

---

## 2. 建议补充的插件（按优先级）

> 按钮形态沿用项目「扩展即按钮」约定（`图标按钮` / `下拉菜单` / `弹窗` / `无按钮`）。集成走法见 `docs/tiptap-extensions-integration-plan.md` §4。

### 2.1 P0 — 高价值 / 低风险，强烈建议

> ✅ **已完成（2026-09）**：Undo / Redo、清除格式、CharacterCount（含 v-model 写回防抖）。

| 扩展 / 能力 | 按钮形态 | 说明 | 状态 |
| ----------- | -------- | ---- | ---- |
| **Undo / Redo** | 图标按钮 ×2 | `@tiptap/extension-undo-redo`（历史插件）+ 自定义 `Undo` / `Redo` 按钮（带 `canUndo()/canRedo()` 禁用态） | ✅ 已完成 |
| **清除格式（Clear Formatting）** | 图标按钮 | 一键移除选区上的所有 **mark**（bold/italic/code/highlight/color/fontFamily 等）+ 重置 heading。 | ✅ 已完成 |
| **块级拖拽手柄（Drag Handle）** | 无按钮 | ✅ 已完成：官方 `@tiptap/extension-drag-handle`（3.32+）的薄封装，落位 `src/components/extensions/DragHandle.ts`，仅重写 `render()` 补回抓手图标；nested 规则 / drop-restore / 边缘检测全部由官方包提供。已知上游缺口：无滚动跟随（官方未实现）、无 `ariaLabel` 选项（wrapper 以 `aria-label="Drag to move"` 兜底）。 | ✅ 已完成 |
| **字数 / 字符统计（CharacterCount）** | 无按钮（复用底部统计） | 已用 `@tiptap/extensions` 的 `CharacterCount` 取代手写 `getEditorTextLength`（增量计算），配合 v-model 写回防抖。 | ✅ 已完成 |
| **Markdown 导入/导出** | 弹窗或面板 | `@tiptap/markdown`（`turndown + markdown-it`）来回转换 HTML。适合需要「复制为 Markdown / 粘贴 Markdown」的场景；若暂不需要，可归到 P1。 | ⬜ 未做 |

### 2.2 P1 — 中价值 / 中等成本

| 扩展 / 能力 | 按钮形态 | 说明 |
| ----------- | -------- | ---- |
| **字体大小（Font Size）** | 下拉菜单 | ✅ 已完成（2026-09）：直接使用已安装 `@tiptap/extension-text-style/font-size` 子路径导出（无需自研，也无需新依赖），12/14/16/18/20/24/30 px + 默认共 8 档，模式与 `FontFamily` 一致（`FontSizeMenuButton`）。 |
| **图片/视频拖拽改尺寸** | 节点悬浮角标 | ✅ 已完成（2026-09）：Image/Video 节点复用 `utils/resizableMediaView.ts`（基于 tiptap 内置 `ResizableNodeView`）——四角手柄、等比锁定（Shift 解锁）、尺寸写回 `width`/`height` attrs；选中/悬停显示手柄。注意视频是 iframe（嵌套文档），拖拽中通过 `data-resize-state="true"` 时 `pointer-events:none` 让 `mouseup` 回到宿主文档，避免松手后仍处拖拽态。媒体最宽不超过容器宽度，选中用 `outline`（不占布局、无重排）。 |
| **Emoji** | 按钮 + 面板 | ✅ 已完成（2026-11-12）：官方 `@tiptap/extension-emoji` 薄封装（`src/components/extensions/Emoji.ts`，注入 `emojis` 数据集与按钮），`EmojiMenuButton` Popover：搜索（按名称/shortcode/tag 过滤，空查询截取前 500 条防卡顿）+ 8 列网格，插入走 `setEmoji(shortcode)`。 | ✅ 已完成 |
| **提及 @（Mention + Suggestion）** ✅ 已完成（2026-09-07） | 无按钮 | `@tiptap/extension-mention` + `@tiptap/suggestion`，输入 `@` 出建议弹层；数据源由宿主注入：`Mention.configure({ items })`（静态列表自动按 query 过滤，或传 `({ query, editor }) => items` 同步/异步解析函数，模式同 `Image.configure({ upload })`）。弹层由 `@tiptap/suggestion` 的 managed mount 定位（fixed 策略 + floating-ui autoUpdate），并 reparent 进主题根节点以继承 `--tiptap-*` 变量。 |
| **目录（Table of Contents）** | 无按钮 → 右侧 hover 导轨 | ✅ 已完成：官方 `@tiptap/extension-table-of-contents` 薄封装 + 独立组件 `src/components/ui-editor/outline/index.vue`（编辑器右缘折叠刻度，hover 展开标题列表、按 level 缩进、当前标题高亮、点击平滑滚动；storage 非响应式，靠 transaction 版本号驱动刷新）。工具栏不再有目录按钮，只有该扩展加载时才渲染导轨。 | ✅ 已完成 |
| **基础 PM 兜底扩展** | 无按钮 | `DropCursor` / `GapCursor` / `TrailingNode`（trailing 保证文档末尾始终可插入）；均由 `@tiptap/extensions` 直接导入并注册，与 `@tiptap/starter-kit` 无关。 |

### 2.3 P2 — 重 / 按需（接入前单独评估）

| 扩展 / 能力 | 按钮形态 | 说明 |
| ----------- | -------- | ---- |
| **数学公式（Mathematics）** | 按钮 + 弹窗 | ✅ 已完成（2026-11-12）：官方 `@tiptap/extension-mathematics` 薄封装 + `MathMenuButton`（弹窗输入 LaTeX，行内/块级两种插入，选中已有公式时回填编辑）。弹窗内置 KaTeX 预览的公式模板条（默认 10 个，`Mathematics.configure({ templates })` 可换，点击填入后编辑）；KaTeX 静态引入（`shortcut:` 注释见 `Mathematics.ts`）：不 import 该扩展的宿主零成本；如需独立 chunk 可动态 `import()` 本文件。 | ✅ 已完成 |
| **注音（Ruby Text）** | 图标按钮 | `@tiptap/extension-ruby-text`；东亚文本注音，低风险低频。 |
| **实时协作（Collab）** | 无按钮 | `extension-collaboration + -caret + @tiptap/y-tiptap + Yjs`，**需配套后端**；建议在 `NodeRange` 之上再评估（UniqueId 已移除，需要节点锚定时一并引入 `extension-unique-id`）。 |
| **文字方向 RTL / 行距 / 首行缩进** | 下拉/按钮 | ✅ 已完成（2026-11-12）：行距自研 `LineHeight`（默认 1.15/1.5/1.75/2，档位由 `lineHeights` 选项给，`LineHeightMenuButton` 读选项渲染）——**块级** `style="line-height"` 全局属性（paragraph/heading），因为官方的 `@tiptap/extension-text-style/line-height` 是 `textStyle` mark（`<span style="line-height">`），比块自身 CSS 的 `line-height: 1.75` 小的时候被行盒 strut 吃掉、肉眼毫无变化；首行缩进自研 `FirstLineIndent`（`text-indent` 全局属性，2em 档 toggle，`IndentButton`）；文字方向**已移除**（2026-11-13，中英文产品不需要 RTL；官方 `@tiptap/core` 自带 `textDirection` 扩展 + `setTextDirection/unsetTextDirection` 命令，真有阿语需求直接用官方版）。中文场景首行缩进已覆盖。 | ✅ 已完成 |

---

## 3. 建议「开启/补全却未开启」的现有能力

| 项目 | 现状 | 建议 |
| ---- | ---- | ---- |
| **Focus（聚焦高亮）** | 已移除（2026-10-16） | 需要时宿主自行引入 `@tiptap/extension-focus` 并配置 `className: "has-focus"`（样式需自带）。 |
| **StarterKit** | 已启用（项目自建工厂，非 `@tiptap/starter-kit`） | `StarterKit.configure({...})` 遍历内置扩展表（`false` 禁用 / 对象即 configure）；DropCursor / GapCursor / History / TrailingNode 由 `@tiptap/extensions` 直接注册。 |
| **Link 自动识别** | Link 已配置 | 确认 `autolink` / `HTMLAttributes` 按需开启，补齐「粘贴 / 输入时自动转链接」的体验。 |

---

## 4. 优化建议（非新增功能，提升体验与健壮性）

### 4.1 性能

1. **v-model 写回防抖**：`src/components/index.vue` 的 `onUpdate` 每次事务都执行 `editor.getHTML()` 并写回父组件。大文档下每敲一个字符都要 O(n) 序列化 + 触发父组件重渲染。
   - 建议：`onUpdate` 后 **300ms 防抖**再 `getHTML()` 写回；真·即时需要可拆「本地编辑不重渲染 + 节流回写」。
   - `getHTML()` 结果可缓存，仅当文档 version 变化时重算。
   - ✅ **已完成（2026-11-12）**：`useEditorModel.getModelValue` 按文档节点身份缓存 HTML（doc 不可变，同一文档不重复序列化）。
2. **关闭不必要的 Vue 重渲染**：~~`useEditor({ shouldRerenderOnTransaction: false })`~~ → **不适用（2026-09-07 核实）**：该选项是 `@tiptap/react` 专属（v3 默认已改为 false，配合 `useEditorState` 精细订阅）；`@tiptap/vue-3` 没有此选项，其内部已用 `useDebouncedRef`（双层 `requestAnimationFrame` 延迟 trigger 的响应式 state/storage）合并同帧事务，模板中读 `editor.can()` / `isActive()` 自动刷新且天然去抖，无需改造。
3. **字数统计改用 CharacterCount**：✅ **已完成**，底部统计已改用 `editor.storage.characterCount`（见 2.1）；超限不再自动截断（2026-10-16 决策：数据保真，仅警告）。
4. **重扩展懒加载**：Mathematics(KaTeX)、Markdown(turndown) 等用 `import()` 按需，不进首屏主包（构建已按 group 分包，见 `vite.config.ts`）。
   - **StarterKit 全量打包**：`StarterKit` 急切 `import` 全部内置扩展（含 image/video/audio 等媒体扩展），且本地自定义 wrapper/UI 代码在库构建中被单 chunk 输出（`vite.lib.config.ts` 单入口、无分包），故 `@tiptap/*` 虽已 external，本地代码无法 tree-shake。需更小体积时用命名导出手选扩展（`[Bold, Italic, Image]`）替代全套 kit；按扩展子路径分包属后续工作。

### 4.2 响应式 / 正确性细节

| 问题 | 说明与建议 |
| ---- | ---------- |
| **`placeholder` prop 不是响应式** | ✅ **已修复（2026-09-07）**。注意 tiptap v3 的 `extension.options` 是 getter（每次访问重新执行 `addOptions()` 返回新对象），直接 mutate 无效；最终方案是 `placeholder` 选项传**函数闭包**（插件每次重建 decoration 时调用），配合 watch 派发 selectionSet 事务强制重建。 |
| **`extensions` prop 仅在创建时读一次** | 列表渲染期改扩展不生效；属约定行为，建议文档注明「扩展必须在挂载前确定」。 |
| **外部 `setContent` 不清空 undo 栈** | ✅ **已核实（2026-11-12）**：v3 `setContent` 走普通 `tr.replaceWith` 事务，外部重置内容**可被 undo 回退**（可视为正确行为）；如需「重置即清历史」由宿主自行处理。 |
| **`v-model` 初值为空字符串** | 已有 `pendingContent` 与「空文档不回写 `<p></p>`」的防护，逻辑正确；保留。 |

### 4.3 可用性 / 无障碍（A11y）

1. **图标按钮缺 `aria-label`**：✅ **已完成（2026-09-07）**。`ActionButton` 统一注入 `:aria-label="tooltip"` 与 `:aria-pressed`（切换态）、下拉按钮 `:aria-expanded`（含 ColorMenuButton / FindAndReplaceButton 自带 trigger）；i18n 词条即无障碍名称。剩余：配色对比度可再调。
2. **配色对比度**：✅ **已修复（2026-11-12）**：`--tiptap-color-text-muted` light 由 gray-400 (#9CA3AF) 加深为 gray-500 (#6B7280)。
3. **键盘可达**：气泡菜单 / 下拉菜单 / 颜色面板的事件已 `mousedown` 外部关闭；确保面板内支持 `Esc` 与 `Tab` 聚焦（下拉/弹窗已支持 Esc，核对一致）。

### 4.4 结构 / 一致性（代码质量）

1. **重复样式收敛**：~~建议抽成共享 `ui-common`~~ **评估后不做（2026-11-12）**：实际重复仅各文件 scoped 里的 3–4 行 flex/gap 声明，抽共享类需引入全局样式或包装组件，得不偿失；trigger 样式已由 `ActionButton` 统一。
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

1. ~~**先做（半天）**：Undo/Redo 按钮 + 清除格式~~ → ✅ 已完成（Focus 已于 2026-10-16 移除）。
2. **再做（1 天）**：`shouldRerenderOnTransaction:false` + ~~v-model 写回防抖~~ ✅ + ~~CharacterCount 替换手工计数~~ ✅ + 映射 i18n/aria-label。
3. **按业务做**：Markdown（含导出）→ 拖拽手柄 / Emoji / 提及 → Table of Contents → 协作。
4. ~~**随做随改**：`docs/PROJECT.md` 中 Naive UI 与 `--tiptap-*` 前缀的漂移描述~~ → ✅ 已同步（2026-09-07）。

---

*本文档基于当前代码评审整理，功能与优化项均按「扩展即按钮」架构落位，不与现有 v-model / 主题 / i18n 机制冲突。*