# Toolbar 自定义方案（已实现）

> 需求：选择哪些按钮渲染、哪些不渲染。
> 设计：**include（数组过滤）+ exclude（排除）双属性**，向后兼容（缺省渲染全部），浮动菜单同步可配置。

## 1. API

### `toolbar` prop

```vue
<!-- 1) 缺省：渲染全部按钮（原行为） -->
<TipTapEditor v-model="content" />

<!-- 2) 数组 = include：只渲染这些按钮，按给定顺序 -->
<TipTapEditor v-model="content" :toolbar="['bold', 'italic', 'heading', 'textAlign']" />

<!-- 3) 对象：include（可省 = 全部）+ exclude（排除个别） -->
<TipTapEditor v-model="content" :toolbar="{ exclude: ['audio', 'findAndReplace'] }" />
<TipTapEditor v-model="content" :toolbar="{ include: ['bold', 'heading', 'table'], exclude: ['table'] }" />

<!-- 4) 隐藏工具栏 -->
<TipTapEditor v-model="content" :toolbar="[]" />
```

### 浮动菜单同步可配置

```vue
<!-- bubble-menu / floating-menu 缺省跟随 toolbar 配置 -->
<TipTapEditor v-model="content" :toolbar="{ exclude: ['audio'] }" />

<!-- 单独覆盖（缺省回退到 toolbar） -->
<TipTapEditor
  v-model="content"
  :toolbar="{ exclude: ['audio'] }"
  :bubble-menu="['bold', 'italic', 'link']"
  :floating-menu="{ exclude: ['taskList'] }"
/>
```

类型：`Toolbar = string[] | { include?: string[]; exclude?: string[] }`（导出）。

## 2. 按钮 key 列表（= 扩展名）

| key | 按钮 | key | 按钮 |
| --- | --- | --- | --- |
| `bold` | 加粗 | `link` | 链接（弹窗） |
| `italic` | 斜体 | `codeBlock` | 代码块 |
| `strike` | 删除线 | `details` | 折叠块 |
| `underline` | 下划线 | `image` | 图片 |
| `code` | 行内代码 | `video` | 视频 |
| `highlight` | 高亮 | `audio` | 音频 |
| `subscript` | 下标 | `blockquote` | 引用 |
| `superscript` | 上标 | `color` | 文字颜色 |
| `heading` | 标题（菜单） | `fontFamily` | 字体（菜单） |
| `horizontalRule` | 分隔线 | `table` | 表格（菜单） |
| `bulletList` | 无序列表 | `findAndReplace` | 查找替换 |
| `orderedList` | 有序列表 | `invisibleCharacters` | 隐藏字符 |
| `taskList` | 任务列表 | `textAlign` | 对齐（菜单） |
| `blockquote` | 引用 | `hardBreak` | （无按钮，不进工具栏） |

> bubble-menu 可用 key：`bold` `italic` `strike` `highlight` `link`
> floating-menu 可用 key：`heading` `horizontalRule` `bulletList` `taskList`

## 3. 实现

- `src/types/index.ts`：`Toolbar` 类型 + `resolveToolbar()` 纯函数（include 保持用户顺序、忽略未知 key、exclude 优先生效）；
- `tool-bar/index.vue`：按扩展名过滤 `extensionManager.extensions`（有 `button` 的扩展）；
- `bubble-menu` / `floating-menu`：内部按钮改为注册表 `[{ key, component }]` + `resolveToolbar` 过滤；
- `Table` 扩展名从 `tableKit` 规范为 `table`（`extend({ name: "table" })`）；
- `TipTapEditor` 新增 props：`toolbar` / `bubbleMenu` / `floatingMenu`（后两者缺省回退 `toolbar`）。

## 4. 验证

- `resolveToolbar` 9 项单测全部通过（顺序/排除/未知 key/空数组/全排除）；
- `pnpm build` + dev 冒烟通过。
