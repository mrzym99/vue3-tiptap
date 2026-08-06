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

<style scoped>
.tiptap-editor {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

<style>
.tiptap {
  flex: 1;
  outline: none;
  color: var(--naive-tiptap-color-text);
  background-color: var(--naive-tiptap-color-bg);
  padding: 0 var(--naive-tiptap-padding-lg);
  overflow-y: auto;

  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1px solid var(--naive-tiptap-color-border);
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
      background-color: var(--naive-tiptap-color-bg);
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: var(--naive-tiptap-color-border);
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
}
</style>
