# 编辑器功能补充计划（v1.1.6 → 下一版）

## Context

用户想确认 vue3-tiptap（npm 库 `@yumine9/vue3-tiptap`）还有什么功能缺口。对照 `docs/feature-gaps-and-optimizations.md` 与当前代码核实后，已确认完成：Markdown、Mention、DragHandle、FontSize、媒体拖拽改尺寸、Link autolink、v-model 防抖、aria-label。

**本次拍板范围**（2026-11-11 用户确认）：Emoji 面板、目录 ToC、首行缩进/行距/RTL、数学公式（KaTeX 懒加载）、小优化打包。协作依赖（`@tiptap/extension-collaboration` + `@tiptap/y-tiptap`，已在 dependencies 但零引用）本次先留着不动。

## 关键发现（可复用）

- 工具栏 key = 扩展名：`src/components/ui-editor/toolbar/index.vue` 按扩展名匹配按钮，每个扩展通过 `button` 选项（`src/utils/button.ts` 的 `withButton`）声明按钮。
- 下拉菜单按钮模板：`src/components/ui-editor/toolbar/menu-buttons/FontSizeMenuButton.vue`（ActionMenuButton + `EXTActionButtonProps`）。
- 弹层面板可复用 `Popover`（`src/components/ui-common/popover/`，ColorMenuButton/TableMenuButton 即此模式）。
- 行距是官方子路径导出：`@tiptap/extension-text-style/line-height`（已安装，`setLineHeight/unsetLineHeight` 命令），无需新依赖。
- 面板挂载点：`src/components/ui-editor/extension-panels/index.vue` 读扩展的 `panel` 选项（Ai 面板同款）。
- i18n：`src/locales/en.ts` / `zh.ts` + demo 的 `demo/zh-TW.ts`（需同步补词条）。
- 新依赖需安装（2026-11-12 已核实全部存在，最新 3.33.1，caret 范围内兼容 ^3.32.0）：`@tiptap/extension-emoji`、`@tiptap/extension-table-of-contents`、`@tiptap/extension-mathematics`。
  - `emojibase-data` 是 extension-emoji 的传递依赖（^17），但面板要直接 import 数据，需显式声明为直接依赖。
  - `extension-mathematics` 未声明 katex 依赖（deps/peers 仅 @tiptap/core+pm），katex 由本项目作为依赖引入并动态 import()。
  - `extension-table-of-contents` 仅多一个 uuid 传递依赖，无额外负担。

## Files to modify

**新增扩展**（`src/components/extensions/`，均走「扩展即按钮」约定）：
- `Emoji.ts` — @tiptap/extension-emoji；按钮 = Popover 面板（搜索框 + 常用/分类网格），插入 emoji
- `TableOfContents.ts` — @tiptap/extension-table-of-contents；按钮 = Popover 列出各级标题（缩进层级），点击滚动定位
- `LineHeight.ts` — 子路径导出 LineHeight；按钮 = LineHeightMenuButton（照抄 FontSizeMenuButton 模式，档位如 1 / 1.15 / 1.5 / 1.75 / 2 / 默认）
- `FirstLineIndent.ts` — 自研小扩展：paragraph/heading 的 `textIndent` 属性，toggle 2em；图标按钮
- `TextDirection.ts` — 自研小扩展：全局 `dir` 属性（ltr/rtl/auto），下拉或双态按钮（RTL 面向阿语等，LTR 恢复）
- `Mathematics.ts` — @tiptap/extension-mathematics；KaTeX 用动态 `import()` 懒加载（不进主包）；按钮插入 inline math 节点，光标就位输入公式

**修改**：
- `src/components/extensions/index.ts` — 注册进 builtinExtensionMap + re-export
- `src/components/ui-editor/toolbar/menu-buttons/` — 新增对应按钮组件；`buttons/` 新增 IndentButton 等
- `src/constants/index.ts` — defaultToolbar 加新 key（emoji / lineHeight / indent / textDirection / mathematics / tableOfContents 合理分组）
- `src/locales/en.ts`、`zh.ts`、`demo/zh-TW.ts` — 新词条
- `src/composables/useEditorModel.ts` — getHTML 结果缓存（仅文档变化时重算）；外部 setContent 的 undo 栈问题按实测处理（v3 若无公开 API 清栈则文档注明为已知行为）
- `src/theme/light.ts` / `dark.ts` — `--tiptap-color-text-muted` 加深半档（light #9CA3AF→gray-500 档，dark #7A7A7A→取实测可读值）
- 重复样式收敛：ColorMenuButton / FindAndReplaceButton / TableMenuButton 复制的菜单项/trigger 样式抽到 ui-common 共享
- `demo`（App.vue/useDemoConfig）展示新功能；`docs/feature-gaps-and-optimizations.md` 勾掉已完成项

## Steps

- [ ] 安装依赖：@tiptap/extension-emoji + emojibase-data（显式声明）、@tiptap/extension-table-of-contents、@tiptap/extension-mathematics + katex
- [ ] LineHeight 扩展 + LineHeightMenuButton（最简单，先打通流程）
- [ ] FirstLineIndent 自研扩展 + 按钮
- [ ] TextDirection 自研扩展 + 按钮
- [ ] Emoji 扩展 + 搜索面板（Popover + emojibase-data）
- [ ] TableOfContents 扩展 + 标题定位弹层
- [ ] Mathematics 扩展 + KaTeX 动态 import + 按钮
- [ ] index.ts 注册、defaultToolbar、i18n 三语词条
- [ ] 小优化：getHTML 缓存、muted 对比度、重复样式收敛、setContent undo 栈核实
- [ ] demo 更新 + 文档勾选

## Verification

- `pnpm test`（vitest，现有 markdown/index 测试不回归；新扩展补最小单测）
- `pnpm build` + `pnpm build:lib` 通过；确认 KaTeX 产物在独立 chunk（不进主包）
- `pnpm dev` 手动验证：各新按钮可用、插入内容 undo/redo 正常、RTL 缩进在 demo 可见、三语词条无裸 key
