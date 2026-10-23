# @yumine9/vue3-tiptap

English | [简体中文](./README.md)

A rich-text editor for Vue 3, built on [@tiptap/vue-3](https://tiptap.dev): auto-collected toolbar, bubble/floating menus, a theming system, and i18n out of the box. An optional AI panel adds conversational editing (rewrite/expand, insert tables and images, …) — it ships its own agent and works with any OpenAI-compatible endpoint.

## Install

```bash
# pnpm
pnpm add @yumine9/vue3-tiptap
# npm
npm install @yumine9/vue3-tiptap
```

## Import the stylesheet (required)

The build extracts all component styles into a standalone `dist/style.css` that the JS never auto-loads — **import it once on the consumer side** (once for the whole library). Skipping it keeps features working but breaks the visuals (unstyled toolbar, misplaced popups, missing placeholder):

```ts
import "@yumine9/vue3-tiptap/style.css";
```

Shipping it separately is intentional: `index.cjs` must work under Node/SSR `require` (importing `.css` there throws), and it keeps consumers in control of overriding styles or running their own CSS pipeline.

## Basic usage

Pass `StarterKit` (all built-in extensions: toolbar, bubble menus, tables, images…); without `extensions` you only get a bare input box:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { TipTapEditor, StarterKit } from "@yumine9/vue3-tiptap";
import "@yumine9/vue3-tiptap/style.css";

const content = ref("<p>hello</p>");
const extensions = [StarterKit.configure({})];
</script>

<template>
  <TipTapEditor v-model="content" :extensions="extensions" theme="light" lang="en" />
</template>
```

Or register it globally and use `<TipTapEditor />` directly (import the styles once; either usage works):

```ts
import "@yumine9/vue3-tiptap/style.css";
import TipTapEditorPlugin from "@yumine9/vue3-tiptap";
app.use(TipTapEditorPlugin);
```

## Extensions

`StarterKit` bundles every built-in extension; if you don't need all of them, import just what you need from the package root:

```ts
// Option A: all-in with StarterKit
import { StarterKit } from "@yumine9/vue3-tiptap";

const extensions = [StarterKit.configure({})];

// Option B: à la carte (Document/Paragraph/Text come built into the component)
import { Bold, Image, Video } from "@yumine9/vue3-tiptap";

const extensions = [Bold, Image, Video];
```

All built-in extensions and their `XxxOptions` types are exported from the package root — mix and match freely; to disable a built-in extension, pass `false`: `StarterKit.configure({ image: false })` (see the config comparison below).

### StarterKit config vs standalone extension config

Both are entry points for configuring the same extension — pick one:

- `StarterKit.configure({ image: { upload } })`: configures (or disables with `false`) the copy bundled in StarterKit; keys are extension names (`image`, `bold`, …). Do **not** also pass an extension with the same name in `extensions`.
- `Image.configure({ upload })`: configures a standalone imported instance; when using it, turn off the bundled copy via `StarterKit.configure({ image: false })` to avoid duplicates.

```ts
const mentionUsers = [
  { id: "1", label: "张三" },
  { id: "2", label: "李四" },
  { id: "3", label: "王五" },
  { id: "4", label: "Alice" },
  { id: "5", label: "Bob" },
];

// Option A: everything via StarterKit, configure/disable by key
const extensions = [
  StarterKit.configure({
    mention: {
      items: mentionUsers,
    },
    dragHandle: false, // disable a built-in extension
  }),
];

// Option B: import and configure standalone
import { Mention } from "@yumine9/vue3-tiptap";
const extensions = [
  Mention.configure({ items: mentionUsers }),
];
```

## Image upload

Configure an `upload` function on the `Image` extension to enable the upload tab in the image dialog: it receives a `File` and returns the stored URL; preview and insertion are handled by the editor. With `StarterKit`, pass it via `configure`:

```ts
import { StarterKit } from "@yumine9/vue3-tiptap";

const extensions = [
  StarterKit.configure({
    image: {
      upload: async (file: File) => {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const { url } = await res.json();
        return url; // return the accessible image URL
      },
    },
  }),
];
```

Same when importing à la carte: `Image.configure({ upload })`. Without `upload`, the dialog only supports pasting an image URL.

## Markdown support

The official `@tiptap/markdown` extension is bundled (included in StarterKit; disable via `StarterKit.configure({ markdown: false })`). It provides markdown import and export:

```ts
// Grab the instance via the `ready` event or the template ref's `editor`
editor.commands.setContent("# Title\n\n**bold**", { contentType: "markdown" });
editor.getMarkdown(); // export a markdown string
```

- `insertContent` / `insertContentAt` also accept `{ contentType: "markdown" }`
- Note: **pasting** plain markdown text is NOT parsed automatically (only explicit `contentType` input and export are handled)

### v-model in markdown

To use the editor as a markdown editor (v-model carries markdown in both directions):

```vue
<TipTapEditor v-model="markdown" content-type="markdown" />
```

The initial content is parsed as markdown and edits are written back as a markdown string; the default `"html"` keeps the old behavior unchanged.

## AI assistant

`Ai` is an opt-in extension (**not part of StarterKit**, needs an API key): once configured, the chat FAB and drawer panel mount themselves and never show up in the toolbar. The AI operates on the document through a built-in tool set (20+ tools: `set_document`, `insert_content`, `insert_table`, `insert_code_block`, `format_text`, `set_heading`, `find_replace`, `get_outline`, … automatically pruned to the extensions you actually enabled):

```ts
import { StarterKit, Ai } from "@yumine9/vue3-tiptap";

const extensions = [
  StarterKit.configure({}),
  Ai.configure({
    baseURL: "https://api.openai.com/v1", // any OpenAI-compatible endpoint
    apiKey: "sk-...",
    model: "gpt-xxx-xxx",
    // Confirmation gate for dangerous tools (e.g. set_document); not provided → rejected fail-safe
    confirmDangerous: (tool) => Promise.resolve(window.confirm(`AI wants to run ${tool.name}, allow?`)),
  }),
];
```

- The agent loop is built in (OpenAI-compatible chat completions + tool calling over native fetch, zero extra dependencies), with history management and abort handled for you
- Other options: `systemPrompt` (appended to the built-in system prompt), `maxRounds` (tool-call rounds per send, default 25), `maxHistoryMessages` (kept-message cap, default 60)
- Building your own UI: the headless layer is exported from the `@yumine9/vue3-tiptap/ai` subpath — `createAiToolkit(editor)`, `createEditorAgent()` and the `AiPanel` component, ready to wire to any LLM

## Common props

| prop                          | description                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `v-model`                     | Content string, format decided by `contentType` (150ms debounced writes; guaranteed sync on unmount/flush) |
| `contentType`                 | `v-model` content format: `"html"` (default) or `"markdown"` (initial parse + write-back both markdown; requires the bundled markdown extension) |
| `limit`                       | Character limit, 0 = unlimited; over-limit content is **never modified** — the counter turns red and `truncated` fires |
| `readonly`                    | Read-only (switchable at runtime)                                                            |
| `theme`                       | `"light" \| "dark"`                                                                          |
| `primaryColor`                | Accent color (any CSS color); toolbar active states, primary buttons, selection etc. follow it |
| `lang`                        | UI language: `"zh" \| "en"`; when omitted it is auto-detected (Chinese if the browser language contains `zh`, otherwise English) |
| `translations`                | Custom locale pack, shallow-merged over the built-in packs; required when `lang` is a non-builtin id, reactive at runtime |
| `toolbar`                     | Toolbar layout, TinyMCE-style string such as `"bold italic \| underline"`; undefined = default |
| `toolbarWrap`                 | Wrap toolbar buttons onto multiple lines (true) instead of horizontal scroll (false)         |
| `bubbleMenu`                  | Bubble menu shown on text selection; off by default — pass a key to enable, `false` toggles off; **available keys: `bold` `italic` `strike` `highlight` `link`** |
| `floatingMenu`                | Floating menu shown on empty lines; off by default — pass a key to enable, `false` toggles off; **available keys: `heading` `horizontalRule` `bulletList`** |
| `showInvisibleCharacters`     | Show hidden characters (spaces, paragraph marks); hidden by default                          |
| `placeholder`                 | Placeholder text; falls back to the locale pack's `placeholder` key                          |
| `extensions`                  | Additional extension array                                                                   |

### Events

| Event | Payload | Description |
|---|---|---|
| `ready` | `editor: Editor` | The editor instance was created and is ready to use (fires once) |
| `focus` | `{ editor, event, transaction }` | The editor gained focus |
| `blur` | `{ editor, event, transaction }` | The editor lost focus |
| `update` | `{ editor, transaction }` | Fires on content changes (before the debounced v-model write-back) |
| `truncated` | `{ limit: number }` | The initial content exceeded `limit`; content is never modified, the counter turns red |

### Exposed via template ref

| Member | Description |
|---|---|
| `focus()` | Focus the editor |
| `blur()` | Blur the editor |
| `clear()` | Clear the content |
| `getHTML()` | Get the current content as an HTML string |
| `getJSON()` | Get the current content as a JSON document |
| `editor` | The underlying Tiptap `Editor` instance (call `commands`, listen to events directly) |

## Toolbar keys

`toolbar` keys map to extension names (`extension.name`). Listed by the default layout's grouping:

| key | extension | description |
|---|---|---|
| `undo` / `redo` | `Undo` / `Redo` | Undo / redo (history plugin provided by `UndoRedo`) |
| `heading` | `Heading` | Heading dropdown, H1–H6; the trigger icon follows the current level |
| `bulletList` | `BulletList` (+ `OrderedList` / `TaskList`) | List dropdown: bullet / ordered / task in one — the latter two have no standalone key |
| `codeBlock` | `CodeBlock` | Code block |
| `bold` / `italic` / `strike` / `code` / `underline` / `highlight` | `Bold` / `Italic` / `Strike` / `Code` / `Underline` / `Highlight` | Inline styles: bold, italic, strikethrough, inline code, underline, highlight |
| `link` | `Link` | Link via URL dialog |
| `superscript` / `subscript` | `Superscript` / `Subscript` | Superscript / subscript |
| `textAlign` | `TextAlign` | Alignment button group (applies to heading/paragraph) |
| `image` | `Image` (+ `FileHandler`) | Image; dialog supports local upload (jpg/png/gif/webp only) |
| `video` | `Video` | Video; YouTube/Bilibili links auto-convert to embed |
| `audio` | `Audio` | Audio |
| `horizontalRule` | `HorizontalRule` | Horizontal rule |
| `blockquote` | `Blockquote` | Blockquote (click again to toggle off) |
| `details` | `Details` (+ `DetailsSummary` / `DetailsContent`) | Collapsible content block |
| `color` | `Color` (+ `TextStyle`) | Text color menu |
| `fontFamily` / `fontSize` | `FontFamily` / `FontSize` | Font family / size menus; the trigger shows the current value, clicking again resets |
| `table` | `Table` (+ `TableRow` / `TableHeader` / `TableCell`) | Table menu (insert + row/column ops) |
| `findAndReplace` | `FindAndReplace` | Find & replace panel |
| `clearFormatting` | `ClearFormatting` | Clear formatting |

Notes: keys whose extension is not loaded are silently ignored (a `console.warn` fires only for the `undefined` default layout); `bubbleMenu` / `floatingMenu` accept only the subset of keys listed in the props table above.

## Docs

- [docs/project.md](docs/project.md) — architecture & directory guide (Chinese)
- [docs/style](docs/style) — theme variables & style conventions (Chinese)
