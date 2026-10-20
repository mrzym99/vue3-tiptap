import { writeFileSync } from "node:fs";
import { describe, it } from "vitest";
import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import builtinExtensions from "../components/extensions";
import { createEditorAgent } from "./agent";

const log: string[] = [];

describe("agent e2e: reproduce schema rejection", () => {
  for (const round of [1, 2, 3]) {
    it(`attempt ${round}`, async () => {
      const editor = new Editor({
        element: document.createElement("div"),
        extensions: [Document, Paragraph, Text, ...builtinExtensions],
        // 非空文档，模拟用户反复重试后的真实状态
        content: "<h1>特仑苏品牌介绍</h1><p></p>",
      });
      const agent = createEditorAgent(editor, {
        baseURL: "https://ark.cn-beijing.volces.com/api/coding/v3",
        apiKey: import.meta.env.VITE_AI_API_KEY,
        model: "glm-5.3-flash",
        onEvent: (e) => {
          if (e.type === "tool_call") log.push(`CALL: ${e.name} ARGS: ${JSON.stringify(e.args)}`);
          if (e.type === "tool_result") log.push(`RES: ${JSON.stringify(e.result).slice(0, 200)}`);
        },
      });
      await agent.send("介绍一下特仑苏牛奶品牌并插入到文档中：要有标题、要点清单和产品系列表格。");
      log.push(`DOC: ${editor.getHTML().slice(0, 300)}`);
      log.push("=========");
    }, 180_000);
  }
  it("writes log", () => {
    writeFileSync("/tmp/probe-doc.txt", log.join("\n"));
  });
});
