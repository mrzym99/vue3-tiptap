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
  width: 100%;
  max-width: var(--tiptap-max-content-width);
  /* Centered within the stretch-aligned .tiptap-box column */
  margin-inline: auto;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Scrolling is owned by the inner .tiptap surface */
  overflow: hidden;
  position: relative;
}
</style>

<style lang="scss">
.tiptap-editor {
  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 20px;
    padding: 0;
    border: 1px solid var(--tiptap-color-border);
    border-radius: var(--tiptap-border-radius-sm);
    background: var(--tiptap-color-bg-hover);
    color: var(--tiptap-color-text-muted);
    cursor: grab;
    transition:
      color 0.15s,
      background-color 0.15s,
      border-color 0.15s;

    &:hover {
      color: var(--tiptap-color-text);
      background: var(--tiptap-color-bg-active);
      border-color: var(--tiptap-color-border-strong);
    }

    &[data-dragging="true"] {
      cursor: grabbing;
    }
  }

  .tiptap {
    flex: 1;
    outline: none;
    color: var(--tiptap-color-text);
    background-color: var(--tiptap-color-bg);
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", sans-serif;
    line-height: 1.75;
    padding: 0 var(--tiptap-content-padding);
    overflow-y: auto;

    h1,
    h2,
    h3 {
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.01em;
      margin: 1.6rem 0 0.7rem;
    }

    h1 {
      font-size: 1.7em;
    }

    h2 {
      font-size: 1.35em;
    }

    h3 {
      font-size: 1.15em;
    }

    code {
      background-color: var(--tiptap-code-bg);
      border-radius: var(--tiptap-border-radius-sm);
      color: var(--tiptap-code-text);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.88em;
      padding: 0.15em 0.35em;
    }

    mark {
      background-color: var(--tiptap-mark-bg);
      border-radius: 0.2em;
      padding: 0.1em 0.2em;
    }

    hr {
      border: none;
      border-top: 1px solid var(--tiptap-color-border);
      margin: 1.75rem 0;
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
      accent-color: var(--tiptap-accent-blue);
      cursor: pointer;
      margin: 0;
    }

    /* code block */
    pre {
      background-color: var(--tiptap-code-bg);
      border-radius: var(--tiptap-border-radius-sm);
      color: var(--tiptap-code-text);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.9em;
      line-height: 1.6;
      margin: 0.9rem 0;
      overflow-x: auto;
      padding: var(--tiptap-padding-lg);
    }

    pre code {
      background: none;
      font-size: 0.9em;
      padding: 0;
    }

    /* details (toggle block) */
    div[data-type="details"] {
      border: 1px solid var(--tiptap-color-border);
      border-radius: var(--tiptap-border-radius-sm);
      display: flex;
      margin: 0.75rem 0;
      padding: var(--tiptap-padding-xs) var(--tiptap-padding-md);
      transition: background-color 150ms ease;

      /* toggle button (chevron) injected by the Details node view */
      > button[data-open] {
        align-items: center;
        align-self: flex-start;
        background: none;
        border: none;
        border-radius: var(--tiptap-border-radius-sm);
        color: var(--tiptap-color-text-muted);
        cursor: pointer;
        display: inline-flex;
        flex: 0 0 auto;
        justify-content: center;
        margin-top: var(--tiptap-padding-sm);
        padding: var(--tiptap-padding-xs);
        transition:
          background-color 150ms ease,
          color 150ms ease;

        &:hover {
          background-color: var(--tiptap-btn-bg-hover);
          color: var(--tiptap-color-text);
        }
      }

      /* content wrapper (summary + content block) */
      > div:last-child {
        flex: 1 1 auto;
        min-width: 0;
      }

      /* folded state: hide the content block, keep the summary header */
      &:not(.is-open) [data-type="detailsContent"] {
        display: none;
      }

      &.is-open {
        background-color: var(--tiptap-color-bg);
      }
    }

    details summary {
      cursor: pointer;
      font-weight: 600;
      padding: 0.5rem 0;
    }

    /* media — natural size when no width is set, centered either way */
    img {
      border-radius: var(--tiptap-border-radius-sm);
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0;
      object-fit: cover;
    }

    // Media (image, video) is rendered through a shared ResizableNodeView
    .tiptap-media-resizer {
      justify-content: center;
      margin: 2rem 0;
      max-width: 100%;
    }

    .tiptap-media-resizer-wrapper {
      max-width: 100%;
    }

    .tiptap-media-resizer iframe {
      display: block;
      margin: 0;
      max-width: 100%;
    }

    .tiptap-media-resizer[data-resize-state="true"] iframe {
      pointer-events: none;
    }

    .tiptap-media-resizer [data-resize-handle] {
      box-sizing: border-box;
      width: 12px;
      height: 12px;
      background: var(--tiptap-accent-blue);
      border: 2px solid var(--tiptap-color-bg);
      border-radius: 4px;
      opacity: 0;
      transition: opacity 150ms ease;
    }

    .tiptap-media-resizer:hover [data-resize-handle],
    .tiptap-media-resizer.ProseMirror-selectednode [data-resize-handle],
    .tiptap-media-resizer[data-resize-state="true"] [data-resize-handle] {
      opacity: 1;
    }

    .tiptap-media-resizer [data-resize-handle="bottom-right"] {
      transform: translate(50%, 50%);
      cursor: nwse-resize;
    }

    .tiptap-media-resizer [data-resize-handle="top-left"] {
      transform: translate(-50%, -50%);
      cursor: nwse-resize;
    }

    .tiptap-media-resizer [data-resize-handle="top-right"] {
      transform: translate(50%, -50%);
      cursor: nesw-resize;
    }

    .tiptap-media-resizer [data-resize-handle="bottom-left"] {
      transform: translate(-50%, 50%);
      cursor: nesw-resize;
    }

    audio {
      margin: 1rem auto;
      width: 100%;
    }

    iframe {
      border: none;
      display: block;
      margin: 1rem auto;
      max-width: 100%;
    }

    .has-focus {
      border-radius: var(--tiptap-border-radius-sm);
      box-shadow: 0 0 0 2px var(--tiptap-focus-ring);
    }

    iframe.ProseMirror-selectednode,
    audio.ProseMirror-selectednode,
    video.ProseMirror-selectednode {
      outline: 2px solid var(--tiptap-focus-ring);
    }

    .tiptap-media-resizer.ProseMirror-selectednode .tiptap-media-resizer-wrapper {
      outline: 2px solid var(--tiptap-focus-ring);
      border-radius: var(--tiptap-border-radius-sm);
    }

    .tiptap .tiptap-media-resizer.ProseMirror-selectednode {
      background-color: transparent;
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
          margin: 0;
        }
      }

      th {
        background-color: var(--tiptap-color-bg-subtle);
        font-weight: 600;
        text-align: left;
      }

      .selectedCell:after {
        background: var(--tiptap-selection-bg);
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
        background-color: var(--tiptap-accent-blue);
        bottom: -2px;
        pointer-events: none;
        position: absolute;
        right: -2px;
        top: 0;
        width: 4px;
        z-index: 3;
      }
    }

    .tableWrapper {
      margin: 1.5rem 0;
      overflow-x: auto;
    }

    &.resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }

    blockquote {
      border-left: 3px solid var(--tiptap-color-border);
      border-radius: 0 var(--tiptap-border-radius-sm) var(--tiptap-border-radius-sm) 0;
      color: var(--tiptap-color-text-muted);
      margin: 1.5rem 0;
      padding: 0.1rem 1rem;
    }

    // Mention node (@mention): inline pill style, follows theme variables
    span[data-type="mention"] {
      background-color: var(--tiptap-accent-blue-bg);
      border-radius: var(--tiptap-border-radius-sm);
      color: var(--tiptap-accent-blue);
      padding: 0.1em 0.35em;
      font-weight: 500;
    }

    p.is-editor-empty:first-child::before {
      color: var(--tiptap-color-text-muted);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }

    div[data-youtube-video] iframe {
      border: 2px solid var(--tiptap-color-border);
      outline: none;
      display: block;
      cursor: move;
    }

    div[data-twitch-video] iframe {
      border: 2px solid var(--tiptap-color-border);
      outline: none;
      display: block;
      cursor: move;
    }

    /* refined, quiet scrollbar inside the writing surface */
    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      display: none;
    }
  }
}
</style>
