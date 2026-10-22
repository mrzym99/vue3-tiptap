<template>
  <!-- Markdown reply content (v-html — not scoped, hence :deep). Rendered through
       the editor schema, so only document-supported markup reaches here. -->
  <div class="tiptap-ai-drawer__markdown" v-html="html"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { renderMarkdown } from "../../markdown";
import type { AiMarkdownProps } from "./props";

const props = defineProps<AiMarkdownProps>();

// Cached per text — during streaming only the growing reply recomputes.
const html = computed(() => renderMarkdown(props.text, props.schema));
</script>

<style lang="scss" scoped>
.tiptap-ai-drawer__markdown {
  white-space: normal; // the bubble's pre-wrap is for plain-text fallback only

  :deep(p) {
    margin: 0 0 var(--tiptap-gap-sm);

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--tiptap-gap-sm);
    padding-left: 1.4em;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: var(--tiptap-gap) 0 var(--tiptap-gap-sm);
  }

  :deep(blockquote) {
    margin: 0 0 var(--tiptap-gap-sm);
    padding-left: var(--tiptap-padding-md);
    border-left: 2px solid var(--tiptap-color-border);
    color: var(--tiptap-color-text-muted);
  }

  :deep(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
    background: color-mix(in srgb, var(--tiptap-color-border) 40%, transparent);
    border-radius: var(--tiptap-border-radius-sm);
    padding: 0.1em 0.35em;
  }

  :deep(pre) {
    margin: 0 0 var(--tiptap-gap-sm);
    padding: var(--tiptap-padding-md);
    border-radius: var(--tiptap-border-radius-md);
    background: color-mix(in srgb, var(--tiptap-color-border) 40%, transparent);
    overflow-x: auto;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(a) {
    color: var(--tiptap-accent-primary);
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid var(--tiptap-color-border);
    margin: var(--tiptap-gap) 0;
  }
}
</style>
