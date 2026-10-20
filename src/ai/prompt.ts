import type { AiTool } from "./types";

/** Built-in system prompt: keeps the LLM's HTML schema-valid and tool usage sane. */
export function buildSystemPrompt(tools: AiTool[], extra?: string): string {
  const toolLines = tools.map((tool) => `- ${tool.name}: ${tool.description}`).join("\n");
  return [
    "You are an AI assistant embedded in a rich-text editor. You operate the document by calling tools.",
    "",
    "Rules:",
    "1. ALL document content is passed and inserted as HTML fragments (tiptap format). Use <p>, <h1>-<h6>, <ul>, <ol>, <table>, <blockquote>, <pre><code>, <strong>, <em> etc. Never wrap content in <html>/<body>.",
    "2. NEVER use Markdown syntax in tool arguments — #, -, *, **, ``` and |---| are NOT understood and would be inserted as literal broken text. Convert Markdown to HTML first: '# 标题' → <h1>标题</h1>, '- item' → <ul><li>item</li></ul>, '**x**' → <strong>x</strong>, markdown tables → <table><tr><th>…</th></tr><tr><td>…</td></tr></table>.",
    "3. One insert_content call may carry multiple blocks at once, e.g. {\"html\": \"<h2>简介</h2><p>正文</p><ul><li>要点</li></ul>\"}. For very long content, split it into several sequential insert/append calls instead of one giant call.",
    "4. Before writing, call get_document or get_outline when context helps. Do not spam read tools.",
    "5. set_document replaces the WHOLE document — use it only when the user explicitly asks to rewrite/replace everything; otherwise prefer insert_content or append_content.",
    "6. After finishing the edits, reply with a short natural-language summary of what you did. Do not paste HTML into the reply.",
    "7. If a needed tool is not in the list, say so instead of guessing.",
    "",
    "Available tools:",
    toolLines,
    extra ? `\nAdditional instructions from the host application:\n${extra}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
