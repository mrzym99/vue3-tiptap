# AI Tool Kit：让 AI 调用编辑器方法写文档

## 概述

为 `@yumine9/vue3-tiptap` 新增 AI 工具层，采用**两层架构**：

1. **工具层（纯 headless）**：`createAiToolkit(editor)` 把编辑器能力封装成一组标准化工具（JSON Schema 定义 + 执行器），宿主应用拿去接任意 LLM。
2. **Agent 层（可选）**：`createEditorAgent()` 提供开箱即用的 agent 循环（OpenAI 兼容 chat completions + tool calling，原生 fetch，不加依赖），并附一个基于现有 ui-common 组件的聊天面板。

用户只需在面板里描述（"写一篇关于 X 的介绍，带表格"），AI 自动调用工具操作文档。

## 公共 API

推荐用法是把 AI 作为一个普通扩展接入（从包根导入，与 StarterKit 平级；它**不在** StarterKit 内置列表里，需显式配置）：

```ts
import { StarterKit, Ai } from "@yumine9/vue3-tiptap";

const extensions = [
  StarterKit.configure({}),
  Ai.configure({ baseURL, apiKey, model, confirmDangerous }), // 聊天悬浮按钮/面板自动挂载，不进 toolbar
];
```

headless 工具层与 agent 仍从 `@yumine9/vue3-tiptap/ai` 子路径导出，供自组 UI 的宿主使用：

```ts
import { AiPanel, createAiToolkit, createEditorAgent } from "@yumine9/vue3-tiptap/ai";
```

```ts
// 工具层
createAiToolkit(editor: Editor, options?: AiToolkitOptions): AiToolkit

interface AiToolkit {
  tools: AiTool[];                     // 带参数 JSON Schema 的工具定义
  execute(name: string, args: unknown): Promise<AiToolResult>; // 执行入口
  getContent(): string;                // 当前 HTML（给 LLM 做上下文）
  getOutline(): OutlineItem[];         // 标题大纲
}

interface AiTool {
  name: string;
  description: string;                 // 给 LLM 看的英文描述
  parameters: JSONSchema;
  danger?: boolean;                    // 破坏性操作，执行前需确认
  run(args: any, ctx: { editor: Editor }): Promise<AiToolResult> | AiToolResult;
}

interface AiToolResult { ok: boolean; message?: string; }

interface AiToolkitOptions {
  /** 破坏性操作确认回调；不传则拒绝执行 danger 工具（fail-safe） */
  confirmDangerous?: (tool: AiTool, args: unknown) => Promise<boolean> | boolean;
  /** 只注册当前编辑器可用的工具（默认按 editor.can() / command 存在性过滤） */
  onlyAvailable?: boolean; // 默认 true
}
```

```ts
// Agent 层
createEditorAgent(editor: Editor, config: AgentConfig): EditorAgent

interface AgentConfig {
  baseURL: string;        // OpenAI 兼容端点，如 https://api.openai.com/v1；注意 CORS（见下）
  apiKey: string;
  model: string;
  systemPrompt?: string;  // 追加到内置系统提示词之后
  confirmDangerous?: AiToolkitOptions["confirmDangerous"];  // 面板不提供，宿主在创建 agent 时接线
  onEvent?: (e: AgentEvent) => void;  // 自动注册为首个监听者（兼容保留）
}

interface EditorAgent {
  send(userText: string): Promise<void>;  // 完整一轮：LLM → tool calls → 结果回传 → LLM …
  abort(): void;
  history: ChatMessage[];                 // 面板渲染用
  on(listener: (e: AgentEvent) => void): () => void;  // 订阅事件流（多监听者），返回退订函数；自定 agent 实现必须实现
}
```

`AiPanel` 只管 UI：宿主自己创建 agent 并作为 prop 传入（`<AiPanel :editor="editor" :agent="agent" />`），可替换为任意实现 `EditorAgent` 接口的 agent。

## 工具清单（约 20 个，映射到库内已有 extension）

**查询类（只读，不进确认）**
- `get_document` — 返回 HTML 与字符数
- `get_selection` — 选区内容
- `get_outline` — 标题大纲（层级+文本+位置）

**内容生成类**
- `set_document`（danger）— 用 HTML 整体替换文档
- `insert_content` — 在光标处/文末/指定标题后插入 HTML
- `append_content` — 文末追加

**格式类**（作用于选区或指定位置）
- `format_text` — bold/italic/underline/strike/code/highlight/sub/sup 统一入口（mark 名 + 开关）
- `set_heading` — 设置标题级别 1–6 / 还原正文
- `set_text_align`、`set_color`、`set_font_size`、`clear_formatting`

**结构类**
- `insert_list` — bullet/ordered/task
- `insert_blockquote`、`insert_code_block`（带语言）、`insert_horizontal_rule`
- `insert_table`（行/列/表头）、`insert_link`、`insert_details`（折叠块）

**媒体类**
- `insert_image` / `insert_video` / `insert_audio`（URL 方式；上传走宿主自己的 ImageUploader，不在工具内）

**查找替换**
- `find_replace`（复用 FindAndReplace extension 的 command）

内容参数一律用 **HTML 字符串**（tiptap `setContent`/`insertContent` 原生格式，LLM 生成 HTML 可靠且有 system prompt 约束）。

## 执行与安全模型

- 所有写操作走编辑器正常事务 → 自动进 UndoRedo 历史，用户可 **Ctrl+Z 逐步撤销**（无需额外快照机制）。
- `danger` 工具（`set_document`）执行前必须过 `confirmDangerous`；未配置该回调时工具层直接返回失败（fail-safe）。宿主创建 agent 时自行接线（如 `confirmDangerous: (tool) => window.confirm(...)`）。
- `onlyAvailable`（默认开）：宿主禁用了 Table extension 时，表格工具不出现在 `tools` 里，LLM 不会误调。

## Agent 循环（`src/ai/agent.ts`）

原生 `fetch` 调 OpenAI 兼容 `/chat/completions`，`tool_choice: "auto"`；循环：发送历史+工具定义 → 收到 tool_calls → `toolkit.execute()` → 把结果以 `role: "tool"` 追加回传 → 直到返回纯文本（上限 10 轮防失控）。`onEvent` 推送 `tool_call` / `assistant_text` / `error` 事件。`abort()` 用 AbortController。

## UI：聊天面板（可选组件，按需引入）

`AiPanel`（`src/ai/components/ai-panel/`）：输入框 + 消息列表 + 工具调用气泡（显示"正在插入表格…"类状态）。**只复用库内已有的 ui-common 原语**（Input/Button/Dialog/ThemeProvider），文案走现有 `useEditorLocale` 机制，`zh`/`en` locale 包新增 `ai.*` 键。不引入任何新依赖。

## 文件布局与导出

```
src/ai/
  types.ts          # AiTool / AiToolkitOptions / AgentConfig / AgentEvent
  toolkit.ts        # createAiToolkit + execute 分发 + danger 确认
  tools/
    query.ts  content.ts  format.ts  structure.ts  media.ts
  agent.ts          # createEditorAgent（fetch 循环）
  prompt.ts         # 内置系统提示词（HTML 输出约束、工具使用指引）
  components/ai-panel/
```

`@yumine9/vue3-tiptap/ai` 子入口（`src/ai/index.ts`）导出：`createAiToolkit`、`createEditorAgent`、`buildSystemPrompt`、`AiPanel` 组件及全部 AI 类型。主入口无 AI 导出。peerDependencies 不变。

## 边界与失败模式

- 编辑器 `readonly` 时工具层 `execute` 直接拒绝全部写操作。
- LLM 产出的 HTML 先经 tiptap 的 schema 解析（`insertContent` 天然只保留 schema 内节点），非法标签自动降级为纯文本——不额外写 sanitizer。
- Agent 请求失败/超时：`onEvent` 抛 error 事件，面板显示错误且历史保留，可重试。
- 字符数超 `limit` 时写入仍会发生（与手动输入行为一致），由 CharacterCount 的既有截断逻辑处理。

## 测试与验收

- **Vitest 单测（happy-dom，现有测试设施）**：
  1. 工具映射正确性：`format_text` 调 bold 后 `editor.isActive("bold")` 为真；`insert_table` 后 doc 内出现 table 节点。
  2. danger 工具：无 `confirmDangerous` 时 `set_document` 被拒；回调返回 true 时生效且可 undo。
  3. `onlyAvailable`：禁用 Table extension 后 tools 中无 `insert_table`。
  4. readonly 编辑器拒绝写操作。
  5. Agent 循环：mock fetch 返回 tool_calls 序列，断言 execute 被调、tool 结果回传、终止条件正确。
- **手动验收（dev 页）**：dev playground 挂一个面板 + 测试 baseURL，输入"写一篇 Vue3 介绍，含一个对比表格和一个任务清单"，观察工具调用与最终文档、Ctrl+Z 撤销行为、danger 确认弹窗。
- **CORS**：多数 LLM API（OpenAI、火山 Ark 等）不开放浏览器跨域（`Authorization` 不在 `Access-Control-Allow-Headers` 里），**生产环境应由宿主后端代理转发**，`baseURL` 指向自家代理路径；demo 里用 Vite dev server 的 `server.proxy`（`/ai-proxy` → Ark）解决。API key 也因此应放在代理侧，不要打进前端包。
- `pnpm build`（vue-tsc + vite）通过，类型完整导出。

## 假设与默认值（低风险，未另行询问）

- 内容格式用 HTML 而非 Markdown（tiptap 原生，转换成本为零）。
- Agent 协议仅支持 OpenAI 兼容 `/chat/completions`（覆盖绝大多数国产/国际模型服务）。
- 聊天面板为可选组件，宿主不用它也完全可以只用工具层。
- 无流式输出（第一版）；`onEvent` 结构预留，后续可加 SSE。
