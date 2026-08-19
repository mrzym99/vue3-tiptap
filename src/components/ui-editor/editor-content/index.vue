<template>
  <EditorContent class="tiptap-editor" :editor="editor" />
</template>

<script setup lang="ts">
import { EditorContent, Editor } from "@tiptap/vue-3";
const props = defineProps({
  editor: {
    type: Editor,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.tiptap-editor {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
.tiptap-editor {
  .tiptap {
    flex: 1;
    outline: none;
    color: var(--tiptap-color-text);
    background-color: var(--tiptap-color-bg);
    padding: 0 var(--tiptap-padding-lg);
    overflow-y: auto;

    h1,
    h2,
    h3 {
      line-height: 1.3;
      margin: 1.5rem 0 0.75rem;
      font-weight: bold;
    }

    h1 {
      font-size: 1.8em;
    }

    h2 {
      font-size: 1.4em;
    }

    h3 {
      font-size: 1.2em;
    }

    code {
      background-color: var(--tiptap-btn--bg-hover);
      border-radius: var(--tiptap-border-radius-sm);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.9em;
      padding: 0.2em 0.4em;
    }

    mark {
      background-color: #faf594;
      border-radius: 0.2em;
      padding: 0.1em 0.2em;
    }

    hr {
      border: none;
      border-top: 1px solid var(--tiptap-color-border);
      margin: 1.5rem 0;
    }

    ul,
    ol {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
    }

    li {
      margin: 0.25rem 0;
    }

    /* task list */
    ul[data-type="taskList"] {
      list-style: none;
      padding-left: 0;
    }

    ul[data-type="taskList"] li {
      display: flex;
      align-items: center;
      gap: var(--tiptap-gap);
    }

    ul[data-type="taskList"] li > label {
      display: inline-flex;
      align-items: center;
    }

    ul[data-type="taskList"] li > div {
      flex: 1;
    }

    ul[data-type="taskList"] input[type="checkbox"] {
      accent-color: var(--tiptap-color-text);
      cursor: pointer;
      margin: 0;
    }

    /* code block */
    pre {
      background-color: var(--tiptap-btn--bg-hover);
      border-radius: var(--tiptap-border-radius-sm);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      margin: 0.75rem 0;
      overflow-x: auto;
      padding: var(--tiptap-padding-lg);
    }

    pre code {
      background: none;
      font-size: 0.9em;
      padding: 0;
    }

    /* details */
    details {
      border: 1px solid var(--tiptap-color-border);
      border-radius: var(--tiptap-border-radius-sm);
      margin: 0.75rem 0;
      padding: 0 0.75rem;
    }

    details summary {
      cursor: pointer;
      font-weight: bold;
      padding: 0.5rem 0;
    }

    /* media */
    img {
      border-radius: var(--tiptap-border-radius-sm);
      height: auto;
      margin: 0.75rem 0;
      max-width: 100%;
    }

    audio {
      margin: 0.75rem 0;
      width: 100%;
    }

    iframe {
      border: none;
      max-width: 100%;
    }

    /* focus extension: highlight the active block */
    .has-focus {
      border-radius: var(--tiptap-border-radius-sm);
      box-shadow: 0 0 0 2px var(--tiptap-color-border);
    }

    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;

      td,
      th {
        border: 1px solid var(--tiptap-color-border);
        box-sizing: border-box;
        min-width: 1em;
        padding: 6px 8px;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: var(--tiptap-color-bg);
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        background: var(--tiptap-color-border);
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        position: absolute;
        z-index: 2;
      }

      .column-resize-handle {
        background-color: #805ad5;
        bottom: -2px;
        pointer-events: none;
        position: absolute;
        right: -2px;
        top: 0;
        width: 4px;
      }
    }

    .tableWrapper {
      margin: 1.5rem 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: col-resize;
    }

    blockquote {
      border-left: 3px solid var(--tiptap-color-border);
      margin: 1.5rem 0;
      padding-left: 1rem;
    }

    p.is-editor-empty:first-child::before {
      color: var(--tiptap-color-text-3);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }
  }
}
</style>
