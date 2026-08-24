# 自研 UI 与主题系统（移除 naive-ui）

> 背景：组件库原先依赖 naive-ui（peer 依赖），但实际只用到 6 个基础组件（Button/Tooltip/Popover/List/ListItem/ColorPicker/Input + ConfigProvider），宿主必须整套安装。
> 决策：**自研轻量 UI 原语 + 自研主题 token 体系，彻底移除 naive-ui**。

## 1. 替换映射

| naive-ui                    | 自研                                           | 位置                                 |
| --------------------------- | ---------------------------------------------- | ------------------------------------ |
| NPopover                    | `popover` 组件                                 | `ui-common/popover/index.vue`        |
| NTooltip                    | `tooltip` 组件（基于 popover，trigger=hover）  | `ui-common/tooltip/index.vue`        |
| NButton                     | 原生 `<button>` + `.tiptap-btn` 样式           | `ui-common/styles.scss`              |
| NInput                      | 原生 `<input>` + `.tiptap-input` 样式          | 同上                                 |
| NList / NListItem           | `<button class="tiptap-menu-item">`            | 同上                                 |
| NColorPicker                | 预设色板（10 色）+ 原生 `<input type="color">` | `menu-buttons/ColorMenu.vue`         |
| NConfigProvider / darkTheme | 纯 CSS 变量应用                                | `ui-common/theme-provider/index.vue` |

## 2. 自研 popover 设计要点

- **定位**：`@floating-ui/dom`（tiptap 生态已用，~10KB），`computePosition` + `offset/flip/shift` middleware；
- **strategy: 'fixed' + 不 Teleport**：浮动层保持在组件树内（CSS 变量与 scoped 样式正常继承），`position: fixed` 同时逃逸编辑器 `overflow: auto` 裁剪；
- **交互**：`trigger="click" | "hover"`（hover 带 120ms 延迟）、点击外部关闭、Esc 关闭、`disabled` 时禁止打开、`v-model:show` 受控；
- **API 对齐**原 NPopover 用法：`placement` / `offset` / `show-arrow` / `disabled` / `v-model:show`。

## 3. 自研主题系统

### 变量分层（`--tiptap-*` 前缀，替代原 `--naive-tiptap-*`）

- **基础 token**（`theme/base.ts`）：尺寸 / 圆角 / 间距 / 字体 / popover 阴影 / tooltip 色 / z-index / input 尺寸；
- **语义 token**（`theme/light.ts` / `dark.ts`）：文字 / 背景 / 边框 / 按钮 hover+active / popover 背景边框 / input 背景边框文字；
- 变量改名：`--naive-tiptap-*` → `--tiptap-*`（全库批量替换，库开发期低成本）。

### 应用与作用域化

```ts
applyTheme(input, target)   // input: 'light' | 'dark' | Partial<Theme>（自定义覆盖）
```

- `theme-provider` 将变量写入**组件根节点**（非 `document.documentElement`）→ **同页多实例不同主题互不干扰**（顺带解决了历史问题）；
- `theme` prop 类型：`ThemeName = 'light' | 'dark'`（仅预设主题，不支持自定义对象）；

## 4. 依赖变化

- **移除**：`naive-ui`（peer + devDependencies）——宿主不再需要安装任何 UI 框架；
- **新增**：`@floating-ui/dom`（dependencies，定位引擎）；
- peerDependencies 仅剩 `vue`。

## 5. 验证

- `pnpm build` / `pnpm build:lib`（ESM+CJS+d.ts+style.css）通过；
- dev 冒烟：popover/tooltip/styles.scss 等新模块 200；
- host 示例（`examples/host`）移除 naive-ui 后重新安装、构建、dev 均通过——**宿主零 UI 依赖验证成功**。
